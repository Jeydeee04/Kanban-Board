import utils.data_init as data_init

def delete_subtask(task_id, subtask_id):
    data = data_init.load_data()
    updated = False
    for record in data:
        if record["task_id"] == task_id:
            initial_length = len(record["subtasks"])
            record["subtasks"] = [sub for sub in record["subtasks"] if sub["id"] != subtask_id]
            if len(record["subtasks"]) < initial_length:
                updated = True
            break
    if updated:
        data_init.save_data(data)
        print(f"Successfully deleted subtask ID {subtask_id} from task ID {task_id}")
    else:
        print(f"Task ID {task_id} or Subtask ID {subtask_id} not found.")