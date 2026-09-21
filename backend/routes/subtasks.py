from flask import Blueprint, request, jsonify
from services.addSubTask import add_subtask
from services.updateSubTask import update_subtask
from services.deleteSubTask import delete_subtask 

subtasks = Blueprint('subtasks', __name__)

@subtasks.route("/tasks/<int:task_id>/subtasks", methods=["POST"])
def create_task(task_id):
    req_data = request.get_json() or {}
    task_text = req_data.get("task")
    status = req_data.get("status", "pending")
    
    if not task_text:
        return jsonify({"error": "Task text is required."}), 400

    add_subtask(task_id, task_text, status)
    return jsonify({"message": f"Subtask added to task ID {task_id}."}), 201

@subtasks.route("/tasks/<int:task_id>/subtasks/<int:subtask_id>", methods=["PUT"])
def modify_subtask(task_id, subtask_id):
    req_data = request.get_json() or {}
    new_task_text = req_data.get("task")
    status = req_data.get("status")

    update_subtask(task_id, subtask_id, new_task_text, status)
    return jsonify({"message": f"Subtask ID {subtask_id} update processed."}), 200

@subtasks.route("/tasks/<int:task_id>/subtasks/<int:subtask_id>", methods=["DELETE"])
def remove_subtask(task_id, subtask_id):
    delete_subtask(task_id, subtask_id)
    return jsonify({"message": f"Subtask ID {subtask_id} delete processed."}), 200
