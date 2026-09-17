import { Task } from "./data";

export interface BoardProps {
    boardId: string;
    initialTitle: string;
    onDelete: () => void;
    onUpdate: (title: string) => void;
    isDark: boolean;
}

export interface TaskCardProps {
    task: Task
    onDelete: () => void;
    onEdit: () => void;
    isDark: boolean;
}

export interface ToDoCardProps {
    task: Task
    onDelete?: () => void;
    onEdit?: (task: any) => void;
    isDark?: boolean;
}