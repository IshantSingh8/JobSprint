import { useState } from "react";

function DevelopmentTaskForm({
    project,
    onSave,
    onClose,
}) {
    const [task, setTask] = useState({
        title: "",
        priority: "Medium",
        status: "Todo",
        dueDate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!task.title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        onSave({
            ...task,
            title: task.title.trim(),
            projectId: project.id,
            id: Date.now(),
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">

                <div className="modal-header">

                    <div>
                        <h2>Add Development Task</h2>

                        <p>
                            Add a task for{" "}
                            <strong>{project.name}</strong>.
                        </p>
                    </div>

                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label>Task Title *</label>

                            <input
                                type="text"
                                name="title"
                                value={task.title}
                                onChange={handleChange}
                                placeholder="e.g. Build login page"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Priority</label>

                            <select
                                name="priority"
                                value={task.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={task.status}
                                onChange={handleChange}
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">
                                    In Progress
                                </option>
                                <option value="Completed">
                                    Completed
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>

                            <input
                                type="date"
                                name="dueDate"
                                value={task.dueDate}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="add-button"
                        >
                            Add Task
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default DevelopmentTaskForm;