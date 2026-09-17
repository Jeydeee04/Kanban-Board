"use client";
import { useState } from "react";
import { FiCheck, FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2 } from "react-icons/fi";
import Form from "./Form";

export default function TaskCard({ task, boards, onDelete, onEdit, onMove, isDark }: any) {
    const [subtasks, setSubtasks] = useState([
        { id: "1", title: "Design a dashboard", done: false },
        { id: "2", title: "Design a task card", done: false }
    ]);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const toggleSubtask = (id: string) => {
        setSubtasks(subtasks.map((s) => 
            s.id === id ? { ...s, done: !s.done } : s
        ));
    };

    // Find current board index to easily move left/right
    const currentIndex = boards.findIndex((b: any) => b.id === task.boardId);

    return (
        <div className={`border rounded-2xl p-5 shadow-sm transition-all duration-200 font-poppins relative group ${
            isDark 
                ? "bg-slate-950 border-slate-800 hover:border-slate-700" 
                : "bg-white border-slate-200/80 hover:shadow-md hover:border-slate-300"
        }`}>
            {/* Header Section */}
            <div className={`mb-4 pb-3.5 border-b flex items-start justify-between ${isDark ? "border-slate-850" : "border-slate-100"}`}>
                <div className="flex-1 mr-3">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                        isDark ? "text-indigo-400 bg-indigo-950/60" : "text-indigo-600 bg-indigo-50/80"
                    }`}>
                        Project Task
                    </span>
                    
                    <h1 className={`text-base font-bold mt-2.5 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        {task.projectName}
                    </h1>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 shrink-0">
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${isDark ? "text-slate-400 hover:text-indigo-400 hover:bg-slate-900" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"}`}
                        title="Edit Task"
                    >
                        <FiEdit2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button 
                        onClick={onDelete}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${isDark ? "text-slate-400 hover:text-rose-400 hover:bg-slate-900" : "text-slate-400 hover:text-rose-600 hover:bg-slate-100"}`}
                        title="Delete Task"
                    >
                        <FiTrash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Metadata Section: Priority and Due Date */}
                <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/70 border-slate-200/60"
                    }`}>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Priority</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block w-fit ${
                                task.priority === 'High' 
                                    ? (isDark ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50' : 'bg-rose-50 text-rose-700 border border-rose-200')
                                    : (isDark ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-700 border border-slate-200/60')
                            }`}>
                                {task.priority}
                        </span>
                    </div>

                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/70 border-slate-200/60"
                    }`}>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Due Date</span>
                        <p className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                            {task.dueDate}
                        </p>
                    </div>
                </div>

                {/* Subtasks Section */}
                <div>
                    <div className="flex items-center justify-between mb-2.5">
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subtasks</h2>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            isDark ? "bg-slate-900 text-slate-400 border border-slate-800" : "bg-slate-200/60 text-slate-500"
                        }`}>
                            {subtasks.filter(s => s.done).length}/{subtasks.length} Done
                        </span>
                    </div>
                    <div className="space-y-2">
                        {subtasks.map((sub) => (
                            <div 
                                key={sub.id} 
                                onClick={() => toggleSubtask(sub.id)}
                                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
                                    sub.done 
                                        ? (isDark ? 'bg-emerald-950/30 border-emerald-900/60' : 'bg-emerald-50/50 border-emerald-200/60')
                                        : (isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900' : 'bg-slate-50/80 border-slate-100 hover:border-slate-200 hover:bg-slate-100/50')
                                }`}
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                        sub.done 
                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs' 
                                            : (isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white')
                                    }`}>
                                        {sub.done && (
                                            <FiCheck className="w-3 h-3" aria-hidden="true" />
                                        )}
                                    </div>
                                    <p className={`text-xs font-medium transition-all truncate ${sub.done ? 'line-through text-slate-500' : (isDark ? 'text-slate-200' : 'text-slate-700')}`}>
                                        {sub.title}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all shrink-0 ${
                                    sub.done 
                                        ? (isDark ? 'text-emerald-400 bg-emerald-950/80' : 'text-emerald-700 bg-emerald-100/60') 
                                        : (isDark ? 'text-slate-400 bg-slate-900 border border-slate-800' : 'text-slate-400 bg-slate-200/50')
                                }`}>
                                    {sub.done ? 'Done' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Movement Bar / Buttons */}
                <div className={`flex items-center justify-end pt-3.5 border-t ${isDark ? "border-slate-850" : "border-slate-100"}`}>
                    <div className="flex items-center space-x-1.5">
                        {currentIndex > 0 && (
                            <button 
                                onClick={() => onMove(task.id, boards[currentIndex - 1].id)}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition cursor-pointer flex items-center space-x-1 ${
                                    isDark ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                <FiChevronLeft className="w-3 h-3" aria-hidden="true" />
                                <span>{boards[currentIndex - 1].title}</span>
                            </button>
                        )}
                        {currentIndex < boards.length - 1 && (
                            <button 
                                onClick={() => onMove(task.id, boards[currentIndex + 1].id)}
                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition cursor-pointer flex items-center space-x-1 ${
                                    isDark ? "bg-indigo-950/60 border-indigo-900/50 text-indigo-300 hover:bg-indigo-900/60" : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                }`}
                            >
                                <span>{boards[currentIndex + 1].title}</span>
                                <FiChevronRight className="w-3 h-3" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isFormOpen && (
                <Form
                    mode="edit"
                    initialValues={{
                        projectName: task.projectName,
                        priority: task.priority,
                        dueDate: task.dueDate,
                    }}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={(values) => {
                        onEdit({ ...task, ...values });
                        setIsFormOpen(false);
                    }}
                    isDark={isDark}
                />
            )}
        </div>
    )
}