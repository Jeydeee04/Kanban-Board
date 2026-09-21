import { Task } from "@/types/task";
import { getFormattedDateParts } from "./getFormattedDateParts";

export const getCascadedOptions = (statusTasks: Task[], currentPriority: string, currentMonth: string, currentDay: string) => {
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