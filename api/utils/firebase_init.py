import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Prevent re-initialization error if the serverless function re-runs
if not firebase_admin._apps:
    service_account_env = os.getenv("FIREBASE_SERVICE_ACCOUNT")

    if service_account_env:
        # Load credentials directly from the environment variable JSON string
        service_account_info = json.loads(service_account_env)
        cred = credentials.Certificate(service_account_info)
    else:
        # Fallback to local file for local development
        local_key_path = os.path.join(os.path.dirname(__file__), "..", "serviceAccount.json")
        if os.path.exists(local_key_path):
            cred = credentials.Certificate(local_key_path)
        else:
            raise ValueError("Firebase credentials missing! Set FIREBASE_SERVICE_ACCOUNT in environment variables.")

    firebase_admin.initialize_app(cred)

db = firestore.client()