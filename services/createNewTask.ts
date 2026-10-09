import axios from "axios";

const API_BASE_URL = process.env.PUBLIC_API_URL;

export async function createNewTask(taskData: {
    proj_name: string;
    prio: string;
    due_date: string;
    subtasks?: { task: string; status?: "pending" | "done" }[];
    status?: string;
}) {
    try {
        const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error("Failed to create task:", error);
        throw error;
    }
}