import { useState } from "react";

function ApplicationTable({ applications, onDelete, onEdit }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [followUpFilter, setFollowUpFilter] = useState("All");

    const getToday = () => {
        return new Date().toLocaleDateString("en-CA");
    };

    const getFollowUpStatus = (followUpDate) => {
        if (!followUpDate) {
            return {
                label: "No Follow-up",
                className: "no-follow-up",
            };
        }

        const today = getToday();

        if (followUpDate < today) {
            return {
                label: "Overdue",
                className: "overdue",
            };
        }

        if (followUpDate === today) {
            return {
                label: "Due Today",
                className: "due-today",
            };
        }

        return {
            label: "Upcoming",
            className: "upcoming",
        };
    };

    const filteredApplications = applications.filter((app) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            (app.company || "").toLowerCase().includes(search) ||
            (app.role || "").toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            app.status === statusFilter;

        const followUpStatus = getFollowUpStatus(
            app.followUpDate
        );

        const matchesFollowUp =
            followUpFilter === "All" ||
            followUpStatus.className === followUpFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesFollowUp
        );
    });

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (confirmed) {
            onDelete(id);
        }
    };

    return (
        <div className="application-table-container">

            {/* ================= TABLE CONTROLS ================= */}

            <div className="table-controls">

                <div className="search-box">
                    <span>🔎</span>

                    <input
                        type="text"
                        placeholder="Search company or role..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="OA">
                        Online Assessment
                    </option>
                    <option value="Interview">
                        Interview
                    </option>
                    <option value="HR">HR</option>
                    <option value="Selected">
                        Selected
                    </option>
                    <option value="Rejected">
                        Rejected
                    </option>
                    <option value="Ghosted">
                        Ghosted
                    </option>
                </select>

                <select
                    className="status-filter"
                    value={followUpFilter}
                    onChange={(e) =>
                        setFollowUpFilter(e.target.value)
                    }
                >
                    <option value="All">
                        All Follow-ups
                    </option>
                    <option value="overdue">
                        🔴 Overdue
                    </option>
                    <option value="due-today">
                        🟡 Due Today
                    </option>
                    <option value="upcoming">
                        🔵 Upcoming
                    </option>
                    <option value="no-follow-up">
                        ⚪ No Follow-up
                    </option>
                </select>
            </div>

            {/* ================= TABLE INFO ================= */}

            <div className="table-info">
                <span>
                    Showing{" "}
                    <strong>
                        {filteredApplications.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {applications.length}
                    </strong>{" "}
                    applications
                </span>
            </div>

            {/* ================= TABLE ================= */}

            {filteredApplications.length === 0 ? (
                <div className="table-empty">
                    <div className="table-empty-icon">
                        🔎
                    </div>

                    <h3>No applications found</h3>

                    <p>
                        Try changing your search term or
                        filters.
                    </p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="application-table">

                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Role</th>
                                <th>Salary</th>
                                <th>Source</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Follow-up</th>
                                <th>Job</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredApplications.map((app) => {
                                const followUpStatus =
                                    getFollowUpStatus(
                                        app.followUpDate
                                    );

                                return (
                                    <tr key={app.id}>

                                        {/* Company */}

                                        <td>
                                            <div className="company-cell">

                                                <div className="company-avatar">
                                                    {(app.company ||
                                                        "?")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <strong>
                                                    {app.company}
                                                </strong>
                                            </div>
                                        </td>

                                        {/* Role */}

                                        <td>
                                            {app.role}
                                        </td>

                                        {/* Salary */}

                                        <td>
                                            {app.salary
                                                ? app.salary
                                                : "—"}
                                        </td>

                                        {/* Source */}

                                        <td>
                                            {app.source || "—"}
                                        </td>

                                        {/* Date */}

                                        <td>
                                            {app.dateApplied || "—"}
                                        </td>

                                        {/* Status */}

                                        <td>
                                            <span
                                                className={`status-badge status-${(
                                                    app.status ||
                                                    ""
                                                )
                                                    .toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )}`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>

                                        {/* Follow-up */}

                                        <td>
                                            <div className="follow-up-cell">

                                                {app.followUpDate && (
                                                    <span className="follow-up-date">
                                                        {app.followUpDate}
                                                    </span>
                                                )}

                                                <span
                                                    className={`follow-up-badge ${followUpStatus.className}`}
                                                >
                                                    {followUpStatus.label}
                                                </span>

                                            </div>
                                        </td>

                                        {/* Job URL */}

                                        <td>
                                            {app.jobUrl ? (
                                                <a
                                                    href={app.jobUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="job-link"
                                                >
                                                    Open ↗
                                                </a>
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        {/* Actions */}

                                        <td>
                                            <div className="table-actions">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        onEdit(app)
                                                    }
                                                    title="Edit application"
                                                >
                                                    ✏️
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            app.id
                                                        )
                                                    }
                                                    title="Delete application"
                                                >
                                                    🗑️
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}

export default ApplicationTable;