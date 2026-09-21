import { DoneCardProps } from "@/types/task"
import { FiCalendar, FiFlag, FiCheckSquare, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { useState } from "react"

interface ExtendedDoneCardProps extends DoneCardProps {
    isDarkMode: boolean;
    onDelete?: () => void;
}

export default function DoneCard({ proj_name, prio, due_date, subtasks, isDarkMode, onDelete }: ExtendedDoneCardProps){
    const [isExpanded, setIsExpanded] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return isDarkMode ? 'text-red-400 bg-red-950/50 border-red-900/50' : 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return isDarkMode ? 'text-amber-400 bg-amber-950/50 border-amber-900/50' : 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low': return isDarkMode ? 'text-emerald-400 bg-emerald-950/50 border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: return isDarkMode ? 'text-slate-400 bg-slate-800 border-slate-700' : 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    const cardBg = isDarkMode ? "bg-slate-900/60 border-slate-800/80 text-slate-200" : "bg-white/80 border-slate-200/80 text-slate-900";
    const subcardBg = isDarkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50/80 border-slate-100";
    const innerSubBg = isDarkMode ? "bg-slate-800/80 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-500";

    return(
        <div className={`${cardBg} rounded-3xl border p-6 shadow-2xs flex flex-col gap-4 w-full opacity-90 transition-colors duration-300 shrink-0`}>
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-base font-semibold">{proj_name}</p>
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)} 
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            aria-label="Toggle Done Card Data"
                        >
                            {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer" aria-label="Delete Task">
                    <FiTrash2 className="w-4 h-4" />
                </button>
            </div>

            {isExpanded && (
                <>
                    <div className={`grid grid-cols-2 gap-3 ${subcardBg} p-4 rounded-2xl border transition-colors duration-300`}>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                <FiFlag className="w-3.5 h-3.5" /> Priority
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border w-fit ${getPriorityColor(prio)}`}>
                                {prio}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                <FiCalendar className="w-3.5 h-3.5" /> Due Date
                            </span>
                            <span className="text-xs font-semibold text-slate-400">{due_date}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subtasks</h3>
                        
                        {subtasks && subtasks.length > 0 ? (
                            subtasks.map((sub) => (
                                <div key={sub.id} className={`flex items-center gap-3 text-xs ${innerSubBg} border px-3.5 py-3 rounded-xl transition-colors duration-300`}>
                                    <FiCheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="line-through font-medium">{sub.task}</span>
                                </div>
                            ))
                        ) : (
                            <p className={`text-xs italic border border-dashed px-4 py-3 rounded-xl text-center ${isDarkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                                No subtasks added
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}