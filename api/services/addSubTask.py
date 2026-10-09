from firebase_admin import firestore
from utils.firebase_init import db

def add_subtask(task_id, task_text, status="pending"):
    task_ref = db.collection("tasks").document(task_id)
    
    if task_ref.get().exists:
        subtask_ref = task_ref.collection("subtasks").document()
        subtask_ref.set({
            "task_text": task_text,
            "status": status,
            "created_at": firestore.SERVER_TIMESTAMP
        })
        
        task_ref.update({
            "updated_at": firestore.SERVER_TIMESTAMP
        })