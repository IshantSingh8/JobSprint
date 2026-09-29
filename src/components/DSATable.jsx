import { useState } from "react";

function DSATable({ problems, onDelete, onEdit }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [topicFilter, setTopicFilter] = useState("All");
    const [difficultyFilter, setDifficultyFilter] =
        useState("All");
    const [statusFilter, setStatusFilter] =
        useState("All");

    const filteredProblems = problems.filter((problem) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            problem.name.toLowerCase().includes(search) ||
            problem.platform.toLowerCase().includes(search);

        const matchesTopic =
            topicFilter === "All" ||
            problem.topic === topicFilter;

        const matchesDifficulty =
            difficultyFilter === "All" ||
            problem.difficulty === difficultyFilter;

        const matchesStatus =
            statusFilter === "All" ||
            problem.status === statusFilter;

        return (
            matchesSearch &&
            matchesTopic &&
            matchesDifficulty &&
            matchesStatus
        );
    });

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this DSA problem?"
        );

        if (confirmed) {
            onDelete(id);
        }
    };

    return (
        <div className="dsa-table-container">
            {/* ================================
          FILTERS
      ================================= */}

            <div className="dsa-filter-controls">
                <div className="dsa-search-box">
                    <span>🔎</span>

                    <input
                        type="text"
                        placeholder="Search problem or platform..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                <select
                    value={topicFilter}
                    onChange={(e) =>
                        setTopicFilter(e.target.value)
                    }
                >
                    <option value="All">All Topics</option>
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Hashing">Hashing</option>
                    <option value="Two Pointers">
                        Two Pointers
                    </option>
                    <option value="Sliding Window">
                        Sliding Window
                    </option>
                    <option value="Stack">Stack</option>
                    <option value="Queue">Queue</option>
                    <option value="Linked List">
                        Linked List
                    </option>
                    <option value="Binary Search">
                        Binary Search
                    </option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Heap">Heap</option>
                    <option value="Greedy">Greedy</option>
                    <option value="Backtracking">
                        Backtracking
                    </option>
                    <option value="Dynamic Programming">
                        Dynamic Programming
                    </option>
                    <option value="Bit Manipulation">
                        Bit Manipulation
                    </option>
                    <option value="Math">Math</option>
                    <option value="Other">Other</option>
                </select>

                <select
                    value={difficultyFilter}
                    onChange={(e) =>
                        setDifficultyFilter(e.target.value)
                    }
                >
                    <option value="All">
                        All Difficulties
                    </option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="All">All Statuses</option>
                    <option value="Solved">Solved</option>
                    <option value="Revision">
                        Need Revision
                    </option>
                    <option value="Need Help">
                        Need Help
                    </option>
                    <option value="Attempted">
                        Attempted
                    </option>
                </select>
            </div>

            {/* ================================
          TABLE INFO
      ================================= */}

            <div className="dsa-table-info">
                Showing{" "}
                <strong>{filteredProblems.length}</strong>{" "}
                of <strong>{problems.length}</strong> problems
            </div>

            {/* ================================
          TABLE
      ================================= */}

            {filteredProblems.length === 0 ? (
                <div className="table-empty">
                    <div className="table-empty-icon">
                        🔎
                    </div>

                    <h3>No problems found</h3>

                    <p>
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="application-table dsa-table">
                        <thead>
                            <tr>
                                <th>Problem</th>
                                <th>Platform</th>
                                <th>Topic</th>
                                <th>Difficulty</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Problem</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProblems.map((problem) => (
                                <tr key={problem.id}>
                                    {/* Problem */}

                                    <td>
                                        <strong>{problem.name}</strong>
                                    </td>

                                    {/* Platform */}

                                    <td>{problem.platform}</td>

                                    {/* Topic */}

                                    <td>{problem.topic}</td>

                                    {/* Difficulty */}

                                    <td>
                                        <span
                                            className={`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                    </td>

                                    {/* Status */}

                                    <td>
                                        <span className="dsa-status">
                                            {problem.status}
                                        </span>
                                    </td>

                                    {/* Date */}

                                    <td>
                                        {problem.dateSolved || "—"}
                                    </td>

                                    {/* URL */}

                                    <td>
                                        {problem.url ? (
                                            <a
                                                href={problem.url}
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
                                                    onEdit(problem)
                                                }
                                                title="Edit problem"
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(problem.id)
                                                }
                                                title="Delete problem"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DSATable;