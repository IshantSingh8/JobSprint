import { useState } from "react";
import DSAForm from "../components/DSAForm";
import DSATable from "../components/DSATable";

function DSATracker() {
    const [problems, setProblems] = useState(() => {
        const saved = localStorage.getItem("jobsprint-dsa");

        return saved ? JSON.parse(saved) : [];
    });

    const [showForm, setShowForm] = useState(false);

    const [editingProblem, setEditingProblem] =
        useState(null);

    // =========================================
    // ADD PROBLEM
    // =========================================

    const addProblem = (problem) => {
        const updatedProblems = [
            ...problems,
            problem,
        ];

        setProblems(updatedProblems);

        localStorage.setItem(
            "jobsprint-dsa",
            JSON.stringify(updatedProblems)
        );

        setShowForm(false);
    };

    // =========================================
    // EDIT PROBLEM
    // =========================================

    const editProblem = (updatedProblem) => {
        const updatedProblems = problems.map(
            (problem) =>
                problem.id === updatedProblem.id
                    ? updatedProblem
                    : problem
        );

        setProblems(updatedProblems);

        localStorage.setItem(
            "jobsprint-dsa",
            JSON.stringify(updatedProblems)
        );

        setEditingProblem(null);
    };

    // =========================================
    // DELETE PROBLEM
    // =========================================

    const deleteProblem = (id) => {
        const updatedProblems = problems.filter(
            (problem) => problem.id !== id
        );

        setProblems(updatedProblems);

        localStorage.setItem(
            "jobsprint-dsa",
            JSON.stringify(updatedProblems)
        );
    };

    // =========================================
    // BASIC STATISTICS
    // =========================================

    const solvedProblems = problems.filter(
        (problem) => problem.status === "Solved"
    );

    const totalSolved = solvedProblems.length;

    const easyProblems = solvedProblems.filter(
        (problem) => problem.difficulty === "Easy"
    ).length;

    const mediumProblems = solvedProblems.filter(
        (problem) => problem.difficulty === "Medium"
    ).length;

    const hardProblems = solvedProblems.filter(
        (problem) => problem.difficulty === "Hard"
    ).length;

    const revisionProblems = problems.filter(
        (problem) => problem.status === "Revision"
    ).length;

    const helpProblems = problems.filter(
        (problem) => problem.status === "Need Help"
    ).length;

    const attemptedProblems = problems.filter(
        (problem) => problem.status === "Attempted"
    ).length;

    // =========================================
    // PROGRESS
    // =========================================

    const progress = Math.min(
        (totalSolved / 120) * 100,
        100
    );

    // =========================================
    // TOPIC STATISTICS
    // =========================================

    const topicNames = [
        "Arrays",
        "Strings",
        "Hashing",
        "Two Pointers",
        "Sliding Window",
        "Stack",
        "Queue",
        "Linked List",
        "Binary Search",
        "Trees",
        "Graphs",
        "Heap",
        "Greedy",
        "Backtracking",
        "Dynamic Programming",
        "Bit Manipulation",
        "Math",
    ];

    const topicCounts = topicNames.map(
        (topic) => ({
            topic,
            count: solvedProblems.filter(
                (problem) =>
                    problem.topic === topic
            ).length,
        })
    );

    return (
        <div className="page-container">

            {/* =================================
          PAGE HEADER
      ================================= */}

            <div className="page-header">
                <div>
                    <p className="page-eyebrow">
                        Preparation
                    </p>

                    <h1>DSA Tracker</h1>

                    <p className="page-subtitle">
                        Track your coding problems, topics,
                        difficulty and revision.
                    </p>
                </div>

                <button
                    className="add-button"
                    onClick={() => setShowForm(true)}
                >
                    + Add Problem
                </button>
            </div>

            {/* =================================
          STATISTICS
      ================================= */}

            <div className="dsa-stats-grid">

                <div className="dsa-stat-card">
                    <span className="dsa-stat-icon">
                        🧠
                    </span>

                    <div>
                        <p>Total Solved</p>

                        <h2>
                            {totalSolved} / 120
                        </h2>
                    </div>
                </div>

                <div className="dsa-stat-card">
                    <span className="dsa-stat-icon">
                        🟢
                    </span>

                    <div>
                        <p>Easy</p>

                        <h2>
                            {easyProblems}
                        </h2>
                    </div>
                </div>

                <div className="dsa-stat-card">
                    <span className="dsa-stat-icon">
                        🟡
                    </span>

                    <div>
                        <p>Medium</p>

                        <h2>
                            {mediumProblems}
                        </h2>
                    </div>
                </div>

                <div className="dsa-stat-card">
                    <span className="dsa-stat-icon">
                        🔴
                    </span>

                    <div>
                        <p>Hard</p>

                        <h2>
                            {hardProblems}
                        </h2>
                    </div>
                </div>

            </div>

            {/* =================================
          MAIN PROGRESS
      ================================= */}

            <section className="dashboard-section">

                <div className="section-header">
                    <div>
                        <h2>DSA Progress</h2>

                        <p>
                            Your progress toward the
                            120-problem target.
                        </p>
                    </div>

                    <strong>
                        {Math.round(progress)}%
                    </strong>
                </div>

                <div className="progress-bar large-progress">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    ></div>

                </div>

                <p className="progress-description">

                    {totalSolved === 0
                        ? "Solve your first problem to start building your DSA progress."
                        : `You've solved ${totalSolved} out of 120 problems.`}

                </p>

            </section>

            {/* =================================
          REVISION SUMMARY
      ================================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>Revision & Practice</h2>

                        <p>
                            Keep track of problems that need
                            more attention.
                        </p>
                    </div>

                </div>

                <div className="revision-grid">

                    <div className="revision-card">
                        <span>🔄</span>

                        <div>
                            <p>Need Revision</p>

                            <h3>
                                {revisionProblems}
                            </h3>
                        </div>
                    </div>

                    <div className="revision-card">
                        <span>🆘</span>

                        <div>
                            <p>Need Help</p>

                            <h3>
                                {helpProblems}
                            </h3>
                        </div>
                    </div>

                    <div className="revision-card">
                        <span>⚡</span>

                        <div>
                            <p>Attempted</p>

                            <h3>
                                {attemptedProblems}
                            </h3>
                        </div>
                    </div>

                    <div className="revision-card">
                        <span>✅</span>

                        <div>
                            <p>Solved</p>

                            <h3>
                                {totalSolved}
                            </h3>
                        </div>
                    </div>

                </div>

            </section>

            {/* =================================
          TOPIC PROGRESS
      ================================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>Topic Progress</h2>

                        <p>
                            See how many problems you've solved
                            from each DSA topic.
                        </p>
                    </div>

                </div>

                <div className="topic-grid">

                    {topicCounts.map(
                        ({ topic, count }) => (
                            <div
                                className="topic-card"
                                key={topic}
                            >

                                <div className="topic-card-header">

                                    <span>
                                        {topic}
                                    </span>

                                    <strong>
                                        {count}
                                    </strong>

                                </div>

                                <div className="topic-progress-bar">

                                    <div
                                        className="topic-progress-fill"
                                        style={{
                                            width: `${Math.min(
                                                (count / 10) *
                                                100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>

                                </div>

                                <p>
                                    {count === 0
                                        ? "Not started"
                                        : `${count} solved`}
                                </p>

                            </div>
                        )
                    )}

                </div>

            </section>

            {/* =================================
          DSA PROBLEMS
      ================================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>DSA Problems</h2>

                        <p>
                            Search, filter and manage your
                            problems.
                        </p>
                    </div>

                    <button
                        className="add-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        + Add Problem
                    </button>

                </div>

                {problems.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🧠
                        </div>

                        <h3>
                            No DSA problems yet
                        </h3>

                        <p>
                            Start adding LeetCode and other
                            coding problems to track your
                            preparation.
                        </p>

                        <button
                            className="add-button"
                            onClick={() =>
                                setShowForm(true)
                            }
                        >
                            + Add Your First Problem
                        </button>

                    </div>

                ) : (

                    <DSATable
                        problems={problems}
                        onDelete={deleteProblem}
                        onEdit={(problem) =>
                            setEditingProblem(problem)
                        }
                    />

                )}

            </section>

            {/* =================================
          ADD FORM
      ================================= */}

            {showForm && (

                <DSAForm
                    onAdd={addProblem}
                    onClose={() =>
                        setShowForm(false)
                    }
                />

            )}

            {/* =================================
          EDIT FORM
      ================================= */}

            {editingProblem && (

                <DSAForm
                    editingProblem={
                        editingProblem
                    }

                    onEdit={
                        editProblem
                    }

                    onClose={() =>
                        setEditingProblem(null)
                    }
                />

            )}

        </div>
    );
}

export default DSATracker;