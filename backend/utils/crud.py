import utils.data_init as data_init

def new_task(proj_name, prio, due_date, subtasks, status):
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

def read_tasks():
    data = data_init.load_data()
    print("\n--- Current Kanban Tasks ---")
    for record in data:
        print(f"ID: {record['task_id']} | Project: {record['proj_name']} | Priority: {record['prio']} | Due: {record['due_date']} | Status: {record['status']}")
        print(f"Subtasks: {record['subtasks']}")
    print("----------------------------\n")
    
    return data 

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

def delete_task(task_id):
    data = data_init.load_data()
    new_data = [record for record in data if record["task_id"] != task_id]
    if len(new_data) < len(data):
        data_init.save_data(new_data)
        print(f"Successfully deleted task ID {task_id}")
    else:
        print(f"Task ID {task_id} not found.")

def new_subtask(task_id, task_text, status="pending"):
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