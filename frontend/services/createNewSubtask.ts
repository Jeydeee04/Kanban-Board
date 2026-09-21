import axios from "axios";

const API_BASE_URL = process.env.PUBLIC_API_URL;

export async function createNewSubtask(taskId: number, taskText: string, status: "pending" | "done" = "pending") {
    try {
        const response = await axios.post(`${API_BASE_URL}/tasks/${taskId}/subtasks`, { 
            task: taskText, 
            status 
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to add subtask to task ID ${taskId}:`, error);
        throw error;
    }
}