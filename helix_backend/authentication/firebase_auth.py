"""
Firebase Authentication Backend for Django REST Framework

This module provides Firebase ID token verification for API authentication.
Frontend sends: Authorization: Bearer <firebase_id_token>
Backend verifies token and extracts user UID.
"""

from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth
from projects.models import Brand


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Custom DRF authentication class that verifies Firebase ID tokens.
    
    How it works:
    1. Extract token from Authorization header (Bearer <token>)
    2. Verify token using Firebase Admin SDK
    3. Extract user UID from verified token
    4. Return UID as user identifier for API access
    """
    
    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).
        
        Args:
            request: Django REST Framework request object
            
        Returns:
            tuple: (user_uid_string, decoded_token) or None if no auth header
            
        Raises:
            AuthenticationFailed: If token is invalid or verification fails
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return None  # No authentication provided, will be handled by permission classes
        
        # Extract token from "Bearer <token>" format
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid authorization header format. Use: Bearer <token>')
        
        # Verify Firebase ID token
        try:
            decoded_token = auth.verify_id_token(token)
        except auth.InvalidIdTokenError:
            raise exceptions.AuthenticationFailed('Invalid Firebase ID token')
        except auth.ExpiredIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase token has expired')
        except auth.RevokedIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase token has been revoked')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Token verification failed: {str(e)}')
        
        # Extract user UID from token
        uid = decoded_token.get('uid')
        if not uid:
            raise exceptions.AuthenticationFailed('Token does not contain user ID')
        
        # Get or create Brand entry for this user
        email = decoded_token.get('email', '')
        
        # Return FirebaseUser object that DRF can work with
        # DRF will set request.user to this FirebaseUser instance
        firebase_user = FirebaseUser(uid, email)
        return (firebase_user, decoded_token)
    
    def authenticate_header(self, request):
        """
        Return authentication scheme used in WWW-Authenticate header.
        """
        return 'Bearer'


class FirebaseUser:
    """
    Simple user-like object that holds Firebase UID.
    This makes DRF happy and provides a clean interface.
    """
    def __init__(self, uid, email=None):
        self.uid = uid
        self.email = email
        self.is_authenticated = True
    
    def __str__(self):
        return self.uid
