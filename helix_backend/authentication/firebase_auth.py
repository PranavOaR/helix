"""
Firebase Authentication Backend for Django REST Framework

This module provides Firebase ID token verification for API authentication.
Frontend sends: Authorization: Bearer <firebase_id_token>
Backend verifies token and extracts user UID.

Also provides:
- FirebaseUser object with role/admin status
- Admin permission class for protecting admin routes
- Helper to set Firebase custom claims
"""

import logging
from functools import wraps
from rest_framework import authentication, permissions
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth

logger = logging.getLogger(__name__)


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Custom DRF authentication class that verifies Firebase ID tokens.
    
    How it works:
    1. Extract token from Authorization header (Bearer <token>)
    2. Verify token using Firebase Admin SDK
    3. Extract user UID, email, and custom claims from verified token
    4. Return FirebaseUser with role info for API access
    """
    
    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).
        
        Args:
            request: Django REST Framework request object
            
        Returns:
            tuple: (FirebaseUser, decoded_token) or None if no auth header
            
        Raises:
            AuthenticationFailed: If token is invalid or verification fails
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return None  # No authentication provided, will be handled by permission classes
        
        # Extract token from "Bearer <token>" format
        try:
            parts = auth_header.split(' ')
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                raise exceptions.AuthenticationFailed('Invalid authorization header format. Use: Bearer <token>')
            token = parts[1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid authorization header format. Use: Bearer <token>')
        
        # Verify Firebase ID token
        try:
            decoded_token = auth.verify_id_token(token)
        except auth.InvalidIdTokenError:
            logger.warning("Invalid Firebase ID token received")
            raise exceptions.AuthenticationFailed('Invalid Firebase ID token')
        except auth.ExpiredIdTokenError:
            logger.warning("Expired Firebase token received")
            raise exceptions.AuthenticationFailed('Firebase token has expired')
        except auth.RevokedIdTokenError:
            logger.warning("Revoked Firebase token received")
            raise exceptions.AuthenticationFailed('Firebase token has been revoked')
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            raise exceptions.AuthenticationFailed(f'Token verification failed: {str(e)}')
        
        # Extract user UID from token
        uid = decoded_token.get('uid')
        if not uid:
            raise exceptions.AuthenticationFailed('Token does not contain user ID')
        
        # Extract user info from token
        email = decoded_token.get('email', '')
        
        # Check for admin custom claim from Firebase
        # Firebase custom claims are at the root level of decoded token
        is_admin_claim = decoded_token.get('admin', False)
        
        # Create FirebaseUser with all relevant info
        firebase_user = FirebaseUser(
            uid=uid,
            email=email,
            is_admin_claim=is_admin_claim,
            decoded_token=decoded_token
        )
        
        # DEBUG logging (remove in production)
        logger.info(f"[AUTH] User authenticated: email={email}, uid={uid[:8]}..., admin_claim={is_admin_claim}")
        
        return (firebase_user, decoded_token)
    
    def authenticate_header(self, request):
        """
        Return authentication scheme used in WWW-Authenticate header.
        """
        return 'Bearer'


class FirebaseUser:
    """
    User-like object that holds Firebase UID and role information.
    This makes DRF happy and provides a clean interface.
    
    Role is determined by:
    1. Firebase custom claim (admin: true) - takes priority
    2. Database role in Brand model - fallback
    """
    def __init__(self, uid, email=None, is_admin_claim=False, decoded_token=None):
        self.uid = uid
        self.email = email
        self.is_authenticated = True
        self.is_admin_claim = is_admin_claim  # From Firebase custom claims
        self.decoded_token = decoded_token or {}
        self._db_role = None  # Cached database role
    
    @property
    def role(self):
        """
        Get user role. Priority: Firebase claim > Database role > Default USER
        """
        if self.is_admin_claim:
            return 'ADMIN'
        
        # Lazy load from database if not cached
        if self._db_role is None:
            self._db_role = self._get_db_role()
        
        return self._db_role
    
    @property
    def is_admin(self):
        """Check if user has admin privileges."""
        return self.role == 'ADMIN'
    
    def _get_db_role(self):
        """
        Get role from database Brand model.
        Returns 'USER' as default if not found.
        """
        try:
            # Import here to avoid circular imports
            from projects.models import Brand
            
            # Try to find by email first (more reliable), then by UID
            brand = None
            if self.email:
                try:
                    brand = Brand.objects.get(email=self.email)
                except Brand.DoesNotExist:
                    pass
            
            if not brand:
                try:
                    brand = Brand.objects.get(uid=self.uid)
                except Brand.DoesNotExist:
                    pass
            
            if brand:
                logger.debug(f"[AUTH] DB role for {self.email}: {brand.role}")
                return brand.role
            
        except Exception as e:
            logger.error(f"[AUTH] Error fetching DB role: {e}")
        
        return 'USER'  # Default role
    
    def __str__(self):
        return self.uid


class IsAdminUser(permissions.BasePermission):
    """
    Permission class that only allows admin users.
    
    Usage in views:
        @permission_classes([IsAuthenticated, IsAdminUser])
        def admin_only_view(request):
            ...
    """
    message = 'Admin access required'
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        is_admin = getattr(request.user, 'is_admin', False)
        
        # DEBUG logging
        logger.info(f"[ADMIN CHECK] User: {request.user.email}, is_admin: {is_admin}")
        
        if not is_admin:
            logger.warning(f"[ADMIN CHECK] Access denied for user: {request.user.email}")
        
        return is_admin


def require_admin(view_func):
    """
    Decorator for function-based views to require admin access.
    
    Usage:
        @api_view(['GET'])
        @permission_classes([IsAuthenticated])
        @require_admin
        def admin_only_view(request):
            ...
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not hasattr(request, 'user') or not request.user:
            return Response(
                {'success': False, 'message': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        is_admin = getattr(request.user, 'is_admin', False)
        user_email = getattr(request.user, 'email', 'unknown')
        
        # DEBUG logging
        logger.info(f"[ADMIN DECORATOR] User: {user_email}, is_admin: {is_admin}")
        
        if not is_admin:
            logger.warning(f"[ADMIN DECORATOR] Access denied for user: {user_email}")
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return view_func(request, *args, **kwargs)
    
    return wrapper


def set_admin_claim(uid, is_admin=True):
    """
    Set the admin custom claim for a Firebase user.
    
    Args:
        uid: Firebase user UID
        is_admin: Boolean, True to grant admin, False to revoke
    
    Usage:
        from authentication.firebase_auth import set_admin_claim
        set_admin_claim('firebase-user-uid-here', is_admin=True)
    
    Note: User must re-authenticate (or force token refresh) for claim to take effect.
    """
    try:
        auth.set_custom_user_claims(uid, {'admin': is_admin})
        logger.info(f"[ADMIN CLAIM] Set admin={is_admin} for UID: {uid}")
        return True
    except Exception as e:
        logger.error(f"[ADMIN CLAIM] Failed to set claim: {e}")
        return False


def get_user_claims(uid):
    """
    Get custom claims for a Firebase user.
    
    Args:
        uid: Firebase user UID
        
    Returns:
        dict: Custom claims or empty dict
    """
    try:
        user = auth.get_user(uid)
        return user.custom_claims or {}
    except Exception as e:
        logger.error(f"[CLAIMS] Failed to get claims for {uid}: {e}")
        return {}
