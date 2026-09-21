import utils.data_init as data_init

def read_tasks():
    data = data_init.load_data()
    print("\n--- Current Kanban Tasks ---")
    for record in data:
        print(f"ID: {record['task_id']} | Project: {record['proj_name']} | Priority: {record['prio']} | Due: {record['due_date']} | Status: {record['status']}")
        print(f"Subtasks: {record['subtasks']}")
    print("----------------------------\n")
    
    return data 