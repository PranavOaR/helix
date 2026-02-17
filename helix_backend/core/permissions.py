"""
Permission classes for Helix backend.

Provides role-based access control at the API layer.
"""

from rest_framework.permissions import BasePermission

from core.models import User


class IsAdminUser(BasePermission):
    """
    Allows access only to users whose role is ADMIN.

    Usage:
        permission_classes = [IsAuthenticated, IsAdminUser]
    """

    message = "Admin access required."

    def has_permission(self, request, view):
        return (
            hasattr(request, "user")
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == User.Role.ADMIN
        )
