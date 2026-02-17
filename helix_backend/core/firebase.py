"""
Firebase Admin SDK Initialization

Initializes Firebase using service account credentials from environment variables.
Called once on Django startup via helix_backend/__init__.py.
"""

import logging
import firebase_admin
from firebase_admin import credentials
from decouple import config

logger = logging.getLogger(__name__)


def initialize_firebase():
    """
    Initialize the Firebase Admin SDK.

    Reads credentials from environment variables:
        - FIREBASE_PROJECT_ID
        - FIREBASE_CLIENT_EMAIL
        - FIREBASE_PRIVATE_KEY

    Skips initialization if already initialized or if credentials are missing.
    """
    if firebase_admin._apps:
        return  # Already initialized

    try:
        project_id = config("FIREBASE_PROJECT_ID", default=None)
        client_email = config("FIREBASE_CLIENT_EMAIL", default=None)
        private_key = config("FIREBASE_PRIVATE_KEY", default=None)

        if not all([project_id, client_email, private_key]):
            logger.warning(
                "Firebase Admin SDK initialization skipped — "
                "missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY"
            )
            return

        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": project_id,
            "client_email": client_email,
            "private_key": private_key.replace("\\n", "\n"),
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")

    except Exception as e:
        logger.error(f"Firebase Admin SDK initialization failed: {e}")
