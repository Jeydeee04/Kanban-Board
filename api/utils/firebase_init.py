from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore

CURRENT_DIR = Path(__file__).resolve().parent
KEY_PATH = CURRENT_DIR / "serviceAccountKey.json"

if not firebase_admin._apps:
    cred = credentials.Certificate(str(KEY_PATH))
    firebase_admin.initialize_app(cred)

db = firestore.client()