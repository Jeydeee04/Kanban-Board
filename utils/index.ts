import { TASK_STATUSES } from "../types/data";
import type { Task, TaskStatus } from "../types/data";

export const TASK_FILE_NAME = "TASK.md";
export const TASK_RECORD_FORMAT =
    "project_name:priority:(subtask:::subtask:::subtask):duedate:status";

const TASK_LINE_PATTERN = /^([^:]+):([^:]+):\(([^)]*)\):([^:]+):(todo|doing|done)$/;

export class TaskFormatError extends Error {
    constructor(message: string, public readonly lineNumber?: number) {
        super(lineNumber ? `Line ${lineNumber}: ${message}` : message);
        this.name = "TaskFormatError";
    }
}

const assertField = (value: string, fieldName: string) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
        throw new TaskFormatError(`${fieldName} cannot be empty`);
    }

    if (normalizedValue.includes(":")) {
        throw new TaskFormatError(`${fieldName} cannot contain ":"`);
    }

    return normalizedValue;
};

export const isTaskStatus = (value: string): value is TaskStatus =>
    TASK_STATUSES.includes(value as TaskStatus);

export const parseTaskLine = (line: string, lineNumber?: number): Task => {
    const normalizedLine = line.trim();
    const match = TASK_LINE_PATTERN.exec(normalizedLine);

    if (!match) {
        throw new TaskFormatError(
            `expected ${TASK_RECORD_FORMAT}`,
            lineNumber,
        );
    }

    const [, projectName, priority, subtasksValue, dueDate, status] = match;
    const subtasks = subtasksValue
        ? subtasksValue.split(":::").map((subtask) => {
              const normalizedSubtask = subtask.trim();

              if (!normalizedSubtask || normalizedSubtask.includes(":")) {
                  throw new TaskFormatError(
                      'subtasks must be non-empty and cannot contain ":"',
                      lineNumber,
                  );
              }

              return normalizedSubtask;
          })
        : [];

    if (!isTaskStatus(status)) {
        throw new TaskFormatError(`invalid status "${status}"`, lineNumber);
    }

    const projectNameValue = assertField(projectName, "project_name");
    const priorityValue = assertField(priority, "priority");
    const dueDateValue = assertField(dueDate, "duedate");

    return {
        id: createTaskId(projectNameValue, dueDateValue),
        projectName: projectNameValue,
        priority: priorityValue,
        subtasks,
        dueDate: dueDateValue,
        status,
    };
};

export const parseTaskDocument = (document: string): Task[] =>
    document
        .split(/\r?\n/)
        .flatMap((line, index) => {
            const normalizedLine = line.trim();

            if (!normalizedLine || normalizedLine.startsWith("#")) {
                return [];
            }

            return [parseTaskLine(normalizedLine, index + 1)];
        });

export const serializeTask = (task: Omit<Task, "id"> | Task): string => {
    if (!isTaskStatus(task.status)) {
        throw new TaskFormatError(`invalid status "${task.status}"`);
    }

    const projectName = assertField(task.projectName, "project_name");
    const priority = assertField(task.priority, "priority");
    const dueDate = assertField(task.dueDate, "duedate");
    const subtasks = task.subtasks.map((subtask) => {
        const normalizedSubtask = subtask.trim();

        if (!normalizedSubtask || normalizedSubtask.includes(":")) {
            throw new TaskFormatError(
                'subtasks must be non-empty and cannot contain ":"',
            );
        }

        return normalizedSubtask;
    });

    return `${projectName}:${priority}:(${subtasks.join(":::")}):${dueDate}:${task.status}`;
};

export const serializeTaskDocument = (tasks: Task[]): string =>
    tasks.length ? `${tasks.map(serializeTask).join("\n")}\n` : "";

export const groupTasksByStatus = (
    tasks: Task[],
): Record<TaskStatus, Task[]> => ({
    todo: tasks.filter((task) => task.status === "todo"),
    doing: tasks.filter((task) => task.status === "doing"),
    done: tasks.filter((task) => task.status === "done"),
});

export const updateTaskStatus = (
    tasks: Task[],
    taskId: string,
    status: TaskStatus,
): Task[] => {
    const task = tasks.find((candidate) => candidate.id === taskId);

    if (!task) {
        throw new Error(`Task "${taskId}" was not found`);
    }

    return tasks.map((candidate) =>
        candidate.id === taskId ? { ...candidate, status } : candidate,
    );
};

const createTaskId = (projectName: string, dueDate: string) =>
    `${projectName}:${dueDate}`.toLowerCase().replace(/\s+/g, "-");
