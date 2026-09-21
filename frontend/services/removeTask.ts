import axios from "axios";
import { Task } from "@/types/task";

const API_BASE_URL = process.env.PUBLIC_API_URL;

export async function removeTask(taskId: number) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete task ID ${taskId}:`, error);
        throw error;
    }
}