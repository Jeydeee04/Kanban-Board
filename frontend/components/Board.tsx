"use client";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import * as taskServices from "@/services/taskServices";
import ToDoCard from "@/components/ToDoCard";
import DoingCard from "@/components/DoingCard";
import DoneCard from "@/components/DoneCard";
import EditTaskForm from "@/components/EditTaskForm";

interface BoardProps {
    isDarkMode: boolean;
}

export default function Board({ isDarkMode }: BoardProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newSubtaskInputs, setNewSubtaskInputs] = useState<{ [key: number]: string }>({});
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Fetch tasks from backend on mount with safety check
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await taskServices.getTasks();
                setTasks(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
                setTasks([]);
            }
        };

        fetchTasks();
    }, []);

    const moveTaskStatus = async (taskId: number, currentStatus: Task["status"]) => {
        let nextStatus: Task["status"] = "doing";
        if (currentStatus === "todo") nextStatus = "doing";
        else if (currentStatus === "doing") nextStatus = "done";
        else if (currentStatus === "done") nextStatus = "todo";

        try {
            await taskServices.updateTask(taskId, { status: nextStatus });
            setTasks(prev => (prev || []).map(task => 
                task.task_id === taskId ? { ...task, status: nextStatus } : task
            ));
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    const deleteTask = async (taskId: number) => {
        try {
            await taskServices.removeTask(taskId);
            setTasks(prev => (prev || []).filter(task => task.task_id !== taskId));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleEditTaskSubmit = async (updatedData: { proj_name?: string; prio?: string; due_date?: string }) => {
        if (!editingTask) return;
        try {
            await taskServices.updateTask(editingTask.task_id, updatedData);
            setTasks(prev => (prev || []).map(task => 
                task.task_id === editingTask.task_id ? { ...task, ...updatedData } : task
            ));
            setEditingTask(null);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const addSubtask = async (taskId: number) => {
        const text = newSubtaskInputs[taskId];
        if (!text || text.trim() === "") return;

        try {
            const updatedTask = await taskServices.addSubtask(taskId, text.trim());
            setTasks(prev => (prev || []).map(task => {
                if (task.task_id === taskId) {
                    const newSub = updatedTask?.subtasks ? updatedTask.subtasks[updatedTask.subtasks.length - 1] : { id: Date.now(), task: text.trim(), status: "pending" };
                    return { ...task, subtasks: [...task.subtasks, newSub] };
                }
                return task;
            }));
            setNewSubtaskInputs(prev => ({ ...prev, [taskId]: "" }));
        } catch (error) {
            console.error("Failed to add subtask:", error);
        }
    };

    const deleteSubtask = async (taskId: number, subId: number) => {
        try {
            await taskServices.removeSubtask(taskId, subId);
            setTasks(prev => (prev || []).map(task => {
                if (task.task_id === taskId) {
                    return {
                        ...task,
                        subtasks: task.subtasks.filter(sub => sub.id !== subId)
                    };
                }
                return task;
            }));
        } catch (error) {
            console.error("Failed to delete subtask:", error);
        }
    };

    // Toggles subtask status explicitly to 'done' or back to 'pending'
    const toggleSubtask = async (taskId: number, subId: number) => {
        try {
            const task = tasks.find(t => t.task_id === taskId);
            if (!task || !task.subtasks) return;

            const subtask = task.subtasks.find(s => s.id === subId);
            if (!subtask) return;

            const nextStatus = subtask.status === 'done' ? 'pending' : 'done';

            // Optional: Call your backend service update function if available
            // await taskServices.updateSubtaskStatus?.(taskId, subId, nextStatus);

            setTasks(prev => (prev || []).map(t => {
                if (t.task_id === taskId) {
                    return {
                        ...t,
                        subtasks: t.subtasks.map(sub => 
                            sub.id === subId ? { ...sub, status: nextStatus } : sub
                        )
                    };
                }
                return t;
            }));
        } catch (error) {
            console.error("Failed to update subtask status:", error);
        }
    };

    const filterTasks = (status: Task["status"]) => 
        (Array.isArray(tasks) ? tasks : []).filter(t => t.status === status);

    const columnBg = isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-200/50 border-slate-200/80";
    const badgeBg = isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-white text-slate-600 border-slate-200";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full relative">
            
            {/* TO DO COLUMN */}
            <div className={`${columnBg} rounded-3xl border p-5 flex flex-col h-[650px] backdrop-blur-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between px-2 pb-4 shrink-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">To Do</h2>
                    <span className={`text-xs font-bold ${badgeBg} px-2.5 py-1 rounded-full border shadow-2xs`}>
                        {filterTasks("todo").length}
                    </span>
                </div>
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {filterTasks("todo").map(task => (
                        <ToDoCard 
                            isDarkMode={isDarkMode}
                            key={task.task_id}
                            proj_name={task.proj_name}
                            prio={task.prio}
                            due_date={task.due_date}
                            onDelete={() => deleteTask(task.task_id)}
                            onMove={() => moveTaskStatus(task.task_id, task.status)}
                            onEdit={() => setEditingTask(task)}
                        />
                    ))}
                </div>
            </div>

            {/* DOING COLUMN */}
            <div className={`${columnBg} rounded-3xl border p-5 flex flex-col h-[650px] backdrop-blur-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between px-2 pb-4 shrink-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Doing</h2>
                    <span className={`text-xs font-bold ${badgeBg} px-2.5 py-1 rounded-full border shadow-2xs`}>
                        {filterTasks("doing").length}
                    </span>
                </div>
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {filterTasks("doing").map(task => (
                        <DoingCard 
                            isDarkMode={isDarkMode}
                            key={task.task_id}
                            proj_name={task.proj_name}
                            prio={task.prio}
                            due_date={task.due_date}
                            subtasks={task.subtasks}
                            onDelete={() => deleteTask(task.task_id)}
                            onMove={() => moveTaskStatus(task.task_id, task.status)}
                            onEdit={() => setEditingTask(task)}
                            subtaskInput={newSubtaskInputs[task.task_id] || ""}
                            onSubtaskInputChange={(val) => setNewSubtaskInputs({ ...newSubtaskInputs, [task.task_id]: val })}
                            onAddSubtask={() => addSubtask(task.task_id)}
                            onDeleteSubtask={(subId) => deleteSubtask(task.task_id, subId)}
                            onToggleSubtask={(subId) => toggleSubtask(task.task_id, subId)}
                        />
                    ))}
                </div>
            </div>

            {/* DONE COLUMN */}
            <div className={`${columnBg} rounded-3xl border p-5 flex flex-col h-[650px] backdrop-blur-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between px-2 pb-4 shrink-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Done</h2>
                    <span className={`text-xs font-bold ${badgeBg} px-2.5 py-1 rounded-full border shadow-2xs`}>
                        {filterTasks("done").length}
                    </span>
                </div>
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {filterTasks("done").map(task => (
                        <DoneCard 
                            isDarkMode={isDarkMode}
                            key={task.task_id}
                            proj_name={task.proj_name}
                            prio={task.prio}
                            due_date={task.due_date}
                            subtasks={task.subtasks}
                            onDelete={() => deleteTask(task.task_id)}
                        />
                    ))}
                </div>
            </div>

            {/* Edit Task Modal Popup */}
            {editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="w-full max-w-md">
                        <EditTaskForm 
                            task={editingTask}
                            isDarkMode={isDarkMode} 
                            onSubmit={handleEditTaskSubmit} 
                            onClose={() => setEditingTask(null)} 
                        />
                    </div>
                </div>
            )}

        </div>
    );
}