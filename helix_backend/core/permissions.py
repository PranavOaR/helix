"""
Role-Based Access Control (RBAC) permissions for Helix backend.

These permissions enforce authorization at the API level, not just in the frontend.
"""

from rest_framework.permissions import BasePermission
from core.constants import Roles


class IsAdmin(BasePermission):
    """
    Permission class that only allows admin users.
    
    Usage:
        @permission_classes([IsAuthenticated, IsAdmin])
        def admin_only_view(request):
            ...
    """
    
    def has_permission(self, request, view):
        """Check if user has admin role."""
        return (
            hasattr(request, "user")
            and hasattr(request.user, "role")
            and request.user.role == Roles.ADMIN
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Permission class that allows object access to:
    - Admins (can access any object)
    - Owners (can access their own objects)
    
    Usage:
        @permission_classes([IsAuthenticated, IsOwnerOrAdmin])
        def retrieve_project(request, pk):
            project = get_object_or_404(Project, pk=pk)
            self.check_object_permissions(request, project)
            ...
    
    Note: The object must have a 'brand' field that references the Brand model.
    """
    
    def has_object_permission(self, request, view, obj):
        """
        Check if user can access this specific object.
        
        Args:
            request: DRF request with authenticated user
            view: The view being accessed
            obj: The object being accessed (must have 'brand' attribute)
            
        Returns:
            bool: True if user is admin or owns the object
        """
        # Admins can access everything
        if hasattr(request.user, "role") and request.user.role == Roles.ADMIN:
            return True
        
        # Check if object belongs to user
        # Adjust 'brand' to match your model's foreign key field name
        if hasattr(obj, "brand"):
            return obj.brand == request.user
        
        # Fallback: deny access if no brand field
        return False
