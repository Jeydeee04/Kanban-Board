import axios from "axios";
import { Task } from "@/types/task";

const API_BASE_URL = process.env.PUBLIC_API_URL;

/**
 * Fetch all tasks from the Flask backend.
 */
export async function getTasks(): Promise<Task[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        throw error;
    }
}