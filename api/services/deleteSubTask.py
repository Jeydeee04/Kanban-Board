from firebase_admin import firestore
from utils.firebase_init import db

def delete_subtask(task_id, subtask_id):
    task_ref = db.collection("tasks").document(task_id)

    if task_ref.get().exists:
        subtask_ref = task_ref.collection("subtasks").document(subtask_id)
        if subtask_ref.get().exists:
            subtask_ref.delete()