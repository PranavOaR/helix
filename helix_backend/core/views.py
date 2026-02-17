"""
API Views for Helix Platform — Phase 2

Auth endpoints:
    GET  /api/auth/me/                         → current user profile

User endpoints:
    POST /api/requests/                        → create a request
    GET  /api/requests/                        → list own requests
    GET  /api/requests/<id>/activities/         → activity log for own request

Admin endpoints:
    GET    /api/admin/requests/                → list ALL requests
    PATCH  /api/admin/requests/<id>/           → update request status
    DELETE /api/admin/requests/<id>/           → delete a request
    POST   /api/admin/requests/<id>/assign/    → assign request to admin
    GET    /api/admin/requests/<id>/activities/ → activity log (admin)
"""

import logging

from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from core.models import Request, RequestActivity, User
from core.serializers import (
    RequestCreateSerializer,
    RequestSerializer,
    RequestStatusSerializer,
    RequestAssignSerializer,
    RequestActivitySerializer,
)
from core.permissions import IsAdminUser
from core import services

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════
#  Auth Endpoint
# ═══════════════════════════════════════════════════════════════════


class AuthMeView(APIView):
    """
    GET /api/auth/me/  → current authenticated user profile

    Returns uid, email, role, is_active, and created_at.
    Serves as the frontend's single source of truth for auth state.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "uid": user.uid,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "is_admin": user.is_admin(),
                "created_at": user.created_at,
            },
            status=status.HTTP_200_OK,
        )


# ═══════════════════════════════════════════════════════════════════
#  User Endpoints
# ═══════════════════════════════════════════════════════════════════


class UserRequestListCreateView(ListCreateAPIView):
    """
    GET  /api/requests/  → list the authenticated user's requests
    POST /api/requests/  → create a new request

    Supports:
        - Filtering by status:  ?status=PENDING
        - Ordering:             ?ordering=-created_at  (default)
        - Pagination:           automatic via settings
    """

    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["status", "priority"]
    ordering_fields = ["created_at", "updated_at", "priority"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return RequestCreateSerializer
        return RequestSerializer

    def get_queryset(self):
        """Return only the authenticated user's requests."""
        return Request.objects.filter(user=self.request.user).select_related(
            "user", "assigned_to"
        )

    def create(self, request, *args, **kwargs):
        """Create a request via the service layer."""
        serializer = RequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        req = services.create_request(
            user=request.user,
            title=serializer.validated_data["title"],
            description=serializer.validated_data["description"],
            priority=serializer.validated_data.get("priority"),
        )

        return Response(
            {
                "success": True,
                "message": "Request created successfully.",
                "request": RequestSerializer(req).data,
            },
            status=status.HTTP_201_CREATED,
        )


class UserRequestActivitiesView(ListAPIView):
    """
    GET /api/requests/<id>/activities/  → activity log for own request

    Users can only see activities for their own requests.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RequestActivitySerializer

    def get_queryset(self):
        return RequestActivity.objects.filter(
            request_id=self.kwargs["pk"],
            request__user=self.request.user,
        ).select_related("performed_by")


# ═══════════════════════════════════════════════════════════════════
#  Admin Endpoints
# ═══════════════════════════════════════════════════════════════════


class AdminRequestListView(ListAPIView):
    """
    GET /api/admin/requests/  → list ALL requests (admin only)

    Supports:
        - Filtering by status:  ?status=PENDING
        - Filtering by priority: ?priority=HIGH
        - Ordering:             ?ordering=-created_at
        - Pagination:           automatic via settings
    """

    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = RequestSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["status", "priority", "assigned_to"]
    ordering_fields = ["created_at", "updated_at", "priority"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Request.objects.all().select_related("user", "assigned_to")


class AdminRequestDetailView(APIView):
    """
    PATCH  /api/admin/requests/<id>/  → update workflow status
    DELETE /api/admin/requests/<id>/  → delete a request
    """

    permission_classes = [IsAuthenticated, IsAdminUser]

    def _get_request_or_404(self, pk):
        try:
            return Request.objects.select_related("user", "assigned_to").get(pk=pk)
        except Request.DoesNotExist:
            return None

    def patch(self, request, pk):
        """Update request status and/or priority."""
        req = self._get_request_or_404(pk)
        if req is None:
            return Response(
                {"success": False, "message": "Request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        messages = []

        # Handle status change
        new_status = request.data.get("status")
        if new_status:
            serializer = RequestStatusSerializer(data={"status": new_status})
            serializer.is_valid(raise_exception=True)
            try:
                req = services.change_request_status(
                    request_obj=req,
                    new_status=serializer.validated_data["status"],
                    changed_by=request.user,
                )
                messages.append(f"Status updated to {req.status}")
            except DjangoValidationError as e:
                return Response(
                    {"success": False, "message": e.message},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Handle priority change
        new_priority = request.data.get("priority")
        if new_priority:
            valid_priorities = [c[0] for c in Request.Priority.choices]
            if new_priority not in valid_priorities:
                return Response(
                    {"success": False, "message": f"Invalid priority. Must be one of: {', '.join(valid_priorities)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            old_priority = req.priority
            req.priority = new_priority
            req.save(update_fields=["priority", "updated_at"])
            services.log_activity(
                request_obj=req,
                action=RequestActivity.Action.STATUS_CHANGED,
                performed_by=request.user,
                detail=f"Priority changed from {old_priority} to {new_priority}",
            )
            messages.append(f"Priority updated to {new_priority}")

        if not messages:
            return Response(
                {"success": False, "message": "No fields to update. Send 'status' and/or 'priority'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": ". ".join(messages) + ".",
                "request": RequestSerializer(req).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):
        """Delete a request."""
        req = self._get_request_or_404(pk)
        if req is None:
            return Response(
                {"success": False, "message": "Request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        req_id = req.id
        req.delete()

        logger.info(f"[ADMIN] Request id={req_id} deleted by {request.user.email}")

        return Response(
            {"success": True, "message": "Request deleted successfully."},
            status=status.HTTP_200_OK,
        )


class AdminAssignView(APIView):
    """
    POST /api/admin/requests/<id>/assign/  → assign request to admin user

    Body: {"assigned_to": <user_id>}  or  {"assigned_to": null}  to unassign
    """

    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            req = Request.objects.select_related("user", "assigned_to").get(pk=pk)
        except Request.DoesNotExist:
            return Response(
                {"success": False, "message": "Request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = RequestAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assigned_to_id = serializer.validated_data.get("assigned_to")
        admin_user = None
        if assigned_to_id is not None:
            admin_user = User.objects.get(pk=assigned_to_id)

        try:
            req = services.assign_request(
                request_obj=req,
                admin_user=admin_user,
                assigned_by=request.user,
            )
        except DjangoValidationError as e:
            return Response(
                {"success": False, "message": e.message},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": f"Request assigned to {admin_user.email if admin_user else 'nobody'}.",
                "request": RequestSerializer(req).data,
            },
            status=status.HTTP_200_OK,
        )


class AdminRequestActivitiesView(ListAPIView):
    """
    GET /api/admin/requests/<id>/activities/  → activity log (admin only)
    """

    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = RequestActivitySerializer

    def get_queryset(self):
        return RequestActivity.objects.filter(
            request_id=self.kwargs["pk"],
        ).select_related("performed_by")
