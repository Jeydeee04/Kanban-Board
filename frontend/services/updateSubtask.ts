import axios from "axios";
import { Task } from "@/types/task";

const API_BASE_URL = process.env.PUBLIC_API_URL;

export async function updateSubtask(
    taskId: number, 
    subtaskId: number, 
    subtaskData: { task?: string; status?: "pending" | "done" }
) {
    try {
        const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
        return response.data;
    } catch (error) {
        console.error(`Failed to update subtask ID ${subtaskId}:`, error);
        throw error;
    }
}