from utils.firebase_init import db
from datetime import datetime

def parse_date(date_val) -> datetime:
    if isinstance(date_val, datetime) or hasattr(date_val, "isoformat"):
        return date_val

    if isinstance(date_val, str):
        try:
            return datetime.strptime(date_val, "%a, %d %b %Y %H:%M:%S %Z")
        except ValueError:
            return datetime.fromisoformat(date_val.replace("Z", "+00:00"))

    return datetime.min

def insertion_sort_tasks_by_created_at(task_list: list, reverse: bool = False) -> list:
    for i in range(1, len(task_list)):
        key_task = task_list[i]
        key_time = parse_date(key_task["created_at"])
        j = i - 1

        # Compare parse_date values
        while j >= 0:
            current_time = parse_date(task_list[j]["created_at"])
            
            # Change comparison direction depending on reverse flag
            should_swap = (current_time < key_time) if reverse else (current_time > key_time)
            
            if should_swap:
                task_list[j + 1] = task_list[j]
                j -= 1
            else:
                break

        task_list[j + 1] = key_task

    return task_list

def read_tasks():
    data = []
    tasks = db.collection("tasks").stream()
    print("\n--- Current Kanban Tasks ---")
    for task in tasks:
        subtasks = []

        subtasks_ref = task.reference.collection("subtasks")
        subtasks_docs = subtasks_ref.stream()
        print(f"ID: {task.id} => {task.to_dict()}")

        for subtask in subtasks_docs:
            subtask_dict = subtask.to_dict()
            subtasks.append({
                "id": subtask.id,
                "task": subtask_dict['task_text'],
                "status": subtask_dict['status']
            })
        
        task_dict = task.to_dict()
        data.append({
            "task_id": task.id,
            "proj_name": task_dict['proj_name'],
            "prio": task_dict['prio'],
            "due_date": task_dict['due_date'],
            "status": task_dict['status'],
            "subtasks": subtasks,
            "created_at": task_dict['created_at']
        })
        sorted_tasks = insertion_sort_tasks_by_created_at(data, reverse=True)
    print("----------------------------\n")
    return sorted_tasks 


