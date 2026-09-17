"use client";
import { useState } from "react";
import TaskCard from "./TaskCard";
import ToDoCard from "./ToDoCard";

export default function Board({ 
    boardId, 
    initialTitle, 
    boards,
    tasks,
    onDeleteTask,
    onUpdateTask,
    onMoveTask,
    onDelete, 
    onUpdate,
    isDark 
}: any) {
    const [title, setTitle] = useState(initialTitle);

    return (
        <div className={`flex-1 min-w-[280px] backdrop-blur-sm border rounded-2xl p-4 min-h-[650px] shadow-xs font-poppins flex flex-col justify-between transition-colors duration-200 ${
            isDark 
                ? "bg-slate-900/80 border-slate-800 text-slate-100" 
                : "bg-slate-100/80 border-slate-200/70 text-slate-900"
        }`}>
          <div>
            <div className="flex justify-between items-center mb-5 px-2">
                <div className="flex items-center space-x-2.5 flex-1 mr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-xs"></span>
                    <h1 
                        className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition ${
                            isDark ? "text-slate-200 hover:text-indigo-400" : "text-slate-800 hover:text-indigo-600"
                        }`} 
                    >
                        {title}
                    </h1>
                </div>
                <div className="flex items-center space-x-1.5">
                    <span className={`text-xs font-semibold shadow-2xs px-2.5 py-0.5 rounded-full border ${
                        isDark 
                            ? "bg-slate-950 border-slate-800 text-slate-300" 
                            : "bg-white border-slate-200/60 text-slate-600"
                    }`}>
                        {tasks.length}
                    </span>
                </div>
            </div>

            <div className="space-y-3.5">
                {tasks.map((task: any) => (
                    title === "To Do" ? (
                        <ToDoCard 
                            key={task.id} 
                            task={task} 
                            boards={boards}
                            onDelete={() => onDeleteTask(task.id)} 
                            onEdit={onUpdateTask}
                            onMove={onMoveTask}
                            isDark={isDark}
                        />
                    ) : (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            boards={boards}
                            onDelete={() => onDeleteTask(task.id)} 
                            onEdit={onUpdateTask}
                            onMove={onMoveTask}
                            isDark={isDark}
                        />
                    )
                ))}
            </div>
          </div>
        </div>
    )
}