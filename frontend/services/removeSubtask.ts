import axios from "axios";
import { Task } from "@/types/task";

const API_BASE_URL = process.env.PUBLIC_API_URL;

export async function removeSubtask(taskId: number, subtaskId: number) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete subtask ID ${subtaskId}:`, error);
        throw error;
    }
}