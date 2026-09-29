import { useState } from "react";

const defaultSubjects = [
    {
        id: 1,
        name: "OOP",
        target: 15,
    },
    {
        id: 2,
        name: "DBMS",
        target: 15,
    },
    {
        id: 3,
        name: "Operating Systems",
        target: 15,
    },
    {
        id: 4,
        name: "Computer Networks",
        target: 15,
    },
    {
        id: 5,
        name: "SQL",
        target: 10,
    },
    {
        id: 6,
        name: "Computer Architecture",
        target: 8,
    },
    {
        id: 7,
        name: "Compiler Design",
        target: 10,
    },
    {
        id: 8,
        name: "System Design",
        target: 7,
    },
];

function CSFundamentals() {
    const [subjects, setSubjects] = useState(() => {
        const saved = localStorage.getItem(
            "jobsprint-cs-fundamentals"
        );

        if (saved) {
            return JSON.parse(saved);
        }

        return defaultSubjects.map((subject) => ({
            ...subject,
            completed: 0,
            revision: 0,
            needHelp: 0,
        }));
    });

    const [selectedSubject, setSelectedSubject] =
        useState("All");

    const updateSubjects = (updatedSubjects) => {
        setSubjects(updatedSubjects);

        localStorage.setItem(
            "jobsprint-cs-fundamentals",
            JSON.stringify(updatedSubjects)
        );
    };

    const updateSubject = (id, field, change) => {
        const updatedSubjects = subjects.map(
            (subject) => {
                if (subject.id !== id) {
                    return subject;
                }

                const currentValue =
                    Number(subject[field]) || 0;

                const newValue = Math.max(
                    0,
                    Math.min(
                        subject.target,
                        currentValue + change
                    )
                );

                return {
                    ...subject,
                    [field]: newValue,
                };
            }
        );

        updateSubjects(updatedSubjects);
    };

    const totalTarget = subjects.reduce(
        (total, subject) =>
            total + subject.target,
        0
    );

    const totalCompleted = subjects.reduce(
        (total, subject) =>
            total + subject.completed,
        0
    );

    const totalRevision = subjects.reduce(
        (total, subject) =>
            total + subject.revision,
        0
    );

    const totalNeedHelp = subjects.reduce(
        (total, subject) =>
            total + subject.needHelp,
        0
    );

    const overallProgress =
        totalTarget > 0
            ? Math.round(
                (totalCompleted / totalTarget) *
                100
            )
            : 0;

    const filteredSubjects =
        selectedSubject === "All"
            ? subjects
            : subjects.filter(
                (subject) =>
                    subject.name ===
                    selectedSubject
            );

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <p className="page-eyebrow">
                        Interview Preparation
                    </p>

                    <h1>
                        CS Fundamentals
                    </h1>

                    <p className="page-subtitle">
                        Build strong fundamentals for
                        technical interviews.
                    </p>
                </div>

            </div>

            <div className="dsa-stats-grid">

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        📚
                    </span>

                    <div>
                        <p>
                            Topics Completed
                        </p>

                        <h2>
                            {totalCompleted} / {totalTarget}
                        </h2>
                    </div>

                </div>

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        📈
                    </span>

                    <div>
                        <p>
                            Overall Progress
                        </p>

                        <h2>
                            {overallProgress}%
                        </h2>
                    </div>

                </div>

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        🔄
                    </span>

                    <div>
                        <p>
                            Revision
                        </p>

                        <h2>
                            {totalRevision}
                        </h2>
                    </div>

                </div>

                <div className="dsa-stat-card">

                    <span className="dsa-stat-icon">
                        ❓
                    </span>

                    <div>
                        <p>
                            Need Help
                        </p>

                        <h2>
                            {totalNeedHelp}
                        </h2>
                    </div>

                </div>

            </div>

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Overall Progress
                        </h2>

                        <p>
                            Your progress across all CS
                            fundamentals.
                        </p>

                    </div>

                    <strong>
                        {overallProgress}%
                    </strong>

                </div>

                <div className="progress-bar large-progress">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${overallProgress}%`,
                        }}
                    ></div>

                </div>

            </section>

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Subject Progress
                        </h2>

                        <p>
                            Track each subject separately.
                        </p>
                    </div>

                    <select
                        className="cs-subject-filter"
                        value={selectedSubject}
                        onChange={(e) =>
                            setSelectedSubject(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Subjects
                        </option>

                        {subjects.map((subject) => (
                            <option
                                key={subject.id}
                                value={subject.name}
                            >
                                {subject.name}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="cs-subject-grid">

                    {filteredSubjects.map(
                        (subject) => {

                            const progress =
                                subject.target > 0
                                    ? Math.round(
                                        (subject.completed /
                                            subject.target) *
                                        100
                                    )
                                    : 0;

                            return (
                                <div
                                    className="cs-subject-card"
                                    key={subject.id}
                                >

                                    <div className="cs-subject-header">

                                        <div>
                                            <h3>
                                                {subject.name}
                                            </h3>

                                            <p>
                                                {subject.completed} /{" "}
                                                {subject.target} topics
                                            </p>
                                        </div>

                                        <strong>
                                            {progress}%
                                        </strong>

                                    </div>

                                    <div className="progress-bar">

                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        ></div>

                                    </div>

                                    <div className="cs-subject-actions">

                                        <div>
                                            <span>
                                                Completed
                                            </span>

                                            <div className="counter-controls">

                                                <button
                                                    onClick={() =>
                                                        updateSubject(
                                                            subject.id,
                                                            "completed",
                                                            -1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <strong>
                                                    {subject.completed}
                                                </strong>

                                                <button
                                                    onClick={() =>
                                                        updateSubject(
                                                            subject.id,
                                                            "completed",
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </div>

                                        <div>
                                            <span>
                                                Revision
                                            </span>

                                            <div className="counter-controls">

                                                <button
                                                    onClick={() =>
                                                        updateSubject(
                                                            subject.id,
                                                            "revision",
                                                            -1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <strong>
                                                    {subject.revision}
                                                </strong>

                                                <button
                                                    onClick={() =>
                                                        updateSubject(
                                                            subject.id,
                                                            "revision",
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </div>

                                        <div>
                                            <span>
                                                Need Help
                                            </span>

                                            <div className="counter-controls">

                                                <button
                                                    onClick={() =>
                                                        updateSubject(
                                                            subject.id,
                                                            "needHelp",
                                                            -1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <strong>
                                                    {subject.needHelp}
                                                </strong>

                                                <button
                                                    onClick={() =>
                                                        updateSubject(
                                                            subject.id,
                                                            "needHelp",
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            </section>

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Interview Preparation Status
                        </h2>

                        <p>
                            Keep the most important
                            fundamentals interview-ready.
                        </p>
                    </div>

                </div>

                <div className="cs-preparation-grid">

                    <div className="cs-preparation-card">

                        <span>
                            🟢
                        </span>

                        <div>
                            <h3>
                                Strong
                            </h3>

                            <p>
                                75% or more completed
                            </p>
                        </div>

                        <strong>
                            {
                                subjects.filter(
                                    (subject) =>
                                        subject.completed /
                                        subject.target >=
                                        0.75
                                ).length
                            }
                        </strong>

                    </div>

                    <div className="cs-preparation-card">

                        <span>
                            🟡
                        </span>

                        <div>
                            <h3>
                                In Progress
                            </h3>

                            <p>
                                Between 25% and 74%
                            </p>
                        </div>

                        <strong>
                            {
                                subjects.filter(
                                    (subject) => {
                                        const progress =
                                            subject.completed /
                                            subject.target;

                                        return (
                                            progress >= 0.25 &&
                                            progress < 0.75
                                        );
                                    }
                                ).length
                            }
                        </strong>

                    </div>

                    <div className="cs-preparation-card">

                        <span>
                            🔴
                        </span>

                        <div>
                            <h3>
                                Needs Attention
                            </h3>

                            <p>
                                Below 25%
                            </p>
                        </div>

                        <strong>
                            {
                                subjects.filter(
                                    (subject) =>
                                        subject.completed /
                                        subject.target <
                                        0.25
                                ).length
                            }
                        </strong>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default CSFundamentals;