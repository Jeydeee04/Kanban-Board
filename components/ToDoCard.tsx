import { ToDoCardProps } from "@/types/task";
import { FiCalendar, FiFlag, FiEdit2, FiTrash2, FiArrowRight } from "react-icons/fi"

interface ExtendedToDoCardProps extends ToDoCardProps {
    isDarkMode: boolean;
    onDelete?: () => void;
    onMove?: () => void;
    onEdit?: () => void;
}

export default function ToDoCard({ proj_name, prio, due_date, isDarkMode, onDelete, onMove, onEdit }: ExtendedToDoCardProps){
    const getPriorityColor = (p: string) => {
        switch (p?.toLowerCase()) {
            case 'high': return isDarkMode ? 'text-red-400 bg-red-950/50 border-red-900/50' : 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return isDarkMode ? 'text-amber-400 bg-amber-950/50 border-amber-900/50' : 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low': return isDarkMode ? 'text-emerald-400 bg-emerald-950/50 border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: return isDarkMode ? 'text-slate-400 bg-slate-800 border-slate-700' : 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200/80 text-slate-900";
    const subcardBg = isDarkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50/80 border-slate-100";

    return(
        <div className={`${cardBg} rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 w-full shrink-0`}>
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project</h3>
                    <p className="text-base font-semibold">{proj_name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button 
                        onClick={onEdit} 
                        className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors cursor-pointer" 
                        aria-label="Edit Task"
                    >
                        <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={onDelete} 
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer" 
                        aria-label="Delete Task"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

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
                    <span className="text-xs font-semibold">{due_date}</span>
                </div>
            </div>

            <button 
                onClick={onMove} 
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
                Start Doing <FiArrowRight className="w-4 h-4" />
            </button>
        </div>
    )
}