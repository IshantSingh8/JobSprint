import { useState } from "react";

const STORAGE_KEY = "jobsprint-settings";

const defaultSettings = {
    targetSalary: "5",
    deadline: "2026-11-08",
    preferredWorkMode: "Any",
    preferredLocation: "",
    targetRoles: "Software Engineer, SDE, Frontend Developer",
    dailyApplications: "3",
    dailyDsa: "2",
    dailyDevelopmentHours: "2",
};

const getSettings = () => {
    try {
        const saved = localStorage.getItem(
            STORAGE_KEY
        );

        return saved
            ? {
                ...defaultSettings,
                ...JSON.parse(saved),
            }
            : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

function Settings() {
    const [settings, setSettings] =
        useState(getSettings);

    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: value,
        }));

        setMessage("");
    };

    const handleSave = (event) => {
        event.preventDefault();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );

        setMessage(
            "Settings saved successfully."
        );
    };

    const handleReset = () => {
        const confirmed = window.confirm(
            "Reset all JobSprint settings to their default values?"
        );

        if (!confirmed) {
            return;
        }

        setSettings(defaultSettings);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultSettings)
        );

        setMessage(
            "Settings reset successfully."
        );
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>

                    <p>
                        Customize your JobSprint goals and
                        job-search preferences.
                    </p>
                </div>
            </div>

            {message && (
                <div className="settings-message">
                    {message}
                </div>
            )}

            <form
                className="settings-form"
                onSubmit={handleSave}
            >
                {/* =========================
            JOB TARGET
        ========================= */}

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            🎯
                        </div>

                        <div>
                            <h2>Job Target</h2>

                            <p>
                                Define what you're working
                                toward.
                            </p>
                        </div>
                    </div>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>
                                Target Salary (LPA)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                name="targetSalary"
                                value={
                                    settings.targetSalary
                                }
                                onChange={handleChange}
                                placeholder="e.g. 5"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Target Deadline
                            </label>

                            <input
                                type="date"
                                name="deadline"
                                value={settings.deadline}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group form-group-full">
                            <label>
                                Target Roles
                            </label>

                            <input
                                type="text"
                                name="targetRoles"
                                value={settings.targetRoles}
                                onChange={handleChange}
                                placeholder="e.g. SDE, Software Engineer, Frontend Developer"
                            />

                            <small className="settings-help">
                                Separate multiple roles with
                                commas.
                            </small>
                        </div>
                    </div>
                </div>

                {/* =========================
            JOB PREFERENCES
        ========================= */}

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            💼
                        </div>

                        <div>
                            <h2>Job Preferences</h2>

                            <p>
                                Keep your preferred job
                                conditions handy.
                            </p>
                        </div>
                    </div>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>
                                Preferred Work Mode
                            </label>

                            <select
                                name="preferredWorkMode"
                                value={
                                    settings.preferredWorkMode
                                }
                                onChange={handleChange}
                            >
                                <option value="Any">
                                    Any
                                </option>

                                <option value="Remote">
                                    Remote
                                </option>

                                <option value="Hybrid">
                                    Hybrid
                                </option>

                                <option value="Onsite">
                                    Onsite
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Preferred Location
                            </label>

                            <input
                                type="text"
                                name="preferredLocation"
                                value={
                                    settings.preferredLocation
                                }
                                onChange={handleChange}
                                placeholder="e.g. Delhi, Bangalore, Remote"
                            />
                        </div>
                    </div>
                </div>

                {/* =========================
            DAILY TARGETS
        ========================= */}

                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">
                            📈
                        </div>

                        <div>
                            <h2>Daily Targets</h2>

                            <p>
                                Set realistic daily actions for
                                your job hunt.
                            </p>
                        </div>
                    </div>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>
                                Applications Per Day
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="dailyApplications"
                                value={
                                    settings.dailyApplications
                                }
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                DSA Problems Per Day
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="dailyDsa"
                                value={settings.dailyDsa}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Development Hours Per Day
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                name="dailyDevelopmentHours"
                                value={
                                    settings.dailyDevelopmentHours
                                }
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* =========================
            ACTIONS
        ========================= */}

                <div className="settings-actions">
                    <button
                        type="button"
                        className="danger-button"
                        onClick={handleReset}
                    >
                        Reset Settings
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Settings;