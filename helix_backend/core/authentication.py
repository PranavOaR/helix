"""
Firebase Authentication Backend for Django REST Framework

Verifies Firebase ID tokens sent as:
    Authorization: Bearer <firebase_id_token>

On success, returns (User, decoded_token) so that:
    request.user  → core.models.User instance
    request.auth  → decoded Firebase token dict
"""

import logging

from rest_framework import authentication, exceptions
from firebase_admin import auth

from core.models import User

logger = logging.getLogger(__name__)


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    DRF authentication class that:
    1. Extracts the Bearer token from the Authorization header
    2. Verifies it with firebase_admin.auth.verify_id_token()
    3. Gets or creates a User in the database
    4. Returns (user, decoded_token)
    """

    def authenticate(self, request):
        """
        Authenticate the request.

        Returns:
            (User, decoded_token) on success, None if no auth header.

        Raises:
            AuthenticationFailed on invalid/expired/revoked tokens.
        """
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None  # Let permission classes handle unauthenticated requests

        # ── Extract token ────────────────────────────────────────
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise exceptions.AuthenticationFailed(
                "Invalid Authorization header. Expected: Bearer <token>"
            )
        token = parts[1]

        # ── Verify with Firebase ─────────────────────────────────
        try:
            decoded_token = auth.verify_id_token(token)
        except auth.InvalidIdTokenError:
            logger.warning("Invalid Firebase ID token received")
            raise exceptions.AuthenticationFailed("Invalid Firebase ID token.")
        except auth.ExpiredIdTokenError:
            logger.warning("Expired Firebase ID token received")
            raise exceptions.AuthenticationFailed("Firebase token has expired.")
        except auth.RevokedIdTokenError:
            logger.warning("Revoked Firebase ID token received")
            raise exceptions.AuthenticationFailed("Firebase token has been revoked.")
        except Exception as e:
            logger.error(f"Firebase token verification failed: {e}")
            raise exceptions.AuthenticationFailed(
                f"Token verification failed: {e}"
            )

        uid = decoded_token.get("uid")
        if not uid:
            raise exceptions.AuthenticationFailed("Token does not contain a user ID.")

        # ── Get or create User ───────────────────────────────────
        email = decoded_token.get("email", "")

        # Try email first (handles pre-created accounts with placeholder UIDs)
        user = None
        try:
            user = User.objects.get(email=email)
            # Sync UID if it was a placeholder or changed
            if user.uid != uid:
                user.uid = uid
                user.save(update_fields=["uid"])
                logger.info(f"[AUTH] Updated UID for {email}")
        except User.DoesNotExist:
            pass

        # Try UID lookup if email didn't match
        if user is None:
            try:
                user = User.objects.get(uid=uid)
                if email and user.email != email:
                    user.email = email
                    user.save(update_fields=["email"])
            except User.DoesNotExist:
                pass

        # Create new user if neither matched
        if user is None:
            user = User.objects.create(
                uid=uid,
                email=email,
                role=User.Role.USER,
            )
            logger.info(f"[AUTH] Created new user: {email}")

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User account is disabled.")

        logger.info(
            f"[AUTH] Authenticated: email={user.email}, uid={uid[:8]}…, role={user.role}"
        )

        return (user, decoded_token)

    def authenticate_header(self, request):
        """Return the scheme for WWW-Authenticate header on 401 responses."""
        return "Bearer"
