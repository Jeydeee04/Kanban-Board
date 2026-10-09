import axios from "axios";

const API_BASE_URL = process.env.PUBLIC_API_URL;

export async function updateTask(taskId: string, taskData: {
    proj_name?: string;
    prio?: string;
    due_date?: string;
    status?: string;
}) {
    try {
        const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error(`Failed to update task ID ${taskId}:`, error);
        throw error;
    }
}