"use client";
import { FormEvent, useState } from "react";
import { FiX } from "react-icons/fi";

type TaskFormValues = {
	projectName: string;
	priority: string;
	dueDate: string;
};

type FormProps = {
	mode: "add" | "edit";
	initialValues?: TaskFormValues;
	onSubmit: (values: TaskFormValues) => void;
	onClose: () => void;
	isDark: boolean;
};

const emptyValues: TaskFormValues = {
	projectName: "",
	priority: "Medium",
	dueDate: "",
};

export default function Form({ mode, initialValues, onSubmit, onClose, isDark }: FormProps) {
	const [values, setValues] = useState({ ...emptyValues, ...initialValues });

	const updateValue = (field: keyof TaskFormValues, value: string) => {
		setValues((current) => ({ ...current, [field]: value }));
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(values);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
			role="presentation"
		>
			<form
				onSubmit={handleSubmit}
				className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
					isDark ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
				}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby="task-form-title"
			>
				<div className="mb-5 flex items-center justify-between">
					<h2 id="task-form-title" className="text-lg font-bold">
						{mode === "add" ? "Add Task" : "Edit Task"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className={`rounded-lg p-1.5 transition ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"}`}
						title="Close form"
						aria-label="Close form"
					>
						<FiX className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>

				<div className="space-y-4">
					<label className="block text-xs font-semibold uppercase tracking-wider">
						Project Name
						<input
							type="text"
							value={values.projectName}
							onChange={(event) => updateValue("projectName", event.target.value)}
							className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-300 bg-white text-slate-900"}`}
							placeholder="e.g. Website redesign"
							required
							autoFocus
						/>
					</label>

					<label className="block text-xs font-semibold uppercase tracking-wider">
						Priority
						<select
							value={values.priority}
							onChange={(event) => updateValue("priority", event.target.value)}
							className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-300 bg-white text-slate-900"}`}
						>
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</label>

					<label className="block text-xs font-semibold uppercase tracking-wider">
						Due Date
						<input
							type="text"
							value={values.dueDate}
							onChange={(event) => updateValue("dueDate", event.target.value)}
							className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-300 bg-white text-slate-900"}`}
							placeholder="e.g. Next Friday"
							required
						/>
					</label>
				</div>

				<div className="mt-6 flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
					>
						{mode === "add" ? "Add Task" : "Save Changes"}
					</button>
				</div>
			</form>
		</div>
	);
}
