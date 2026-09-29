import { useState } from "react";

function DevelopmentForm({ onSave, onClose, project }) {
    const [formData, setFormData] = useState({
        name: project?.name || "",
        description: project?.description || "",
        technologies: project?.technologies || "",
        status: project?.status || "Planning",
        progress: project?.progress || 0,
        hours: project?.hours || 0,
        githubUrl: project?.githubUrl || "",
        liveUrl: project?.liveUrl || "",
        startDate: project?.startDate || "",
        targetDate: project?.targetDate || "",
        notes: project?.notes || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter a project name.");
            return;
        }

        const projectData = {
            ...formData,
            name: formData.name.trim(),
            progress: Number(formData.progress),
            hours: Number(formData.hours),
            technologies: formData.technologies
                .split(",")
                .map((tech) => tech.trim())
                .filter(Boolean),
        };

        onSave(projectData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal development-modal">
                <div className="modal-header">
                    <div>
                        <h2>
                            {project ? "Edit Project" : "Add Project"}
                        </h2>

                        <p>
                            Track your development work and portfolio projects.
                        </p>
                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label>Project Name *</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. JobSprint"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What are you building?"
                                rows="3"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Technologies</label>

                            <input
                                type="text"
                                name="technologies"
                                value={formData.technologies}
                                onChange={handleChange}
                                placeholder="React, JavaScript, Firebase"
                            />

                            <small>
                                Separate technologies with commas.
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Planning">
                                    Planning
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>

                                <option value="Paused">
                                    Paused
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Progress (%)</label>

                            <input
                                type="number"
                                name="progress"
                                value={formData.progress}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label>Hours Spent</label>

                            <input
                                type="number"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                min="0"
                                step="0.5"
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Start Date</label>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Target Date</label>

                            <input
                                type="date"
                                name="targetDate"
                                value={formData.targetDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>GitHub URL</label>

                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Live Demo URL</label>

                            <input
                                type="url"
                                name="liveUrl"
                                value={formData.liveUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Notes</label>

                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Anything important about this project..."
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
                            {project ? "Update Project" : "Save Project"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default DevelopmentForm;