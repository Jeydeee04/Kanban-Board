"use client";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { updateTask } from "@/services/updateTask";
import { getTasks } from "@/services/getTasks";
import { removeTask } from "@/services/removeTask";
import { createNewSubtask } from "@/services/createNewSubtask";
import { updateSubtask } from "@/services/updateSubtask";
import { removeSubtask } from "@/services/removeSubtask";
import { getFormattedDateParts } from "@/utils/getFormattedDateParts";
import { getCascadedOptions } from "@/utils/getCascadedOptions";
import ToDoCard from "@/components/ToDoCard";
import DoingCard from "@/components/DoingCard";
import DoneCard from "@/components/DoneCard";
import EditTaskForm from "@/components/EditTaskForm";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface BoardProps {
    isDarkMode: boolean;
}

const fetcher = async () => {
    const data = await getTasks();
    return Array.isArray(data) ? data : [];
};

export default function Board({ isDarkMode }: BoardProps) {
    const { data: tasks = [], error, isLoading, mutate } = useSWR<Task[]>('/tasks', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
    });

    const [newSubtaskInputs, setNewSubtaskInputs] = useState<{ [key: string]: string }>({});
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Search states per column
    const [todoSearch, setTodoSearch] = useState("");
    const [doingSearch, setDoingSearch] = useState("");
    const [doneSearch, setDoneSearch] = useState("");

    // Priority filter states per column
    const [todoPriority, setTodoPriority] = useState("all");
    const [doingPriority, setDoingPriority] = useState("all");
    const [donePriority, setDonePriority] = useState("all");

    // Month filter states per column
    const [todoMonth, setTodoMonth] = useState("all");
    const [doingMonth, setDoingMonth] = useState("all");
    const [doneMonth, setDoneMonth] = useState("all");

    // Day filter states per column
    const [todoDay, setTodoDay] = useState("all");
    const [doingDay, setDoingDay] = useState("all");
    const [doneDay, setDoneDay] = useState("all");

    // Pagination states per column (5 items per page)
    const [todoPage, setTodoPage] = useState(1);
    const [doingPage, setDoingPage] = useState(1);
    const [donePage, setDonePage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Helper to reset all filters and pagination back to defaults
    const resetAllFilters = () => {
        setTodoSearch(""); setDoingSearch(""); setDoneSearch("");
        setTodoPriority("all"); setDoingPriority("all"); setDonePriority("all");
        setTodoMonth("all"); setDoingMonth("all"); setDoneMonth("all");
        setTodoDay("all"); setDoingDay("all"); setDoneDay("all");
    };

    const moveTaskStatus = async (taskId: string, currentStatus: Task["status"]) => {
        let nextStatus: Task["status"] = "doing";
        if (currentStatus === "todo") nextStatus = "doing";
        else if (currentStatus === "doing") nextStatus = "done";
        else if (currentStatus === "done") nextStatus = "todo";

        try {
            // Optimistically update local cache
            mutate(
                tasks.map(t => t.task_id === taskId ? { ...t, status: nextStatus } : t),
                false
            );

            await updateTask(taskId, { status: nextStatus });
            mutate(); // Revalidate with server response
        } catch (error) {
            console.error("Failed to update task status:", error);
            mutate(); // Rollback on failure
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            // Optimistically filter out deleted task
            mutate(
                tasks.filter(t => t.task_id !== taskId),
                false
            );

            await removeTask(taskId);
            resetAllFilters();
            mutate();
        } catch (error) {
            console.error("Failed to delete task:", error);
            mutate();
        }
    };

    const handleEditTaskSubmit = async (updatedData: { proj_name?: string; prio?: string; due_date?: string }) => {
        if (!editingTask) return;
        try {
            // 1. Optimistically update SWR local cache before API request completes
            mutate(
                tasks.map(task => 
                    task.task_id === editingTask.task_id ? { ...task, ...updatedData } : task
                ),
                false // Do not immediately refetch from server
            );

            // 2. Perform backend update via Axios
            await updateTask(editingTask.task_id, updatedData);
            
            // 3. Clean up modal and filters
            setEditingTask(null);
            resetAllFilters();

            // 4. Revalidate SWR cache with server response
            mutate();
        } catch (error) {
            console.error("Failed to update task:", error);
            mutate(); // Rollback local cache to server truth on error
        }
    };

    const addSubtask = async (taskId: string) => {
        const text = newSubtaskInputs[taskId];
        if (!text || text.trim() === "") return;

        const trimmedText = text.trim();
        
        // 1. Construct temporary subtask object for optimistic rendering
        const tempSubtask = {
            id: `temp-sub-${Date.now()}`,
            task: trimmedText,
            status: "pending" as const,
        };

        // Clear input field immediately
        setNewSubtaskInputs(prev => ({ ...prev, [taskId]: "" }));

        try {
            // 2. Optimistically append new subtask into SWR local cache instantly
            mutate(
                tasks.map(t => {
                    if (t.task_id === taskId) {
                        return {
                            ...t,
                            subtasks: [...(t.subtasks || []), tempSubtask]
                        };
                    }
                    return t;
                }),
                false // Do not revalidate immediately
            );

            // 3. Send API POST request to Firebase via backend
            await createNewSubtask(taskId, trimmedText);

            // 4. Background revalidate to swap temporary ID with real Firestore ID
            mutate();
        } catch (error) {
            console.error("Failed to add subtask:", error);
            // Revert cache on failure
            mutate();
        }
    };

    const deleteSubtask = async (taskId: string, subId: string) => {
        try {
            // Optimistically filter subtask
            mutate(
                tasks.map(t => {
                    if (t.task_id === taskId) {
                        return {
                            ...t,
                            subtasks: (t.subtasks || []).filter(sub => sub.id !== subId)
                        };
                    }
                    return t;
                }),
                false
            );

            await removeSubtask(taskId, subId);
            mutate();
        } catch (error) {
            console.error("Failed to delete subtask:", error);
            mutate();
        }
    };

    const toggleSubtask = async (taskId: string, subId: string) => {
        try {
            const task = tasks.find(t => t.task_id === taskId);
            if (!task || !task.subtasks) return;

            const subtask = task.subtasks.find(s => s.id === subId);
            if (!subtask) return;

            const nextStatus = subtask.status === 'done' ? 'pending' : 'done';

            // Optimistically toggle subtask state
            mutate(
                tasks.map(t => {
                    if (t.task_id === taskId) {
                        return {
                            ...t,
                            subtasks: (t.subtasks || []).map(sub =>
                                sub.id === subId ? { ...sub, status: nextStatus } : sub
                            )
                        };
                    }
                    return t;
                }),
                false
            );

            await updateSubtask?.(taskId, subId, { task: subtask.task, status: nextStatus });
            mutate();
        } catch (error) {
            console.error("Failed to update subtask status:", error);
            mutate();
        }
    };

    // Filter tasks based on search, priority, month, and day
    const getProcessedTasks = (
        status: Task["status"], 
        search: string, 
        priority: string, 
        month: string, 
        day: string
    ) => {
        const baseList = tasks.filter(t => t.status === status);

        return baseList.filter(t => {
            // Safe string extraction using (val ?? "")
            const matchesSearch = 
                (t.proj_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                (t.subtasks && t.subtasks.some(s => (s.task ?? "").toLowerCase().includes(search.toLowerCase())));
            
            const matchesPriority = priority === "all" || (t.prio ?? "").toLowerCase() === priority.toLowerCase();

            const { month: tMonth, day: tDay } = getFormattedDateParts(t.due_date);
            const matchesMonth = month === "all" || tMonth === month;
            const matchesDay = day === "all" || tDay === day;

            return matchesSearch && matchesPriority && matchesMonth && matchesDay;
        });
    };

    // Render search bar and cascading filters per column
    const renderFiltersAndSearch = (
        statusTasks: Task[],
        search: string,
        setSearch: (v: string) => void,
        priority: string,
        setPriority: (v: string) => void,
        month: string,
        setMonth: (v: string) => void,
        day: string,
        setDay: (v: string) => void,
        setPage: (p: number) => void
    ) => {
        const { availablePriorities, availableMonths, availableDays } = getCascadedOptions(statusTasks, priority, month, day);

        const inputStyle = isDarkMode 
            ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-indigo-500" 
            : "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:ring-indigo-500";

        return (
            <div className="flex flex-col gap-2.5 mb-4 shrink-0">
                {/* Search Bar */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className={`w-full text-xs border rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 ${inputStyle}`}
                    />
                </div>

                {/* Cascading Filter Row */}
                <div className="grid grid-cols-3 gap-2">
                    <select
                        value={priority}
                        onChange={(e) => { setPriority(e.target.value); setPage(1); }}
                        className={`text-xs border rounded-xl px-2 py-2 focus:outline-none focus:ring-2 ${inputStyle}`}
                    >
                        <option value="all">All</option>
                        {availablePriorities.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    <select
                        value={month}
                        onChange={(e) => { setMonth(e.target.value); setPage(1); }}
                        className={`text-xs border rounded-xl px-2 py-2 focus:outline-none focus:ring-2 ${inputStyle}`}
                    >
                        <option value="all">Month</option>
                        {availableMonths.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={day}
                        onChange={(e) => { setDay(e.target.value); setPage(1); }}
                        className={`text-xs border rounded-xl px-2 py-2 focus:outline-none focus:ring-2 ${inputStyle}`}
                    >
                        <option value="all">Day</option>
                        {availableDays.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    // Render pagination controls (5 items per page)
    const renderPagination = (totalItems: number, currentPage: number, setPage: (p: number) => void) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
        if (totalPages <= 1) return null;

        const btnStyle = isDarkMode 
            ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700" 
            : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200";

        return (
            <div className="flex items-center justify-between pt-3 mt-auto shrink-0 border-t border-slate-700/20 text-xs">
                <span className="text-slate-400">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1.5">
                    <button 
                        onClick={() => setPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 cursor-pointer ${btnStyle}`}
                        aria-label="Previous Page"
                    >
                        <FiChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 cursor-pointer ${btnStyle}`}
                        aria-label="Next Page"
                    >
                        <FiChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    };

    const columnBg = isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-200/50 border-slate-200/80";
    const badgeBg = isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-white text-slate-600 border-slate-200";

    const rawTodoList = (Array.isArray(tasks) ? tasks : []).filter(t => t.status === "todo");
    const rawDoingList = (Array.isArray(tasks) ? tasks : []).filter(t => t.status === "doing");
    const rawDoneList = (Array.isArray(tasks) ? tasks : []).filter(t => t.status === "done");

    const todoList = getProcessedTasks("todo", todoSearch, todoPriority, todoMonth, todoDay);
    const doingList = getProcessedTasks("doing", doingSearch, doingPriority, doingMonth, doingDay);
    const doneList = getProcessedTasks("done", doneSearch, donePriority, doneMonth, doneDay);

    const paginatedTodo = todoList.slice((todoPage - 1) * ITEMS_PER_PAGE, todoPage * ITEMS_PER_PAGE);
    const paginatedDoing = doingList.slice((doingPage - 1) * ITEMS_PER_PAGE, doingPage * ITEMS_PER_PAGE);
    const paginatedDone = doneList.slice((donePage - 1) * ITEMS_PER_PAGE, donePage * ITEMS_PER_PAGE);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full relative">
            
            {/* TO DO COLUMN */}
            <div className={`${columnBg} rounded-3xl border p-5 flex flex-col h-[750px] backdrop-blur-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between px-2 pb-4 shrink-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">To Do</h2>
                    <span className={`text-xs font-bold ${badgeBg} px-2.5 py-1 rounded-full border shadow-2xs`}>
                        {todoList.length}
                    </span>
                </div>

                {renderFiltersAndSearch(rawTodoList, todoSearch, setTodoSearch, todoPriority, setTodoPriority, todoMonth, setTodoMonth, todoDay, setTodoDay, setTodoPage)}

                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {paginatedTodo.length > 0 ? (
                        paginatedTodo.map((task, i) => (
                            <ToDoCard 
                                isDarkMode={isDarkMode}
                                key={i}
                                proj_name={task.proj_name}
                                prio={task.prio}
                                due_date={task.due_date}
                                onDelete={() => deleteTask(task.task_id)}
                                onMove={() => moveTaskStatus(task.task_id, task.status)}
                                onEdit={() => setEditingTask(task)}
                            />
                        ))
                    ) : (
                        <p className="text-xs italic text-slate-400 text-center py-8">No matching To Do tasks</p>
                    )}
                </div>

                {renderPagination(todoList.length, todoPage, setTodoPage)}
            </div>

            {/* DOING COLUMN */}
            <div className={`${columnBg} rounded-3xl border p-5 flex flex-col h-[750px] backdrop-blur-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between px-2 pb-4 shrink-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Doing</h2>
                    <span className={`text-xs font-bold ${badgeBg} px-2.5 py-1 rounded-full border shadow-2xs`}>
                        {doingList.length}
                    </span>
                </div>

                {renderFiltersAndSearch(rawDoingList, doingSearch, setDoingSearch, doingPriority, setDoingPriority, doingMonth, setDoingMonth, doingDay, setDoingDay, setDoingPage)}

                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {paginatedDoing.length > 0 ? (
                        paginatedDoing.map((task, i) => (
                            <DoingCard 
                                isDarkMode={isDarkMode}
                                key={i}
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
                        ))
                    ) : (
                        <p className="text-xs italic text-slate-400 text-center py-8">No matching Doing tasks</p>
                    )}
                </div>

                {renderPagination(doingList.length, doingPage, setDoingPage)}
            </div>

            {/* DONE COLUMN */}
            <div className={`${columnBg} rounded-3xl border p-5 flex flex-col h-[750px] backdrop-blur-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between px-2 pb-4 shrink-0">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Done</h2>
                    <span className={`text-xs font-bold ${badgeBg} px-2.5 py-1 rounded-full border shadow-2xs`}>
                        {doneList.length}
                    </span>
                </div>

                {renderFiltersAndSearch(rawDoneList, doneSearch, setDoneSearch, donePriority, setDonePriority, doneMonth, setDoneMonth, doneDay, setDoneDay, setDonePage)}

                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    {paginatedDone.length > 0 ? (
                        paginatedDone.map((task, i) => (
                            <DoneCard 
                                isDarkMode={isDarkMode}
                                key={i}
                                proj_name={task.proj_name}
                                prio={task.prio}
                                due_date={task.due_date}
                                subtasks={task.subtasks}
                                onDelete={() => deleteTask(task.task_id)}
                            />
                        ))
                    ) : (
                        <p className="text-xs italic text-slate-400 text-center py-8">No matching Done tasks</p>
                    )}
                </div>

                {renderPagination(doneList.length, donePage, setDonePage)}
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