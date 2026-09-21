import utils.data_init as data_init

def update_subtask(task_id, subtask_id, new_task_text=None, status=None):
    data = data_init.load_data()
    updated = False
    for record in data:
        if record["task_id"] == task_id:
            for sub in record["subtasks"]:
                if sub["id"] == subtask_id:
                    if new_task_text is not None:
                        sub["task"] = new_task_text
                    if status is not None:
                        sub["status"] = status
                    updated = True
                    break
            break
    if updated:
        data_init.save_data(data)
        print(f"Successfully updated subtask ID {subtask_id} in task ID {task_id}")
    else:
        print(f"Task ID {task_id} or Subtask ID {subtask_id} not found.")