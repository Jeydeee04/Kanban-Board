# api/utils/firebase_init.py
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Path from 'api/utils/' up to the root 'Kanban Board/.env'
# Go up two levels: utils/ -> api/ -> Kanban Board/
root_env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=root_env_path)

# Prevent re-initialization error if the serverless function re-runs
if not firebase_admin._apps:
    service_account_env = os.getenv("FIREBASE_SERVICE_ACCOUNT")

    if service_account_env:
        try:
            if service_account_env.strip().startswith("{"):
                service_account_info = json.loads(service_account_env)
            else:
                service_account_info = json.loads(service_account_env.encode().decode('unicode-escape'))
                
            cred = credentials.Certificate(service_account_info)
        except Exception as e:
            raise ValueError(f"Failed to parse FIREBASE_SERVICE_ACCOUNT JSON from environment: {e}")
    else:
        # Fallback to local file inside 'api/' named serviceAccountKey.json
        # Go up one level from utils/ to api/
        local_key_path = os.path.join(os.path.dirname(__file__), "..", "serviceAccountKey.json")
        if os.path.exists(local_key_path):
            cred = credentials.Certificate(local_key_path)
        else:
            raise ValueError("Firebase credentials missing! Set FIREBASE_SERVICE_ACCOUNT in root .env or provide api/serviceAccountKey.json.")

    firebase_admin.initialize_app(cred)

db = firestore.client()