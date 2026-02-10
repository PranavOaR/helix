import firebase_admin
from firebase_admin import credentials
from decouple import config

def initialize_firebase():
    if not firebase_admin._apps:
        try:
            project_id = config("FIREBASE_PROJECT_ID", default=None)
            client_email = config("FIREBASE_CLIENT_EMAIL", default=None)
            private_key = config("FIREBASE_PRIVATE_KEY", default=None)
            
            if not all([project_id, client_email, private_key]):
                print("Warning: Firebase Admin SDK initialization skipped - missing environment variables")
                print("Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in .env")
                return
            
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": project_id,
                "client_email": client_email,
                "private_key": private_key.replace("\\n", "\n"),
                "token_uri": "https://oauth2.googleapis.com/token",
            })
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK initialized successfully")
        except Exception as e:
            print(f"Warning: Firebase Admin SDK initialization failed: {e}")


