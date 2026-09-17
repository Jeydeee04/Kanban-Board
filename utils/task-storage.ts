import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
    parseTaskDocument,
    serializeTaskDocument,
    TASK_FILE_NAME,
} from "./index";
import type { Task } from "../types/data";

export const DEFAULT_TASK_FILE_PATH = path.join(
    process.cwd(),
    "public",
    "storage",
    TASK_FILE_NAME,
);

export const readTasks = async (
    filePath = DEFAULT_TASK_FILE_PATH,
): Promise<Task[]> => {
    const document = await readFile(filePath, "utf8");
    return parseTaskDocument(document);
};

export const writeTasks = async (
    tasks: Task[],
    filePath = DEFAULT_TASK_FILE_PATH,
): Promise<void> => {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, serializeTaskDocument(tasks), "utf8");
};
