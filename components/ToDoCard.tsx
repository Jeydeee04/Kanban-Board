"use client";

export default function ToDoCard({ task, onStart, onDelete, onEdit, isDark = false }: any) {
    // Fallbacks if used standalone or with task props
    const projectName = task?.projectName || "Kanban Board";
    const priority = task?.priority || "Low";
    const dueDate = task?.dueDate || "None";

    return (
        <div className={`border rounded-2xl p-5 shadow-sm transition-all duration-200 font-poppins w-full flex flex-col justify-between ${
            isDark 
                ? "bg-slate-950 border-slate-800 text-slate-100 hover:border-slate-700" 
                : "bg-white border-slate-200/80 text-slate-900 hover:shadow-md hover:border-slate-300"
        }`}>
            <div>
                {/* Header Section */}
                <div className={`mb-4 pb-3.5 border-b flex items-start justify-between ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                    <div>
                        <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                            isDark ? "text-indigo-400 bg-indigo-950/60" : "text-indigo-600 bg-indigo-50/80"
                        }`}>
                            Project
                        </span>
                        <h1 className={`text-base font-bold mt-2.5 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                            {projectName}
                        </h1>
                    </div>

                    {/* Edit and Delete Action Buttons */}
                    <div className="flex items-center space-x-1 shrink-0">
                        <button 
                            onClick={onEdit}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isDark ? "text-slate-400 hover:text-indigo-400 hover:bg-slate-900" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            }`}
                            title="Edit Task"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                        </button>
                        <button 
                            onClick={onDelete}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isDark ? "text-slate-400 hover:text-rose-400 hover:bg-slate-900" : "text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                            }`}
                            title="Delete Task"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Metadata Section: Priority and Due Date Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Priority Box */}
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/70 border-slate-200/60"
                    }`}>
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l-4-4m4 4H13"/>
                            </svg>
                            <span>Priority</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block w-fit ${
                            priority === 'High' 
                                ? (isDark ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50' : 'bg-rose-50 text-rose-700 border border-rose-200')
                                : (isDark ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-700 border border-slate-200/60')
                        }`}>
                            {priority}
                        </span>
                    </div>

                    {/* Due Date Box */}
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/70 border-slate-200/60"
                    }`}>
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span>Due Date</span>
                        </div>
                        <p className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                            {dueDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Start Task Action Button */}
            <button 
                onClick={onStart}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-xs cursor-pointer ${
                    isDark 
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <span>Start Task</span>
            </button>
        </div>
    );
}