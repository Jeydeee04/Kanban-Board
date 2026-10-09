from firebase_admin import firestore
from utils.firebase_init import db

def update_task(task_id, proj_name, prio, due_date, status):
    task_ref = db.collection("tasks").document(task_id)
    new_record = {"updated_at": firestore.SERVER_TIMESTAMP}

    if task_ref.get().exists:
        if not proj_name == None:
            new_record['proj_name'] = proj_name
    
        if not prio == None:
            new_record['prio'] = prio
    
        if not due_date == None:
            new_record['due_date'] = due_date

        if not status == None:
            new_record['status'] = status

        task_ref.update(new_record)