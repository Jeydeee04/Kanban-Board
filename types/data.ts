export const TASK_STATUSES = ["todo", "doing", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
    id: string;
    projectName: string;
    priority: string;
    subtasks: string[];
    dueDate: string;
    status: TaskStatus;
}
