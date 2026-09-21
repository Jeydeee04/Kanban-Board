import utils.data_init as data_init

def add_subtask(task_id, task_text, status="pending"):
    data = data_init.load_data()
    updated = False
    for record in data:
        if record["task_id"] == task_id:
            subtasks = record["subtasks"]
            new_sub_id = subtasks[-1]["id"] + 1 if subtasks else 1
            new_sub = {"id": new_sub_id, "task": task_text, "status": status}
            subtasks.append(new_sub)
            updated = True
            break
    if updated:
        data_init.save_data(data)
        print(f"Successfully added subtask to task ID {task_id}")
    else:
        print(f"Task ID {task_id} not found.")