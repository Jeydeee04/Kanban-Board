import utils.data_init as data_init

def add_task(proj_name, prio, due_date, subtasks, status):
    data = data_init.load_data()
    new_id = data[-1]["task_id"] + 1 if data else 1
    new_record = {
        "task_id": new_id,
        "proj_name": proj_name,
        "prio": prio,
        "due_date": due_date,
        "subtasks": subtasks,
        "status": status
    }
    data.append(new_record)
    data_init.save_data(data)
    print(f"Created: {new_record}")