import { DoingCardProps } from "@/types/task"
import { FiCalendar, FiFlag, FiSquare, FiCheckSquare, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"

interface ExtendedDoingCardProps extends DoingCardProps {
    isDarkMode?: boolean;
    onDelete?: () => void;
    onMove?: () => void;
    onEdit?: () => void;
    onAddSubtask?: () => void;
    subtaskInput?: string;
    onSubtaskInputChange?: (val: string) => void;
    onDeleteSubtask?: (subId: number) => void;
    onToggleSubtask?: (subId: number) => void;
}

export default function DoingCard({ proj_name, prio, due_date, subtasks, isDarkMode, onDelete, onMove, onEdit, onAddSubtask, subtaskInput, onSubtaskInputChange, onDeleteSubtask, onToggleSubtask }: ExtendedDoingCardProps){
    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': 
                return isDarkMode ? 'text-red-400 bg-red-950/50 border-red-900/50' : 'text-red-600 bg-red-50 border-red-200';
            case 'medium': 
                return isDarkMode ? 'text-amber-400 bg-amber-950/50 border-amber-900/50' : 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low': 
                return isDarkMode ? 'text-emerald-400 bg-emerald-950/50 border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: 
                return isDarkMode ? 'text-slate-400 bg-slate-800 border-slate-700' : 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    const cardBg = isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80";
    const labelColor = "text-xs font-bold uppercase tracking-wider text-slate-400";
    const titleColor = isDarkMode ? "text-slate-100" : "text-slate-800";
    const gridBg = isDarkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50/80 border-slate-100";
    const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
    const textValue = isDarkMode ? "text-slate-300" : "text-slate-700";
    
    const subtaskCardBg = isDarkMode ? "bg-slate-800/80 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50/80";
    const subtaskIconColor = isDarkMode ? "text-slate-600" : "text-slate-300";
    const subtaskEmptyBg = isDarkMode ? "bg-slate-800/40 border-slate-800 text-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-400";
    
    const inputStyling = isDarkMode 
        ? "bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-indigo-500" 
        : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:ring-indigo-500";
        
    const addBtnStyling = isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600";
    const actionBtnHover = isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50";

    return(
        <div className={`${cardBg} rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 w-full shrink-0`}>
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className={labelColor}>Project</h3>
                    <p className={`text-base font-semibold ${titleColor}`}>{proj_name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button 
                        onClick={onEdit} 
                        className={`p-2 text-slate-400 hover:text-indigo-600 ${actionBtnHover} rounded-xl transition-colors cursor-pointer`} 
                        aria-label="Edit Task"
                    >
                        <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={onDelete} 
                        className={`p-2 text-slate-400 hover:text-red-600 ${actionBtnHover} rounded-xl transition-colors cursor-pointer`} 
                        aria-label="Delete Task"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-2 gap-3 ${gridBg} p-4 rounded-2xl border`}>
                <div className="flex flex-col gap-1.5">
                    <span className={`text-xs font-medium ${textMuted} flex items-center gap-1.5`}>
                        <FiFlag className="w-3.5 h-3.5 text-slate-400" /> Priority
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border w-fit ${getPriorityColor(prio)}`}>
                        {prio}
                    </span>
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className={`text-xs font-medium ${textMuted} flex items-center gap-1.5`}>
                        <FiCalendar className="w-3.5 h-3.5 text-slate-400" /> Due Date
                    </span>
                    <span className={`text-xs font-semibold ${textValue}`}>{due_date}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className={labelColor}>Subtasks</h3>
                
                {subtasks && subtasks.length > 0 ? (
                    subtasks.map((sub) => {
                        const isDone = sub.status === 'done';
                        return (
                            <div 
                                key={sub.id} 
                                onClick={() => onToggleSubtask?.(sub.id)}
                                className={`flex items-center justify-between gap-3 text-xs ${subtaskCardBg} border px-3.5 py-3 rounded-xl shadow-2xs cursor-pointer transition-all`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {isDone ? (
                                        <FiCheckSquare className="w-4 h-4 text-indigo-500 shrink-0" />
                                    ) : (
                                        <FiSquare className={`w-4 h-4 ${subtaskIconColor} shrink-0`} />
                                    )}
                                    <span className={`truncate font-medium ${isDone ? 'line-through text-slate-400' : ''}`}>
                                        {sub.task}
                                    </span>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents triggering checklist toggle when deleting
                                        onDeleteSubtask?.(sub.id);
                                    }}
                                    className={`p-1.5 text-slate-400 hover:text-red-600 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} rounded-lg transition-colors cursor-pointer shrink-0`}
                                    aria-label="Delete Subtask"
                                >
                                    <FiTrash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className={`text-xs italic ${subtaskEmptyBg} border border-dashed px-4 py-3 rounded-xl text-center`}>
                        No subtasks yet
                    </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                    <input 
                        type="text" 
                        placeholder="Add a subtask..." 
                        value={subtaskInput || ""}
                        onChange={(e) => onSubtaskInputChange?.(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') onAddSubtask?.(); }}
                        className={`w-full text-xs border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${inputStyling}`}
                    />
                    <button 
                        onClick={onAddSubtask} 
                        className={`${addBtnStyling} p-3 rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer`} 
                        aria-label="Add Subtask"
                    >
                        <FiPlus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <button 
                onClick={onMove} 
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
                Mark as Done
            </button>
        </div>
    )
}