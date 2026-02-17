"""
URL Configuration for core app — Phase 2

Auth endpoints:
    GET  /api/auth/me/                          → current user profile

User endpoints:
    POST /api/requests/                         → create request
    GET  /api/requests/                         → list own requests
    GET  /api/requests/<id>/activities/          → activity log for own request

Admin endpoints:
    GET    /api/admin/requests/                 → list all requests
    PATCH  /api/admin/requests/<id>/            → update workflow status
    DELETE /api/admin/requests/<id>/            → delete request
    POST   /api/admin/requests/<id>/assign/     → assign to admin
    GET    /api/admin/requests/<id>/activities/  → activity log (admin)
"""

from django.urls import path

from core.views import (
    AuthMeView,
    UserRequestListCreateView,
    UserRequestActivitiesView,
    AdminRequestListView,
    AdminRequestDetailView,
    AdminAssignView,
    AdminRequestActivitiesView,
)

urlpatterns = [
    # ── Auth endpoint ────────────────────────────────────────────
    path("auth/me/", AuthMeView.as_view(), name="auth-me"),

    # ── User endpoints ───────────────────────────────────────────
    path("requests/", UserRequestListCreateView.as_view(), name="user-requests"),
    path(
        "requests/<int:pk>/activities/",
        UserRequestActivitiesView.as_view(),
        name="user-request-activities",
    ),

    # ── Admin endpoints ──────────────────────────────────────────
    path("admin/requests/", AdminRequestListView.as_view(), name="admin-requests"),
    path(
        "admin/requests/<int:pk>/",
        AdminRequestDetailView.as_view(),
        name="admin-request-detail",
    ),
    path(
        "admin/requests/<int:pk>/assign/",
        AdminAssignView.as_view(),
        name="admin-request-assign",
    ),
    path(
        "admin/requests/<int:pk>/activities/",
        AdminRequestActivitiesView.as_view(),
        name="admin-request-activities",
    ),
]
