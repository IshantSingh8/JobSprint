import { useMemo, useState } from "react";

const getStoredData = (key) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

function Analytics() {
    const [refreshKey, setRefreshKey] = useState(0);

    const analytics = useMemo(() => {
        const applications = getStoredData(
            "jobsprint-applications"
        );

        const dsaProblems = getStoredData(
            "jobsprint-dsa"
        );

        const developmentActivities = getStoredData(
            "jobsprint-development-activities"
        );

        const developmentProjects = getStoredData(
            "jobsprint-development"
        );

        const csSubjects = getStoredData(
            "jobsprint-cs-fundamentals"
        );

        const totalApplications =
            applications.length;

        const applied = applications.filter(
            (item) => item.status === "Applied"
        ).length;

        const interviews = applications.filter(
            (item) =>
                item.status === "Interview" ||
                item.status === "Interview Scheduled"
        ).length;

        const offers = applications.filter(
            (item) => item.status === "Offer"
        ).length;

        const rejected = applications.filter(
            (item) => item.status === "Rejected"
        ).length;

        const dsaSolved = dsaProblems.filter(
            (item) => item.status === "Solved"
        ).length;

        const dsaTotal = dsaProblems.length;

        const dsaProgress =
            dsaTotal > 0
                ? Math.round(
                    (dsaSolved / dsaTotal) * 100
                )
                : 0;

        const totalDevelopmentHours =
            developmentActivities.reduce(
                (total, activity) =>
                    total + Number(activity.hours || 0),
                0
            );

        const completedProjects =
            developmentProjects.filter(
                (project) =>
                    project.status === "Completed"
            ).length;

        const totalProjects =
            developmentProjects.length;

        const totalTopics = csSubjects.reduce(
            (total, subject) =>
                total + Number(subject.target || 0),
            0
        );

        const completedTopics =
            csSubjects.reduce(
                (total, subject) =>
                    total +
                    Number(subject.completed || 0),
                0
            );

        const csProgress =
            totalTopics > 0
                ? Math.min(
                    Math.round(
                        (completedTopics / totalTopics) *
                        100
                    ),
                    100
                )
                : 0;

        const interviewRate =
            totalApplications > 0
                ? Math.round(
                    (interviews / totalApplications) *
                    100
                )
                : 0;

        const offerRate =
            totalApplications > 0
                ? Math.round(
                    (offers / totalApplications) * 100
                )
                : 0;

        const responseRate =
            totalApplications > 0
                ? Math.round(
                    ((interviews + offers) /
                        totalApplications) *
                    100
                )
                : 0;

        const statusData = [
            {
                label: "Applied",
                value: applied,
            },
            {
                label: "Interview",
                value: interviews,
            },
            {
                label: "Offer",
                value: offers,
            },
            {
                label: "Rejected",
                value: rejected,
            },
        ];

        const recentApplications = [
            ...applications,
        ]
            .sort((a, b) =>
                String(b.dateApplied || "").localeCompare(
                    String(a.dateApplied || "")
                )
            )
            .slice(0, 5);

        const recentDsa = [...dsaProblems]
            .filter((item) => item.status === "Solved")
            .sort((a, b) =>
                String(b.dateSolved || "").localeCompare(
                    String(a.dateSolved || "")
                )
            )
            .slice(0, 5);

        return {
            totalApplications,
            applied,
            interviews,
            offers,
            rejected,
            dsaSolved,
            dsaTotal,
            dsaProgress,
            totalDevelopmentHours,
            completedProjects,
            totalProjects,
            completedTopics,
            totalTopics,
            csProgress,
            interviewRate,
            offerRate,
            responseRate,
            statusData,
            recentApplications,
            recentDsa,
        };
    }, [refreshKey]);

    const getBarWidth = (value) => {
        if (analytics.totalApplications === 0) {
            return 0;
        }

        return Math.min(
            (value / analytics.totalApplications) *
            100,
            100
        );
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <p>
                        Understand your job preparation and
                        application progress.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={() =>
                        setRefreshKey((value) => value + 1)
                    }
                >
                    ↻ Refresh Data
                </button>
            </div>

            <div className="analytics-stat-grid">
                <div className="analytics-stat-card">
                    <span>Applications</span>
                    <strong>
                        {analytics.totalApplications}
                    </strong>
                    <small>
                        Total applications tracked
                    </small>
                </div>

                <div className="analytics-stat-card">
                    <span>DSA Solved</span>
                    <strong>
                        {analytics.dsaSolved}
                    </strong>
                    <small>
                        {analytics.dsaTotal} problems tracked
                    </small>
                </div>

                <div className="analytics-stat-card">
                    <span>Development</span>
                    <strong>
                        {analytics.totalDevelopmentHours}h
                    </strong>
                    <small>
                        Total development time
                    </small>
                </div>

                <div className="analytics-stat-card">
                    <span>CS Progress</span>
                    <strong>
                        {analytics.csProgress}%
                    </strong>
                    <small>
                        Fundamentals completed
                    </small>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Application Pipeline</h2>
                            <p>
                                Current status of your applications
                            </p>
                        </div>
                    </div>

                    <div className="analytics-status-list">
                        {analytics.statusData.map((item) => (
                            <div
                                className="analytics-status-row"
                                key={item.label}
                            >
                                <div className="analytics-status-info">
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </div>

                                <div className="analytics-bar">
                                    <div
                                        className="analytics-bar-fill"
                                        style={{
                                            width: `${getBarWidth(
                                                item.value
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Application Metrics</h2>
                            <p>
                                Based on your tracked applications
                            </p>
                        </div>
                    </div>

                    <div className="analytics-metric-list">
                        <div className="analytics-metric-row">
                            <span>Interview rate</span>
                            <strong>
                                {analytics.interviewRate}%
                            </strong>
                        </div>

                        <div className="analytics-metric-row">
                            <span>Offer rate</span>
                            <strong>
                                {analytics.offerRate}%
                            </strong>
                        </div>

                        <div className="analytics-metric-row">
                            <span>
                                Interview + offer rate
                            </span>
                            <strong>
                                {analytics.responseRate}%
                            </strong>
                        </div>

                        <div className="analytics-metric-row">
                            <span>Applications</span>
                            <strong>
                                {analytics.totalApplications}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Preparation Progress</h2>
                            <p>
                                Your technical preparation
                            </p>
                        </div>
                    </div>

                    <div className="analytics-progress-list">
                        <div className="analytics-progress-item">
                            <div className="analytics-progress-header">
                                <span>DSA</span>
                                <strong>
                                    {analytics.dsaProgress}%
                                </strong>
                            </div>

                            <div className="analytics-progress-track">
                                <div
                                    className="analytics-progress-fill"
                                    style={{
                                        width: `${analytics.dsaProgress}%`,
                                    }}
                                />
                            </div>

                            <small>
                                {analytics.dsaSolved} /{" "}
                                {analytics.dsaTotal} solved
                            </small>
                        </div>

                        <div className="analytics-progress-item">
                            <div className="analytics-progress-header">
                                <span>
                                    CS Fundamentals
                                </span>
                                <strong>
                                    {analytics.csProgress}%
                                </strong>
                            </div>

                            <div className="analytics-progress-track">
                                <div
                                    className="analytics-progress-fill"
                                    style={{
                                        width: `${analytics.csProgress}%`,
                                    }}
                                />
                            </div>

                            <small>
                                {analytics.completedTopics} /{" "}
                                {analytics.totalTopics} topics
                            </small>
                        </div>

                        <div className="analytics-progress-item">
                            <div className="analytics-progress-header">
                                <span>Development</span>
                                <strong>
                                    {analytics.completedProjects} /{" "}
                                    {analytics.totalProjects}
                                </strong>
                            </div>

                            <div className="analytics-progress-track">
                                <div
                                    className="analytics-progress-fill"
                                    style={{
                                        width:
                                            analytics.totalProjects >
                                                0
                                                ? `${(analytics.completedProjects /
                                                    analytics.totalProjects) *
                                                100
                                                }%`
                                                : "0%",
                                    }}
                                />
                            </div>

                            <small>
                                Completed projects
                            </small>
                        </div>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Development Activity</h2>
                            <p>
                                Time invested in development
                            </p>
                        </div>
                    </div>

                    <div className="analytics-big-number">
                        <strong>
                            {analytics.totalDevelopmentHours}
                        </strong>

                        <span>hours</span>
                    </div>

                    <div className="analytics-development-info">
                        <div>
                            <span>Projects</span>
                            <strong>
                                {analytics.totalProjects}
                            </strong>
                        </div>

                        <div>
                            <span>Completed</span>
                            <strong>
                                {analytics.completedProjects}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Recent Applications</h2>
                            <p>
                                Latest applications in your tracker
                            </p>
                        </div>
                    </div>

                    {analytics.recentApplications.length ===
                        0 ? (
                        <div className="analytics-empty">
                            No applications available yet.
                        </div>
                    ) : (
                        <div className="analytics-recent-list">
                            {analytics.recentApplications.map(
                                (application) => (
                                    <div
                                        className="analytics-recent-row"
                                        key={application.id}
                                    >
                                        <div>
                                            <strong>
                                                {application.company}
                                            </strong>

                                            <span>
                                                {application.role}
                                            </span>
                                        </div>

                                        <div className="analytics-recent-right">
                                            <span
                                                className={`status-badge ${String(
                                                    application.status || ""
                                                )
                                                    .toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )}`}
                                            >
                                                {application.status}
                                            </span>

                                            <small>
                                                {application.dateApplied ||
                                                    "No date"}
                                            </small>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Recent DSA</h2>
                            <p>
                                Recently solved problems
                            </p>
                        </div>
                    </div>

                    {analytics.recentDsa.length === 0 ? (
                        <div className="analytics-empty">
                            No solved DSA problems yet.
                        </div>
                    ) : (
                        <div className="analytics-recent-list">
                            {analytics.recentDsa.map((problem) => (
                                <div
                                    className="analytics-recent-row"
                                    key={problem.id}
                                >
                                    <div>
                                        <strong>
                                            {problem.name}
                                        </strong>

                                        <span>
                                            {problem.platform} •{" "}
                                            {problem.topic}
                                        </span>
                                    </div>

                                    <div className="analytics-recent-right">
                                        <span
                                            className={`difficulty-badge ${String(
                                                problem.difficulty || ""
                                            ).toLowerCase()}`}
                                        >
                                            {problem.difficulty}
                                        </span>

                                        <small>
                                            {problem.dateSolved ||
                                                "No date"}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Analytics;