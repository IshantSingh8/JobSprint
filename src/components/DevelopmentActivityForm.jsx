import { useState } from "react";

function DevelopmentActivityForm({
    projects,
    selectedProject,
    onSave,
    onClose,
}) {
    const [activity, setActivity] = useState({
        projectId: selectedProject?.id || projects[0]?.id || "",
        date: new Date().toISOString().split("T")[0],
        hours: "",
        title: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!activity.projectId) {
            alert("Please select a project.");
            return;
        }

        if (!activity.title.trim()) {
            alert("Please enter an activity title.");
            return;
        }

        if (!activity.hours || Number(activity.hours) <= 0) {
            alert("Please enter valid hours.");
            return;
        }

        onSave({
            id: Date.now(),
            projectId: Number(activity.projectId),
            date: activity.date,
            hours: Number(activity.hours),
            title: activity.title.trim(),
            description: activity.description.trim(),
        });
    };

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <div>
                        <h2>Log Development Hours</h2>

                        <p>
                            Record the development work you
                            completed.
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

                            <label>Project *</label>

                            <select
                                name="projectId"
                                value={activity.projectId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Project
                                </option>

                                {projects.map((project) => (
                                    <option
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </option>
                                ))}

                            </select>

                        </div>

                        <div className="form-group">

                            <label>Date *</label>

                            <input
                                type="date"
                                name="date"
                                value={activity.date}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>Hours *</label>

                            <input
                                type="number"
                                name="hours"
                                value={activity.hours}
                                onChange={handleChange}
                                min="0.25"
                                step="0.25"
                                placeholder="e.g. 2"
                                required
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>Activity *</label>

                            <input
                                type="text"
                                name="title"
                                value={activity.title}
                                onChange={handleChange}
                                placeholder="e.g. Built application tracking table"
                                required
                            />

                        </div>

                        <div className="form-group full-width">

                            <label>Description</label>

                            <textarea
                                name="description"
                                value={activity.description}
                                onChange={handleChange}
                                placeholder="What did you work on?"
                                rows="3"
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
                            Log Hours
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default DevelopmentActivityForm;