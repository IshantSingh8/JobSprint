function DSAForm({
    onAdd,
    onEdit,
    onClose,
    editingProblem,
}) {
    const isEditing = Boolean(editingProblem);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const problem = {
            id: isEditing
                ? editingProblem.id
                : Date.now(),

            name: formData.get("name"),

            platform: formData.get("platform"),

            topic: formData.get("topic"),

            difficulty:
                formData.get("difficulty"),

            status: formData.get("status"),

            url: formData.get("url"),

            dateSolved:
                formData.get("dateSolved"),

            notes: formData.get("notes"),
        };

        if (isEditing) {
            onEdit(problem);
        } else {
            onAdd(problem);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="application-modal">
                {/* HEADER */}

                <div className="modal-header">
                    <div>
                        <h2>
                            {isEditing
                                ? "Edit DSA Problem"
                                : "Add DSA Problem"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update your problem details."
                                : "Track a problem you've solved or attempted."}
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

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="application-form"
                >
                    <div className="form-grid">
                        {/* Problem Name */}

                        <div className="form-group full-width">
                            <label>
                                Problem Name <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Two Sum"
                                defaultValue={
                                    editingProblem?.name || ""
                                }
                                required
                            />
                        </div>

                        {/* Platform */}

                        <div className="form-group">
                            <label>Platform</label>

                            <select
                                name="platform"
                                defaultValue={
                                    editingProblem?.platform ||
                                    "LeetCode"
                                }
                            >
                                <option value="LeetCode">
                                    LeetCode
                                </option>

                                <option value="GeeksforGeeks">
                                    GeeksforGeeks
                                </option>

                                <option value="CodeChef">
                                    CodeChef
                                </option>

                                <option value="HackerRank">
                                    HackerRank
                                </option>

                                <option value="Codeforces">
                                    Codeforces
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Topic */}

                        <div className="form-group">
                            <label>Topic</label>

                            <select
                                name="topic"
                                defaultValue={
                                    editingProblem?.topic ||
                                    "Arrays"
                                }
                            >
                                <option value="Arrays">
                                    Arrays
                                </option>

                                <option value="Strings">
                                    Strings
                                </option>

                                <option value="Hashing">
                                    Hashing
                                </option>

                                <option value="Two Pointers">
                                    Two Pointers
                                </option>

                                <option value="Sliding Window">
                                    Sliding Window
                                </option>

                                <option value="Stack">
                                    Stack
                                </option>

                                <option value="Queue">
                                    Queue
                                </option>

                                <option value="Linked List">
                                    Linked List
                                </option>

                                <option value="Binary Search">
                                    Binary Search
                                </option>

                                <option value="Trees">
                                    Trees
                                </option>

                                <option value="Graphs">
                                    Graphs
                                </option>

                                <option value="Heap">
                                    Heap
                                </option>

                                <option value="Greedy">
                                    Greedy
                                </option>

                                <option value="Backtracking">
                                    Backtracking
                                </option>

                                <option value="Dynamic Programming">
                                    Dynamic Programming
                                </option>

                                <option value="Bit Manipulation">
                                    Bit Manipulation
                                </option>

                                <option value="Math">
                                    Math
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Difficulty */}

                        <div className="form-group">
                            <label>Difficulty</label>

                            <select
                                name="difficulty"
                                defaultValue={
                                    editingProblem?.difficulty ||
                                    "Easy"
                                }
                            >
                                <option value="Easy">
                                    Easy
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Hard">
                                    Hard
                                </option>
                            </select>
                        </div>

                        {/* Status */}

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                defaultValue={
                                    editingProblem?.status ||
                                    "Solved"
                                }
                            >
                                <option value="Solved">
                                    Solved
                                </option>

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

                        {/* URL */}

                        <div className="form-group full-width">
                            <label>Problem URL</label>

                            <input
                                type="url"
                                name="url"
                                placeholder="https://leetcode.com/problems/..."
                                defaultValue={
                                    editingProblem?.url || ""
                                }
                            />
                        </div>

                        {/* Date */}

                        <div className="form-group">
                            <label>Date Solved</label>

                            <input
                                type="date"
                                name="dateSolved"
                                defaultValue={
                                    editingProblem?.dateSolved ||
                                    new Date().toLocaleDateString(
                                        "en-CA"
                                    )
                                }
                            />
                        </div>

                        {/* Notes */}

                        <div className="form-group full-width">
                            <label>Notes</label>

                            <textarea
                                name="notes"
                                rows="4"
                                placeholder="Approach, mistakes, things to revise..."
                                defaultValue={
                                    editingProblem?.notes || ""
                                }
                            ></textarea>
                        </div>
                    </div>

                    {/* FOOTER */}

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
                                : "Add Problem"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DSAForm;