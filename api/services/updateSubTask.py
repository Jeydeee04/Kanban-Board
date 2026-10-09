from firebase_admin import firestore
from utils.firebase_init import db

def update_subtask(task_id, subtask_id, new_task_text=None, status="pending"):
    task_ref = db.collection("tasks").document(task_id)

    if task_ref.get().exists:
        subtask_ref = task_ref.collection("subtasks").document(subtask_id)

        if subtask_ref.get().exists:
            subtask_ref.update({
                "task_text": new_task_text,
                "status": status,
                "updated_at": firestore.SERVER_TIMESTAMP
            })
            
            task_ref.update({
                "updated_at": firestore.SERVER_TIMESTAMP
            })