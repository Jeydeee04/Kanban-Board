from flask import Flask, jsonify
from routes.tasks import tasks
from routes.subtasks import subtasks
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(tasks, url_prefix='/api')
app.register_blueprint(subtasks, url_prefix='/api')

@app.route('/api/status')
def api_status():
    return jsonify({"status": "healthy", "version": "1.0"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)