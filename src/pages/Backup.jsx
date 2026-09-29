import { useRef, useState } from "react";

const STORAGE_KEYS = {
    applications: "jobsprint-applications",
    dsa: "jobsprint-dsa",
    development: "jobsprint-development",
    developmentTasks: "jobsprint-development-tasks",
    developmentActivities:
        "jobsprint-development-activities",
    csFundamentals: "jobsprint-cs-fundamentals",
    salaryOffers: "jobsprint-salary-offers",
};

const getStorageData = (key) => {
    try {
        const saved = localStorage.getItem(key);

        if (!saved) {
            return [];
        }

        return JSON.parse(saved);
    } catch {
        return [];
    }
};

function Backup() {
    const fileInputRef = useRef(null);

    const [message, setMessage] = useState("");

    const getBackupData = () => {
        return {
            appName: "JobSprint",
            version: "1.0",
            exportedAt: new Date().toISOString(),

            data: {
                applications: getStorageData(
                    STORAGE_KEYS.applications
                ),

                dsa: getStorageData(
                    STORAGE_KEYS.dsa
                ),

                development: getStorageData(
                    STORAGE_KEYS.development
                ),

                developmentTasks: getStorageData(
                    STORAGE_KEYS.developmentTasks
                ),

                developmentActivities:
                    getStorageData(
                        STORAGE_KEYS.developmentActivities
                    ),

                csFundamentals: getStorageData(
                    STORAGE_KEYS.csFundamentals
                ),

                salaryOffers: getStorageData(
                    STORAGE_KEYS.salaryOffers
                ),
            },
        };
    };

    const exportBackup = () => {
        try {
            const backup = getBackupData();

            const json = JSON.stringify(
                backup,
                null,
                2
            );

            const blob = new Blob([json], {
                type: "application/json",
            });

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            const date = new Date()
                .toISOString()
                .split("T")[0];

            link.href = url;

            link.download = `jobsprint-backup-${date}.json`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            setMessage(
                "Backup exported successfully."
            );
        } catch {
            setMessage(
                "Something went wrong while exporting the backup."
            );
        }
    };

    const importBackup = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const confirmed = window.confirm(
            "Importing a backup will replace your current JobSprint data. Continue?"
        );

        if (!confirmed) {
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = (loadEvent) => {
            try {
                const backup = JSON.parse(
                    loadEvent.target.result
                );

                if (
                    !backup ||
                    backup.appName !== "JobSprint" ||
                    !backup.data
                ) {
                    throw new Error(
                        "Invalid backup file"
                    );
                }

                const data = backup.data;

                localStorage.setItem(
                    STORAGE_KEYS.applications,
                    JSON.stringify(
                        Array.isArray(data.applications)
                            ? data.applications
                            : []
                    )
                );

                localStorage.setItem(
                    STORAGE_KEYS.dsa,
                    JSON.stringify(
                        Array.isArray(data.dsa)
                            ? data.dsa
                            : []
                    )
                );

                localStorage.setItem(
                    STORAGE_KEYS.development,
                    JSON.stringify(
                        Array.isArray(
                            data.development
                        )
                            ? data.development
                            : []
                    )
                );

                localStorage.setItem(
                    STORAGE_KEYS.developmentTasks,
                    JSON.stringify(
                        Array.isArray(
                            data.developmentTasks
                        )
                            ? data.developmentTasks
                            : []
                    )
                );

                localStorage.setItem(
                    STORAGE_KEYS.developmentActivities,
                    JSON.stringify(
                        Array.isArray(
                            data.developmentActivities
                        )
                            ? data.developmentActivities
                            : []
                    )
                );

                localStorage.setItem(
                    STORAGE_KEYS.csFundamentals,
                    JSON.stringify(
                        Array.isArray(
                            data.csFundamentals
                        )
                            ? data.csFundamentals
                            : []
                    )
                );

                localStorage.setItem(
                    STORAGE_KEYS.salaryOffers,
                    JSON.stringify(
                        Array.isArray(
                            data.salaryOffers
                        )
                            ? data.salaryOffers
                            : []
                    )
                );

                setMessage(
                    "Backup imported successfully. Refreshing JobSprint..."
                );

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch {
                setMessage(
                    "Invalid JobSprint backup file."
                );
            }
        };

        reader.onerror = () => {
            setMessage(
                "Unable to read the backup file."
            );
        };

        reader.readAsText(file);

        event.target.value = "";
    };

    const backup = getBackupData();

    const counts = {
        applications:
            backup.data.applications.length,

        dsa: backup.data.dsa.length,

        development:
            backup.data.development.length,

        developmentTasks:
            backup.data.developmentTasks.length,

        developmentActivities:
            backup.data.developmentActivities
                .length,

        csFundamentals:
            backup.data.csFundamentals.length,

        salaryOffers:
            backup.data.salaryOffers.length,
    };

    const totalRecords =
        counts.applications +
        counts.dsa +
        counts.development +
        counts.developmentTasks +
        counts.developmentActivities +
        counts.csFundamentals +
        counts.salaryOffers;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Backup & Data</h1>

                    <p>
                        Export your JobSprint data or restore
                        it from a previous backup.
                    </p>
                </div>
            </div>

            {message && (
                <div className="backup-message">
                    {message}
                </div>
            )}

            <div className="backup-grid">
                <div className="backup-card">
                    <div className="backup-icon">
                        📥
                    </div>

                    <h2>Export Backup</h2>

                    <p>
                        Download all your JobSprint data as
                        a JSON file. Keep this file somewhere
                        safe so you can restore your data
                        later.
                    </p>

                    <button
                        className="primary-button"
                        onClick={exportBackup}
                    >
                        Download Backup
                    </button>
                </div>

                <div className="backup-card">
                    <div className="backup-icon">
                        📤
                    </div>

                    <h2>Import Backup</h2>

                    <p>
                        Restore your applications, DSA,
                        development, CS fundamentals and
                        salary data from a previous backup.
                    </p>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                    >
                        Choose Backup File
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,application/json"
                        onChange={importBackup}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            <div className="backup-card backup-summary">
                <div className="backup-summary-header">
                    <div>
                        <h2>Current Data</h2>

                        <p>
                            Records currently stored in your
                            browser.
                        </p>
                    </div>

                    <strong>
                        {totalRecords} records
                    </strong>
                </div>

                <div className="backup-count-grid">
                    <div>
                        <span>Applications</span>
                        <strong>
                            {counts.applications}
                        </strong>
                    </div>

                    <div>
                        <span>DSA Problems</span>
                        <strong>{counts.dsa}</strong>
                    </div>

                    <div>
                        <span>Development Projects</span>
                        <strong>
                            {counts.development}
                        </strong>
                    </div>

                    <div>
                        <span>Development Tasks</span>
                        <strong>
                            {counts.developmentTasks}
                        </strong>
                    </div>

                    <div>
                        <span>Development Activities</span>
                        <strong>
                            {counts.developmentActivities}
                        </strong>
                    </div>

                    <div>
                        <span>CS Subjects</span>
                        <strong>
                            {counts.csFundamentals}
                        </strong>
                    </div>

                    <div>
                        <span>Salary Records</span>
                        <strong>
                            {counts.salaryOffers}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="backup-warning">
                <strong>⚠️ Important</strong>

                <p>
                    Your JobSprint data is currently stored
                    in your browser's local storage. Clearing
                    browser data can remove it. Export a
                    backup regularly.
                </p>
            </div>
        </div>
    );
}

export default Backup;