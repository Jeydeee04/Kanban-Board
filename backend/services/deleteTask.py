import utils.data_init as data_init

def delete_task(task_id):
    data = data_init.load_data()
    new_data = [record for record in data if record["task_id"] != task_id]
    if len(new_data) < len(data):
        data_init.save_data(new_data)
        print(f"Successfully deleted task ID {task_id}")
    else:
        print(f"Task ID {task_id} not found.")