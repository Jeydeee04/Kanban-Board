"use client";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import * as taskServices from "@/services/taskServices";
import ToDoCard from "@/components/ToDoCard";
import DoingCard from "@/components/DoingCard";
import DoneCard from "@/components/DoneCard";
import EditTaskForm from "@/components/EditTaskForm";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface BoardProps {
    isDarkMode: boolean;
}

export default function Board({ isDarkMode }: BoardProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newSubtaskInputs, setNewSubtaskInputs] = useState<{ [key: number]: string }>({});
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

    // Format date string to Month ("September 2026") and Day ("12")
    const getFormattedDateParts = (dateStr: string) => {
        if (!dateStr) return { month: "", day: "" };
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) {
            const parts = dateStr.split(/[-/]/);
            if (parts.length >= 3) {
                const year = parts[0];
                const mIndex = parseInt(parts[1], 10) - 1;
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const monthName = monthNames[mIndex] || parts[1];
                return { month: `${monthName} ${year}`, day: parseInt(parts[2], 10).toString() };
            }
            return { month: "", day: "" };
        }
        const monthName = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const dayNum = d.getDate().toString();
        return { month: monthName, day: dayNum };
    };

    // Cascading Filter Logic: Shows all options if ALL filters are set to "all". Otherwise, cascades dynamically.
    const getCascadedOptions = (statusTasks: Task[], currentPriority: string, currentMonth: string, currentDay: string) => {
        const allPriorities = Array.from(new Set(statusTasks.map(t => t.prio).filter(Boolean)));
        const allMonths = Array.from(new Set(statusTasks.map(t => getFormattedDateParts(t.due_date).month).filter(Boolean)));
        const allDays = Array.from(new Set(statusTasks.map(t => getFormattedDateParts(t.due_date).day).filter(Boolean)))
            .sort((a, b) => parseInt(a) - parseInt(b));

        // If NO filters are selected at all, show everything
        if (currentPriority === "all" && currentMonth === "all" && currentDay === "all") {
            return {
                availablePriorities: allPriorities,
                availableMonths: allMonths,
                availableDays: allDays
            };
        }

        // Otherwise, calculate independent restrictions based on active filters
        const tasksForPriorities = statusTasks.filter(t => {
            const { month, day } = getFormattedDateParts(t.due_date);
            const matchMonth = currentMonth === "all" || month === currentMonth;
            const matchDay = currentDay === "all" || day === currentDay;
            return matchMonth && matchDay;
        });
        const availablePriorities = Array.from(new Set(tasksForPriorities.map(t => t.prio).filter(Boolean)));

        const tasksForMonths = statusTasks.filter(t => {
            const { day } = getFormattedDateParts(t.due_date);
            const matchPriority = currentPriority === "all" || t.prio?.toLowerCase() === currentPriority.toLowerCase();
            const matchDay = currentDay === "all" || day === currentDay;
            return matchPriority && matchDay;
        });
        const availableMonths = Array.from(new Set(tasksForMonths.map(t => getFormattedDateParts(t.due_date).month).filter(Boolean)));

        const tasksForDays = statusTasks.filter(t => {
            const { month } = getFormattedDateParts(t.due_date);
            const matchPriority = currentPriority === "all" || t.prio?.toLowerCase() === currentPriority.toLowerCase();
            const matchMonth = currentMonth === "all" || month === currentMonth;
            return matchPriority && matchMonth;
        });
        const availableDays = Array.from(new Set(tasksForDays.map(t => getFormattedDateParts(t.due_date).day).filter(Boolean)))
            .sort((a, b) => parseInt(a) - parseInt(b));

        return { availablePriorities, availableMonths, availableDays };
    };

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
            resetAllFilters(); // Reset filters to default on delete
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
            resetAllFilters(); // Reset filters to default on edit
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const addSubtask = async (taskId: number) => {
        const text = newSubtaskInputs[taskId];
        if (!text || text.trim() === "") return;

        try {
            await taskServices.addSubtask(taskId, text.trim());
            const data = await taskServices.getTasks();
            setTasks(Array.isArray(data) ? data : []);
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

    const toggleSubtask = async (taskId: number, subId: number) => {
        try {
            const task = tasks.find(t => t.task_id === taskId);
            if (!task || !task.subtasks) return;

            const subtask = task.subtasks.find(s => s.id === subId);
            if (!subtask) return;

            const nextStatus = subtask.status === 'done' ? 'pending' : 'done';
            await taskServices.updateSubtask?.(taskId, subId, {task: subtask.task, status: nextStatus});

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

    // Filter tasks based on search, priority, month, and day
    const getProcessedTasks = (
        status: Task["status"], 
        search: string, 
        priority: string, 
        month: string, 
        day: string
    ) => {
        const baseList = (Array.isArray(tasks) ? tasks : []).filter(t => t.status === status);

        return baseList.filter(t => {
            const matchesSearch = t.proj_name.toLowerCase().includes(search.toLowerCase()) ||
                (t.subtasks && t.subtasks.some(s => s.task.toLowerCase().includes(search.toLowerCase())));
            
            const matchesPriority = priority === "all" || t.prio?.toLowerCase() === priority.toLowerCase();

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
                        <option value="all">All</option>
                        {availableMonths.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={day}
                        onChange={(e) => { setDay(e.target.value); setPage(1); }}
                        className={`text-xs border rounded-xl px-2 py-2 focus:outline-none focus:ring-2 ${inputStyle}`}
                    >
                        <option value="all">All</option>
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
                        paginatedTodo.map(task => (
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
                        paginatedDoing.map(task => (
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
                        paginatedDone.map(task => (
                            <DoneCard 
                                isDarkMode={isDarkMode}
                                key={task.task_id}
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