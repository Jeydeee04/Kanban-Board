import utils.data_init as data_init

def update_task(task_id, proj_name=None, prio=None, due_date=None, status=None):
    data = data_init.load_data()
    updated = False
    for record in data:
        if record["task_id"] == task_id:
            if proj_name:
                record["proj_name"] = proj_name
            if prio:
                record["prio"] = prio
            if due_date:
                record["due_date"] = due_date
            if status:
                record["status"] = status
            updated = True
            break
    if updated:
        data_init.save_data(data)
        print(f"Successfully updated task ID {task_id}")
    else:
        print(f"Task ID {task_id} not found.")