"use client";
import { useState, useEffect } from "react";
import Board from "@/components/Board";
import AddTaskForm from "@/components/AddTaskForm";
import { createNewTask, checkStatus } from "@/services/taskServices"; // Adjust path if your service file is located elsewhere
import { FiPlus, FiSun, FiMoon } from "react-icons/fi";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle task submission from the modal form
  const handleAddTaskSubmit = async (taskData: { proj_name: string; prio: string; due_date: string }) => {
    try {
      await createNewTask({
        ...taskData,
        status: "todo", // Default new tasks to the 'To Do' column
        subtasks: []
      });
      setIsModalOpen(false);
      // Optional: Trigger a state change or event if your Board needs to instantly re-fetch tasks
      window.location.reload(); // Simple refresh or replace with state-driven refresh if preferred
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  useEffect(() => {
      const status = async () => {
          try {
              const data = await checkStatus();
              console.log(data)
          } catch (error) {
              console.error("Failed to fetch tasks:", error);
          }
      };

      status();
  }, []);

  return (
    <div className={`min-h-screen font-poppins transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
    }`}>
      {/* Full-width layout container */}
      <div className="w-full px-6 md:px-10 py-8 flex flex-col gap-8">
        
        {/* Header Bar */}
        <header className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 md:p-8 rounded-3xl border shadow-sm gap-4 transition-colors duration-300 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Kanban Board
            </h1>
            <p className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Manage and organize your project workflow efficiently
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-2xl transition-all shadow-2xs flex items-center justify-center cursor-pointer ${
                isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <FiSun className="w-5 h-5 text-amber-400" /> : <FiMoon className="w-5 h-5 text-slate-600" />}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </header>

        {/* Board Container */}
        <main className="w-full">
          <Board isDarkMode={isDarkMode} />
        </main>

      </div>

      {/* Add Task Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md">
            <AddTaskForm 
              isDarkMode={isDarkMode} 
              onSubmit={handleAddTaskSubmit} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}