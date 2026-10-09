import { useState, useEffect, FormEvent } from "react";
import { FiFolder, FiFlag, FiCalendar, FiX, FiCheck } from "react-icons/fi";
import { Task } from "@/types/task";

interface EditTaskFormProps {
    task: Task;
    isDarkMode: boolean;
    onSubmit: (updatedData: { proj_name?: string; prio?: string; due_date?: string }) => void;
    onClose: () => void;
}

export default function EditTaskForm({ task, isDarkMode, onSubmit, onClose }: EditTaskFormProps) {
    const [projName, setProjName] = useState(task.proj_name);
    const [prio, setPrio] = useState(task.prio);
    const [dueDate, setDueDate] = useState(task.due_date);

    // Sync state if the selected task changes
    useEffect(() => {
        setProjName(task.proj_name);
        setPrio(task.prio);
        setDueDate(task.due_date);
    }, [task]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!projName.trim()) return;

        onSubmit({
            proj_name: projName,
            prio,
            due_date: dueDate,
        });

        onClose();
    };

    // Styling variants matching your card components
    const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200/80 text-slate-900";
    const inputBg = isDarkMode ? "bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400";
    const labelText = "text-xs font-bold uppercase tracking-wider text-slate-400";

    return (
        <form onSubmit={handleSubmit} className={`${cardBg} rounded-3xl border p-6 shadow-xl flex flex-col gap-5 w-full max-w-md mx-auto transition-colors duration-300`}>
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Edit Task</h2>
                <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer" aria-label="Close form">
                    <FiX className="w-4 h-4" />
                </button>
            </div>

            {/* Project Name Input */}
            <div className="flex flex-col gap-1.5">
                <label className={`${labelText} flex items-center gap-1.5`}>
                    <FiFolder className="w-3.5 h-3.5" /> Project Name
                </label>
                <input 
                    type="text" 
                    required
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className={`w-full text-xs ${inputBg} border rounded-xl px-4 py-3 focus:outline-none transition-colors duration-300`}
                />
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col gap-1.5">
                <label className={`${labelText} flex items-center gap-1.5`}>
                    <FiFlag className="w-3.5 h-3.5" /> Priority
                </label>
                <select 
                    value={prio}
                    onChange={(e) => setPrio(e.target.value)}
                    className={`w-full text-xs ${inputBg} border rounded-xl px-4 py-3 focus:outline-none transition-colors duration-300 cursor-pointer`}
                >
                    <option value="Low" className={isDarkMode ? "bg-slate-900 text-slate-200" : "bg-white text-slate-800"}>Low</option>
                    <option value="Medium" className={isDarkMode ? "bg-slate-900 text-slate-200" : "bg-white text-slate-800"}>Medium</option>
                    <option value="High" className={isDarkMode ? "bg-slate-900 text-slate-200" : "bg-white text-slate-800"}>High</option>
                </select>
            </div>

            {/* Due Date Picker */}
            <div className="flex flex-col gap-1.5">
                <label className={`${labelText} flex items-center gap-1.5`}>
                    <FiCalendar className="w-3.5 h-3.5" /> Due Date
                </label>
                <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full text-xs ${inputBg} border rounded-xl px-4 py-3 focus:outline-none transition-colors duration-300`}
                />
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer mt-2"
            >
                <FiCheck className="w-4 h-4" /> Save Changes
            </button>
        </form>
    );
}