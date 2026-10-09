from firebase_admin import firestore
from utils.firebase_init import db

def delete_task(task_id):
    task_ref = db.collection("tasks").document(task_id)
    if task_ref.get().exists:
        task_ref.delete()