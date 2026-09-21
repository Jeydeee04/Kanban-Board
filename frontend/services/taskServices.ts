import axios from "axios";
import { Task } from "@/types/task";

const API_BASE_URL = "http://localhost:5000";

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

/**
 * Create a new task.
 */
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

/**
 * Update an existing task's details or status.
 */
export async function updateTask(taskId: number, taskData: {
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

/**
 * Delete a task by ID.
 */
export async function removeTask(taskId: number) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete task ID ${taskId}:`, error);
        throw error;
    }
}

/**
 * Add a subtask to a specific task (defaults to pending).
 */
export async function addSubtask(taskId: number, taskText: string, status: "pending" | "done" = "pending") {
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

/**
 * Update a subtask's text or status.
 */
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

/**
 * Delete a subtask.
 */
export async function removeSubtask(taskId: number, subtaskId: number) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete subtask ID ${subtaskId}:`, error);
        throw error;
    }
}