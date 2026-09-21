export const getFormattedDateParts = (dateStr: string) => {
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