"""
Authentication API Views

Provides endpoints for user authentication and profile management.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class MeView(APIView):
    """
    Current user endpoint - single source of truth for authenticated user info.
    
    GET /api/auth/me/
    
    Returns:
        {
            "uid": "firebase_uid_string",
            "email": "user@example.com",
            "role": "USER" or "ADMIN",
            "brand_name": "Company Name",
            "created_at": "2026-01-28T10:30:00Z"
        }
    
    Requires:
        - Valid Firebase authentication token in Authorization header
        - User must exist in database (auto-created on first auth)
    
    This endpoint:
        - Proves backend authentication works
        - Proves Firebase → DB user mapping works
        - Proves RBAC (role-based access control) works
        - Serves as single source of truth for frontend
    """
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current authenticated user information."""
        user = request.user  # This is a Brand object from FirebaseAuthentication
        
        return Response({
            "uid": user.uid,
            "email": user.email,
            "role": user.role,
            "brand_name": user.brand_name,
            "created_at": user.created_at,
            "is_admin": user.is_admin(),
        }, status=status.HTTP_200_OK)
