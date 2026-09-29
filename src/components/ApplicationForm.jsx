function ApplicationForm({ onAdd, onEdit, onClose, editingApplication }) {
    const isEditing = Boolean(editingApplication);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const application = {
            id: isEditing ? editingApplication.id : Date.now(),

            company: formData.get("company"),
            role: formData.get("role"),
            salary: formData.get("salary"),
            location: formData.get("location"),
            workMode: formData.get("workMode"),
            source: formData.get("source"),
            jobUrl: formData.get("jobUrl"),
            dateApplied: formData.get("dateApplied"),
            followUpDate: formData.get("followUpDate"),
            status: formData.get("status"),
            notes: formData.get("notes"),
        };

        if (isEditing) {
            onEdit(application);
        } else {
            onAdd(application);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="application-modal">

                {/* ================= HEADER ================= */}

                <div className="modal-header">
                    <div>
                        <h2>
                            {isEditing
                                ? "Edit Application"
                                : "Add Application"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update your application details."
                                : "Track a new job application."}
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

                {/* ================= FORM ================= */}

                <form onSubmit={handleSubmit} className="application-form">
                    <div className="form-grid">

                        {/* Company */}

                        <div className="form-group">
                            <label>
                                Company <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="company"
                                placeholder="e.g. Microsoft"
                                defaultValue={
                                    editingApplication?.company || ""
                                }
                                required
                            />
                        </div>

                        {/* Job Role */}

                        <div className="form-group">
                            <label>
                                Job Role <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="role"
                                placeholder="e.g. Software Engineer"
                                defaultValue={
                                    editingApplication?.role || ""
                                }
                                required
                            />
                        </div>

                        {/* Salary */}

                        <div className="form-group">
                            <label>Salary</label>

                            <input
                                type="text"
                                name="salary"
                                placeholder="e.g. ₹8 LPA"
                                defaultValue={
                                    editingApplication?.salary || ""
                                }
                            />
                        </div>

                        {/* Location */}

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Bangalore"
                                defaultValue={
                                    editingApplication?.location || ""
                                }
                            />
                        </div>

                        {/* Work Mode */}

                        <div className="form-group">
                            <label>Work Mode</label>

                            <select
                                name="workMode"
                                defaultValue={
                                    editingApplication?.workMode || "Hybrid"
                                }
                            >
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Onsite">Onsite</option>
                            </select>
                        </div>

                        {/* Source */}

                        <div className="form-group">
                            <label>Applied Through</label>

                            <select
                                name="source"
                                defaultValue={
                                    editingApplication?.source || "LinkedIn"
                                }
                            >
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Naukri">Naukri</option>
                                <option value="Indeed">Indeed</option>
                                <option value="Wellfound">Wellfound</option>
                                <option value="Internshala">
                                    Internshala
                                </option>
                                <option value="Company Website">
                                    Company Website
                                </option>
                                <option value="Referral">Referral</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Job URL */}

                        <div className="form-group full-width">
                            <label>Job URL</label>

                            <input
                                type="url"
                                name="jobUrl"
                                placeholder="https://..."
                                defaultValue={
                                    editingApplication?.jobUrl || ""
                                }
                            />
                        </div>

                        {/* Date Applied */}

                        <div className="form-group">
                            <label>Date Applied</label>

                            <input
                                type="date"
                                name="dateApplied"
                                defaultValue={
                                    editingApplication?.dateApplied ||
                                    new Date().toLocaleDateString("en-CA")
                                }
                            />
                        </div>

                        {/* Follow-up Date */}

                        <div className="form-group">
                            <label>Follow-up Date</label>

                            <input
                                type="date"
                                name="followUpDate"
                                defaultValue={
                                    editingApplication?.followUpDate || ""
                                }
                            />

                            <small className="form-help">
                                Set a date to remind yourself to follow up.
                            </small>
                        </div>

                        {/* Status */}

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                defaultValue={
                                    editingApplication?.status || "Applied"
                                }
                            >
                                <option value="Applied">Applied</option>
                                <option value="OA">
                                    Online Assessment
                                </option>
                                <option value="Interview">
                                    Interview
                                </option>
                                <option value="HR">HR</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Ghosted">Ghosted</option>
                            </select>
                        </div>

                        {/* Notes */}

                        <div className="form-group full-width">
                            <label>Notes</label>

                            <textarea
                                name="notes"
                                rows="4"
                                placeholder="Add notes about this application..."
                                defaultValue={
                                    editingApplication?.notes || ""
                                }
                            ></textarea>
                        </div>
                    </div>

                    {/* ================= FOOTER ================= */}

                    <div className="form-actions">
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
                            {isEditing
                                ? "Save Changes"
                                : "Add Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplicationForm;