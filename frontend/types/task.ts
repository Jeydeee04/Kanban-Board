export interface Subtask {
    id: number;
    task: string;
    status?: "pending" | "done";
}

export interface Task {
    task_id: number;
    proj_name: string;
    prio: string;
    due_date: string;
    status: "todo" | "doing" | "done";
    subtasks: Subtask[];
}

export interface ToDoCardProps{
    proj_name: string;
    prio: string;
    due_date: string;
}

export interface DoingCardProps {
    proj_name: string;
    prio: string;
    due_date: string;
    subtasks: Subtask[];
}

export interface DoneCardProps {
    proj_name: string;
    prio: string;
    due_date: string;
    subtasks: Subtask[];
}

export interface AddTaskFormProps {
    isDarkMode: boolean;
    onSubmit: (taskData: { proj_name: string; prio: string; due_date: string }) => void;
    onClose?: () => void;
}