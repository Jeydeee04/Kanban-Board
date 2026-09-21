from flask import Flask, request, jsonify
import utils.crud as crud
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/tasks", methods=["GET"])
def get_tasks():
    data = crud.read_tasks()
    if data is None:
        data = []
    return jsonify(data), 200

@app.route("/tasks", methods=["POST"])
def create_task():
    req_data = request.get_json() or {}
    proj_name = req_data.get("proj_name")
    prio = req_data.get("prio")
    due_date = req_data.get("due_date")
    subtasks = req_data.get("subtasks", [])
    status = req_data.get("status", "todo")

    crud.new_task(proj_name, prio, due_date, subtasks, status)
    return jsonify({"message": "Task created successfully."}), 201

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def modify_task(task_id):
    req_data = request.get_json() or {}
    proj_name = req_data.get("proj_name")
    prio = req_data.get("prio")
    due_date = req_data.get("due_date")
    status = req_data.get("status")

    crud.update_task(task_id, proj_name, prio, due_date, status)
    return jsonify({"message": f"Task ID {task_id} update processed."}), 200

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def remove_task(task_id):
    crud.delete_task(task_id)
    return jsonify({"message": f"Task ID {task_id} delete processed."}), 200

@app.route("/tasks/<int:task_id>/subtasks", methods=["POST"])
def add_subtask(task_id):
    req_data = request.get_json() or {}
    task_text = req_data.get("task")
    status = req_data.get("status", "pending")
    
    if not task_text:
        return jsonify({"error": "Task text is required."}), 400

    crud.new_subtask(task_id, task_text, status)
    return jsonify({"message": f"Subtask added to task ID {task_id}."}), 201

@app.route("/tasks/<int:task_id>/subtasks/<int:subtask_id>", methods=["PUT"])
def modify_subtask(task_id, subtask_id):
    req_data = request.get_json() or {}
    new_task_text = req_data.get("task")
    status = req_data.get("status")

    crud.update_subtask(task_id, subtask_id, new_task_text, status)
    return jsonify({"message": f"Subtask ID {subtask_id} update processed."}), 200

@app.route("/tasks/<int:task_id>/subtasks/<int:subtask_id>", methods=["DELETE"])
def remove_subtask(task_id, subtask_id):
    crud.delete_subtask(task_id, subtask_id)
    return jsonify({"message": f"Subtask ID {subtask_id} delete processed."}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)