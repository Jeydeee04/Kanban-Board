from flask import Blueprint, jsonify, request
from services.readTask import read_tasks 
from services.updateTask import update_task 
from services.deleteTask import delete_task
from services.addTask import add_task

tasks = Blueprint('tasks', __name__)

@tasks.route("/tasks", methods=["GET"])
def get_tasks():
    data = read_tasks()
    if data is None:
        data = []
    return jsonify(data), 200

@tasks.route("/tasks", methods=["POST"])
def create_task():
    req_data = request.get_json() or {}
    proj_name = req_data.get("proj_name")
    prio = req_data.get("prio")
    due_date = req_data.get("due_date")
    subtasks = req_data.get("subtasks", [])
    status = req_data.get("status", "todo")

    add_task(proj_name, prio, due_date, subtasks, status)
    return jsonify({"message": "Task created successfully."}), 201

@tasks.route("/tasks/<int:task_id>", methods=["PUT"])
def modify_task(task_id):
    req_data = request.get_json() or {}
    proj_name = req_data.get("proj_name")
    prio = req_data.get("prio")
    due_date = req_data.get("due_date")
    status = req_data.get("status")

    update_task(task_id, proj_name, prio, due_date, status)
    return jsonify({"message": f"Task ID {task_id} update processed."}), 200

@tasks.route("/tasks/<int:task_id>", methods=["DELETE"])
def remove_task(task_id):
    delete_task(task_id)
    return jsonify({"message": f"Task ID {task_id} delete processed."}), 200

