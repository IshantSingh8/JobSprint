import { useState } from "react";
import DevelopmentForm from "../components/DevelopmentForm";
import DevelopmentTaskForm from "../components/DevelopmentTaskForm";
import DevelopmentActivityForm from "../components/DevelopmentActivityForm";

function Development() {
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem(
            "jobsprint-development"
        );

        return saved ? JSON.parse(saved) : [];
    });

    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem(
            "jobsprint-development-tasks"
        );

        return saved ? JSON.parse(saved) : [];
    });

    const [activities, setActivities] = useState(() => {
        const saved = localStorage.getItem(
            "jobsprint-development-activities"
        );

        return saved ? JSON.parse(saved) : [];
    });

    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] =
        useState(null);

    const [showTaskForm, setShowTaskForm] =
        useState(false);

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [showActivityForm, setShowActivityForm] =
        useState(false);

    const [activityFilter, setActivityFilter] =
        useState("All");

    const [projectSearch, setProjectSearch] =
        useState("");

    const [projectStatusFilter, setProjectStatusFilter] =
        useState("All");

    const saveProjects = (updatedProjects) => {
        setProjects(updatedProjects);

        localStorage.setItem(
            "jobsprint-development",
            JSON.stringify(updatedProjects)
        );
    };

    const saveTasks = (updatedTasks) => {
        setTasks(updatedTasks);

        localStorage.setItem(
            "jobsprint-development-tasks",
            JSON.stringify(updatedTasks)
        );
    };

    const saveActivities = (updatedActivities) => {
        setActivities(updatedActivities);

        localStorage.setItem(
            "jobsprint-development-activities",
            JSON.stringify(updatedActivities)
        );
    };

    const handleSaveProject = (projectData) => {
        let updatedProjects;

        if (editingProject) {
            updatedProjects = projects.map((project) =>
                project.id === editingProject.id
                    ? {
                        ...project,
                        ...projectData,
                    }
                    : project
            );
        } else {
            const newProject = {
                id: Date.now(),
                ...projectData,
            };

            updatedProjects = [
                ...projects,
                newProject,
            ];
        }

        saveProjects(updatedProjects);

        setShowForm(false);
        setEditingProject(null);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        const updatedProjects = projects.filter(
            (project) => project.id !== id
        );

        const updatedTasks = tasks.filter(
            (task) => task.projectId !== id
        );

        const updatedActivities = activities.filter(
            (activity) => activity.projectId !== id
        );

        saveProjects(updatedProjects);
        saveTasks(updatedTasks);
        saveActivities(updatedActivities);
    };

    const handleSaveTask = (task) => {
        const updatedTasks = [
            ...tasks,
            task,
        ];

        saveTasks(updatedTasks);

        setShowTaskForm(false);
        setSelectedProject(null);
    };

    const toggleTaskStatus = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,
                status:
                    task.status === "Completed"
                        ? "Todo"
                        : "Completed",
            };
        });

        saveTasks(updatedTasks);
    };

    const deleteTask = (taskId) => {
        const confirmed = window.confirm(
            "Delete this task?"
        );

        if (!confirmed) {
            return;
        }

        const updatedTasks = tasks.filter(
            (task) => task.id !== taskId
        );

        saveTasks(updatedTasks);
    };

    const handleSaveActivity = (activity) => {
        const updatedActivities = [
            ...activities,
            activity,
        ];

        saveActivities(updatedActivities);

        setShowActivityForm(false);
        setSelectedProject(null);
    };

    const deleteActivity = (activityId) => {
        const confirmed = window.confirm(
            "Delete this development activity?"
        );

        if (!confirmed) {
            return;
        }

        const updatedActivities =
            activities.filter(
                (activity) =>
                    activity.id !== activityId
            );

        saveActivities(updatedActivities);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    const totalHours = activities.reduce(
        (total, activity) =>
            total + Number(activity.hours || 0),
        0
    );

    const technologies = [
        ...new Set(
            projects.flatMap(
                (project) => project.technologies || []
            )
        ),
    ];

    const tasksDone = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const averageProgress =
        projects.length > 0
            ? Math.round(
                projects.reduce(
                    (total, project) =>
                        total +
                        Number(project.progress || 0),
                    0
                ) / projects.length
            )
            : 0;

    const developmentProgress = Math.min(
        Math.round((totalHours / 42) * 100),
        100
    );

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const getWeekStart = () => {
        const date = new Date();

        const day = date.getDay();

        const difference =
            day === 0 ? -6 : 1 - day;

        date.setDate(
            date.getDate() + difference
        );

        return date
            .toISOString()
            .split("T")[0];
    };

    const weekStart = getWeekStart();

    const todayHours = activities
        .filter(
            (activity) => activity.date === today
        )
        .reduce(
            (total, activity) =>
                total + Number(activity.hours || 0),
            0
        );

    const weekHours = activities
        .filter(
            (activity) =>
                activity.date >= weekStart &&
                activity.date <= today
        )
        .reduce(
            (total, activity) =>
                total + Number(activity.hours || 0),
            0
        );

    const filteredProjects = projects.filter(
        (project) => {
            const matchesSearch =
                project.name
                    .toLowerCase()
                    .includes(
                        projectSearch.toLowerCase()
                    ) ||
                (project.description || "")
                    .toLowerCase()
                    .includes(
                        projectSearch.toLowerCase()
                    ) ||
                (project.technologies || [])
                    .join(" ")
                    .toLowerCase()
                    .includes(
                        projectSearch.toLowerCase()
                    );

            const matchesStatus =
                projectStatusFilter === "All" ||
                project.status ===
                projectStatusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    const filteredActivities =
        activityFilter === "All"
            ? activities
            : activities.filter(
                (activity) =>
                    String(activity.projectId) ===
                    String(activityFilter)
            );

    const sortedActivities = [
        ...filteredActivities,
    ].sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <p className="page-eyebrow">
                        Building
                    </p>

                    <h1>
                        Development Tracker
                    </h1>

                    <p className="page-subtitle">
                        Track your projects, coding hours,
                        technologies and development progress.
                    </p>
                </div>

                <div className="page-header-actions">

                    <button
                        className="secondary-button"
                        onClick={() => {
                            setSelectedProject(null);
                            setShowActivityForm(true);
                        }}
                        disabled={projects.length === 0}
                    >
                        + Log Hours
                    </button>

                    <button
                        className="add-button"
                        onClick={() => {
                            setEditingProject(null);
                            setShowForm(true);
                        }}
                    >
                        + Add Project
                    </button>

                </div>

            </div>

            <div className="dsa-stats-grid">

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        🚀
                    </span>

                    <div>
                        <p>Projects</p>

                        <h2>
                            {projects.length} / 3
                        </h2>
                    </div>

                </div>

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        ⏱️
                    </span>

                    <div>
                        <p>Hours</p>

                        <h2>
                            {totalHours} / 42h
                        </h2>
                    </div>

                </div>

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        💻
                    </span>

                    <div>
                        <p>Technologies</p>

                        <h2>
                            {technologies.length}
                        </h2>
                    </div>

                </div>

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        ✅
                    </span>

                    <div>
                        <p>Tasks Done</p>

                        <h2>
                            {tasksDone}
                        </h2>
                    </div>

                </div>

            </div>

            <div className="development-summary-grid">

                <div className="development-summary-card">

                    <span>
                        📅
                    </span>

                    <div>
                        <p>Today</p>

                        <h3>
                            {todayHours}h
                        </h3>
                    </div>

                </div>

                <div className="development-summary-card">

                    <span>
                        📆
                    </span>

                    <div>
                        <p>This Week</p>

                        <h3>
                            {weekHours}h
                        </h3>
                    </div>

                </div>

                <div className="development-summary-card">

                    <span>
                        🎯
                    </span>

                    <div>
                        <p>42h Goal</p>

                        <h3>
                            {Math.max(
                                42 - totalHours,
                                0
                            )}h left
                        </h3>
                    </div>

                </div>

                <div className="development-summary-card">

                    <span>
                        📈
                    </span>

                    <div>
                        <p>Average Project Progress</p>

                        <h3>
                            {averageProgress}%
                        </h3>
                    </div>

                </div>

            </div>

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            42-Hour Development Goal
                        </h2>

                        <p>
                            Track your actual development
                            time toward your target.
                        </p>
                    </div>

                    <strong>
                        {developmentProgress}%
                    </strong>

                </div>

                <div className="progress-bar large-progress">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${developmentProgress}%`,
                        }}
                    ></div>

                </div>

                <p className="progress-description">
                    {totalHours} of 42 development hours
                    logged.
                </p>

            </section>

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Your Projects
                        </h2>

                        <p>
                            Track the projects you're building
                            for your portfolio.
                        </p>
                    </div>

                </div>

                <div className="development-project-filters">

                    <div className="development-search">

                        <span>
                            🔎
                        </span>

                        <input
                            type="text"
                            value={projectSearch}
                            onChange={(e) =>
                                setProjectSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search projects..."
                        />

                    </div>

                    <select
                        value={projectStatusFilter}
                        onChange={(e) =>
                            setProjectStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Statuses
                        </option>

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

                {projects.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            💻
                        </div>

                        <h3>
                            No projects yet
                        </h3>

                        <p>
                            Add your first project and start
                            tracking your development work.
                        </p>

                        <button
                            className="add-button"
                            onClick={() => {
                                setEditingProject(null);
                                setShowForm(true);
                            }}
                        >
                            + Add Your First Project
                        </button>

                    </div>

                ) : filteredProjects.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🔎
                        </div>

                        <h3>
                            No matching projects
                        </h3>

                        <p>
                            Try changing your search or
                            status filter.
                        </p>

                    </div>

                ) : (

                    <div className="development-project-list">

                        {filteredProjects.map(
                            (project) => {

                                const projectTasks =
                                    tasks.filter(
                                        (task) =>
                                            task.projectId ===
                                            project.id
                                    );

                                const completedTasks =
                                    projectTasks.filter(
                                        (task) =>
                                            task.status ===
                                            "Completed"
                                    ).length;

                                const projectHours =
                                    activities
                                        .filter(
                                            (activity) =>
                                                activity.projectId ===
                                                project.id
                                        )
                                        .reduce(
                                            (total, activity) =>
                                                total +
                                                Number(
                                                    activity.hours || 0
                                                ),
                                            0
                                        );

                                return (
                                    <div
                                        className="development-project-card"
                                        key={project.id}
                                    >

                                        <div className="development-project-main">

                                            <div className="development-project-title">

                                                <h3>
                                                    {project.name}
                                                </h3>

                                                <span
                                                    className={`status-badge status-${project.status
                                                        .toLowerCase()
                                                        .replace(" ", "-")}`}
                                                >
                                                    {project.status}
                                                </span>

                                            </div>

                                            {project.description && (
                                                <p>
                                                    {project.description}
                                                </p>
                                            )}

                                            {project.technologies?.length >
                                                0 && (

                                                    <div className="development-project-meta">

                                                        {project.technologies.map(
                                                            (
                                                                technology,
                                                                index
                                                            ) => (
                                                                <span
                                                                    className="tag"
                                                                    key={`${technology}-${index}`}
                                                                >
                                                                    {technology}
                                                                </span>
                                                            )
                                                        )}

                                                    </div>

                                                )}

                                            <div className="development-project-progress">

                                                <div className="project-progress-header">

                                                    <span>
                                                        Progress
                                                    </span>

                                                    <strong>
                                                        {project.progress}%
                                                    </strong>

                                                </div>

                                                <div className="progress-bar">

                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${project.progress}%`,
                                                        }}
                                                    ></div>

                                                </div>

                                            </div>

                                            <div className="development-project-info">

                                                <span>
                                                    ⏱️ {projectHours} hours
                                                </span>

                                                <span>
                                                    📋 {completedTasks}/
                                                    {projectTasks.length} tasks
                                                </span>

                                                {project.startDate && (
                                                    <span>
                                                        📅 {project.startDate}
                                                    </span>
                                                )}

                                                {project.targetDate && (
                                                    <span>
                                                        🎯 {project.targetDate}
                                                    </span>
                                                )}

                                            </div>

                                            {projectTasks.length > 0 && (

                                                <div className="development-task-list">

                                                    {projectTasks.map(
                                                        (task) => (
                                                            <div
                                                                className={`development-task ${task.status ===
                                                                        "Completed"
                                                                        ? "task-completed"
                                                                        : ""
                                                                    }`}
                                                                key={task.id}
                                                            >

                                                                <div className="task-left">

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            task.status ===
                                                                            "Completed"
                                                                        }
                                                                        onChange={() =>
                                                                            toggleTaskStatus(
                                                                                task.id
                                                                            )
                                                                        }
                                                                    />

                                                                    <div>

                                                                        <strong>
                                                                            {task.title}
                                                                        </strong>

                                                                        <div className="task-meta">

                                                                            <span>
                                                                                {task.priority}
                                                                            </span>

                                                                            <span>
                                                                                {task.status}
                                                                            </span>

                                                                            {task.dueDate && (
                                                                                <span>
                                                                                    Due:{" "}
                                                                                    {
                                                                                        task.dueDate
                                                                                    }
                                                                                </span>
                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                                <button
                                                                    className="task-delete"
                                                                    onClick={() =>
                                                                        deleteTask(
                                                                            task.id
                                                                        )
                                                                    }
                                                                >
                                                                    ×
                                                                </button>

                                                            </div>
                                                        )
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                        <div className="development-project-actions">

                                            <button
                                                className="table-action"
                                                onClick={() => {
                                                    setSelectedProject(
                                                        project
                                                    );
                                                    setShowTaskForm(
                                                        true
                                                    );
                                                }}
                                            >
                                                + Task
                                            </button>

                                            <button
                                                className="table-action"
                                                onClick={() => {
                                                    setSelectedProject(
                                                        project
                                                    );
                                                    setShowActivityForm(
                                                        true
                                                    );
                                                }}
                                            >
                                                + Hours
                                            </button>

                                            {project.githubUrl && (
                                                <a
                                                    href={
                                                        project.githubUrl
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="table-action"
                                                >
                                                    GitHub
                                                </a>
                                            )}

                                            {project.liveUrl && (
                                                <a
                                                    href={
                                                        project.liveUrl
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="table-action"
                                                >
                                                    Live
                                                </a>
                                            )}

                                            <button
                                                className="table-action"
                                                onClick={() =>
                                                    handleEdit(project)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="table-action delete-action"
                                                onClick={() =>
                                                    handleDelete(
                                                        project.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

            </section>

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Recent Development Activity
                        </h2>

                        <p>
                            Your logged development sessions.
                        </p>
                    </div>

                    <div className="activity-filter">

                        <label>
                            Project
                        </label>

                        <select
                            value={activityFilter}
                            onChange={(e) =>
                                setActivityFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="All">
                                All Projects
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

                </div>

                {sortedActivities.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ⏱️
                        </div>

                        <h3>
                            No development activity
                        </h3>

                        <p>
                            Log your development sessions
                            to see them here.
                        </p>

                    </div>

                ) : (

                    <div className="development-activity-list">

                        {sortedActivities.map(
                            (activity) => {

                                const project =
                                    projects.find(
                                        (item) =>
                                            item.id ===
                                            activity.projectId
                                    );

                                return (
                                    <div
                                        className="development-activity-card"
                                        key={activity.id}
                                    >

                                        <div className="activity-date">
                                            <strong>
                                                {activity.date}
                                            </strong>
                                        </div>

                                        <div className="activity-main">

                                            <h3>
                                                {activity.title}
                                            </h3>

                                            <p>
                                                {project?.name ||
                                                    "Unknown Project"}
                                            </p>

                                            {activity.description && (
                                                <span>
                                                    {activity.description}
                                                </span>
                                            )}

                                        </div>

                                        <div className="activity-hours">
                                            {activity.hours}h
                                        </div>

                                        <button
                                            className="task-delete"
                                            onClick={() =>
                                                deleteActivity(
                                                    activity.id
                                                )
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

            </section>

            {showForm && (
                <DevelopmentForm
                    project={editingProject}
                    onSave={handleSaveProject}
                    onClose={handleCloseForm}
                />
            )}

            {showTaskForm && selectedProject && (
                <DevelopmentTaskForm
                    project={selectedProject}
                    onSave={handleSaveTask}
                    onClose={() => {
                        setShowTaskForm(false);
                        setSelectedProject(null);
                    }}
                />
            )}

            {showActivityForm && (
                <DevelopmentActivityForm
                    projects={projects}
                    selectedProject={selectedProject}
                    onSave={handleSaveActivity}
                    onClose={() => {
                        setShowActivityForm(false);
                        setSelectedProject(null);
                    }}
                />
            )}

        </div>
    );
}

export default Development;