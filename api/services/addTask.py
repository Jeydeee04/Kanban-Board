from firebase_admin import firestore
from utils.firebase_init import db

def add_task(proj_name, prio, due_date, status):
    new_record = {
        "proj_name": proj_name,
        "prio": prio,
        "due_date": due_date,
        "status": status,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    db.collection("tasks").add(new_record)