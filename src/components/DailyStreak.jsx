import { useMemo } from "react";

const getDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const formatShortDate = (dateKey) => {
    return parseDateKey(dateKey).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
};

const getPreviousDateKey = (dateKey) => {
    const date = parseDateKey(dateKey);
    date.setDate(date.getDate() - 1);
    return getDateKey(date);
};

const getLastSevenDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 6; i >= 0; i -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(getDateKey(date));
    }

    return dates;
};

const readStorage = (key, fallback = []) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};

function DailyStreak() {
    const streakData = useMemo(() => {
        const applications = readStorage("jobsprint-applications", []);
        const dsaProblems = readStorage("jobsprint-dsa", []);
        const developmentActivities = readStorage(
            "jobsprint-development-activities",
            []
        );
        const settings = readStorage("jobsprint-settings", {});

        const applicationTarget = Math.max(
            0,
            Number(settings.dailyApplications || 0)
        );

        const dsaTarget = Math.max(
            0,
            Number(settings.dailyDsa || 0)
        );

        const developmentTarget = Math.max(
            0,
            Number(settings.dailyDevelopmentHours || 0)
        );

        const targets = {
            applications: applicationTarget,
            dsa: dsaTarget,
            development: developmentTarget,
        };

        const activeTargets = Object.values(targets).filter(
            (target) => target > 0
        );

        const isDayComplete = (dateKey) => {
            if (activeTargets.length === 0) {
                return false;
            }

            const applicationsDone = applications.filter(
                (application) =>
                    application.dateApplied === dateKey
            ).length;

            const dsaDone = dsaProblems.filter(
                (problem) =>
                    problem.status === "Solved" &&
                    problem.dateSolved === dateKey
            ).length;

            const developmentHours = developmentActivities
                .filter((activity) => activity.date === dateKey)
                .reduce(
                    (total, activity) =>
                        total + Number(activity.hours || 0),
                    0
                );

            return (
                (applicationTarget === 0 ||
                    applicationsDone >= applicationTarget) &&
                (dsaTarget === 0 ||
                    dsaDone >= dsaTarget) &&
                (developmentTarget === 0 ||
                    developmentHours >= developmentTarget)
            );
        };

        const getDayData = (dateKey) => {
            const applicationsDone = applications.filter(
                (application) =>
                    application.dateApplied === dateKey
            ).length;

            const dsaDone = dsaProblems.filter(
                (problem) =>
                    problem.status === "Solved" &&
                    problem.dateSolved === dateKey
            ).length;

            const developmentHours = developmentActivities
                .filter((activity) => activity.date === dateKey)
                .reduce(
                    (total, activity) =>
                        total + Number(activity.hours || 0),
                    0
                );

            return {
                applications: applicationsDone,
                dsa: dsaDone,
                development: developmentHours,
                complete: isDayComplete(dateKey),
            };
        };

        const today = getDateKey();
        const todayData = getDayData(today);

        let currentStreak = 0;
        let cursor = today;

        while (isDayComplete(cursor)) {
            currentStreak += 1;
            cursor = getPreviousDateKey(cursor);
        }

        const activityDates = [
            ...applications.map((application) => application.dateApplied),
            ...dsaProblems.map((problem) => problem.dateSolved),
            ...developmentActivities.map((activity) => activity.date),
        ].filter(Boolean);

        let bestStreak = 0;

        if (activityDates.length > 0) {
            const uniqueDates = [...new Set(activityDates)].sort();
            const firstDate = parseDateKey(uniqueDates[0]);
            const lastDate = new Date();

            let runningStreak = 0;
            const cursorDate = new Date(firstDate);

            while (cursorDate <= lastDate) {
                const dateKey = getDateKey(cursorDate);

                if (isDayComplete(dateKey)) {
                    runningStreak += 1;
                    bestStreak = Math.max(
                        bestStreak,
                        runningStreak
                    );
                } else {
                    runningStreak = 0;
                }

                cursorDate.setDate(
                    cursorDate.getDate() + 1
                );
            }
        }

        const lastSevenDays = getLastSevenDates().map(
            (dateKey) => ({
                dateKey,
                data: getDayData(dateKey),
            })
        );

        const completedTargets = [
            applicationTarget === 0 ||
            todayData.applications >= applicationTarget,
            dsaTarget === 0 ||
            todayData.dsa >= dsaTarget,
            developmentTarget === 0 ||
            todayData.development >= developmentTarget,
        ].filter(Boolean).length;

        return {
            targets,
            activeTargetCount: activeTargets.length,
            currentStreak,
            bestStreak,
            todayData,
            completedTargets,
            lastSevenDays,
        };
    }, []);

    const progress = streakData.activeTargetCount > 0
        ? Math.round(
            (streakData.completedTargets /
                streakData.activeTargetCount) *
            100
        )
        : 0;

    const getProgressText = () => {
        if (streakData.activeTargetCount === 0) {
            return "Set at least one daily target in Settings.";
        }

        if (streakData.todayData.complete) {
            return "All active targets completed today. Streak secured!";
        }

        return `${streakData.completedTargets}/${streakData.activeTargetCount} daily targets completed.`;
    };

    return (
        <div
            style={{
                marginTop: "24px",
                background:
                    "linear-gradient(135deg, #111820 0%, #0d1420 100%)",
                border: "1px solid #232e3b",
                borderRadius: "16px",
                padding: "24px",
                boxShadow:
                    "0 4px 18px rgba(15, 23, 42, 0.05)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: "0 0 6px",
                            fontSize: "20px",
                            color: "#e6edf3",
                        }}
                    >
                        🔥 Daily Streak
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#8b98a5",
                            fontSize: "14px",
                        }}
                    >
                        Complete all active daily targets to keep your streak alive.
                    </p>
                </div>

                <div
                    style={{
                        textAlign: "right",
                    }}
                >
                    <strong
                        style={{
                            display: "block",
                            fontSize: "30px",
                            color: streakData.todayData.complete
                                ? "#f85149"
                                : "#e6edf3",
                        }}
                    >
                        {streakData.currentStreak} day
                        {streakData.currentStreak === 1 ? "" : "s"}
                    </strong>

                    <span
                        style={{
                            fontSize: "12px",
                            color: "#8b98a5",
                        }}
                    >
                        current streak
                    </span>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        border: "1px solid #232e3b",
                        borderRadius: "12px",
                        padding: "16px",
                        background: "#0d1420",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#8b98a5",
                            marginBottom: "6px",
                        }}
                    >
                        🏆 Best Streak
                    </span>

                    <strong
                        style={{
                            fontSize: "22px",
                            color: "#e6edf3",
                        }}
                    >
                        {streakData.bestStreak} day
                        {streakData.bestStreak === 1 ? "" : "s"}
                    </strong>
                </div>

                <div
                    style={{
                        border: `1px solid ${streakData.todayData.complete
                                ? "#1f4d2c"
                                : "#232e3b"
                            }`,
                        borderRadius: "12px",
                        padding: "16px",
                        background: streakData.todayData.complete
                            ? "#0f2a18"
                            : "#0d1420",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            fontSize: "12px",
                            color: streakData.todayData.complete
                                ? "#3fb950"
                                : "#8b98a5",
                            marginBottom: "6px",
                        }}
                    >
                        {streakData.todayData.complete
                            ? "✅ Today Complete"
                            : "🎯 Today's Status"}
                    </span>

                    <strong
                        style={{
                            fontSize: "22px",
                            color: streakData.todayData.complete
                                ? "#3fb950"
                                : "#e6edf3",
                        }}
                    >
                        {progress}%
                    </strong>
                </div>
            </div>

            <div
                style={{
                    height: "9px",
                    background: "#232e3b",
                    borderRadius: "999px",
                    overflow: "hidden",
                    marginBottom: "8px",
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                            streakData.todayData.complete
                                ? "linear-gradient(90deg, #3fb950, #56d364)"
                                : "linear-gradient(90deg, #f85149, #f0883e)",
                        borderRadius: "999px",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>

            <p
                style={{
                    margin: "0 0 20px",
                    color: "#8b98a5",
                    fontSize: "13px",
                }}
            >
                {getProgressText()}
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        border: "1px solid #232e3b",
                        borderRadius: "12px",
                        padding: "14px",
                        background: "#111820",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#c7d1db",
                            marginBottom: "6px",
                        }}
                    >
                        📋 Applications
                    </span>

                    <strong
                        style={{
                            fontSize: "16px",
                            color:
                                streakData.targets.applications === 0 ||
                                    streakData.todayData.applications >=
                                    streakData.targets.applications
                                    ? "#3fb950"
                                    : "#e6edf3",
                        }}
                    >
                        {streakData.todayData.applications}
                        {" / "}
                        {streakData.targets.applications || "—"}
                    </strong>
                </div>

                <div
                    style={{
                        border: "1px solid #232e3b",
                        borderRadius: "12px",
                        padding: "14px",
                        background: "#111820",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#c7d1db",
                            marginBottom: "6px",
                        }}
                    >
                        🧠 DSA
                    </span>

                    <strong
                        style={{
                            fontSize: "16px",
                            color:
                                streakData.targets.dsa === 0 ||
                                    streakData.todayData.dsa >=
                                    streakData.targets.dsa
                                    ? "#3fb950"
                                    : "#e6edf3",
                        }}
                    >
                        {streakData.todayData.dsa}
                        {" / "}
                        {streakData.targets.dsa || "—"}
                    </strong>
                </div>

                <div
                    style={{
                        border: "1px solid #232e3b",
                        borderRadius: "12px",
                        padding: "14px",
                        background: "#111820",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#c7d1db",
                            marginBottom: "6px",
                        }}
                    >
                        💻 Development
                    </span>

                    <strong
                        style={{
                            fontSize: "16px",
                            color:
                                streakData.targets.development === 0 ||
                                    streakData.todayData.development >=
                                    streakData.targets.development
                                    ? "#3fb950"
                                    : "#e6edf3",
                        }}
                    >
                        {streakData.todayData.development}
                        {"h / "}
                        {streakData.targets.development || "—"}h
                    </strong>
                </div>
            </div>

            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                    }}
                >
                    <strong
                        style={{
                            fontSize: "13px",
                            color: "#c7d1db",
                        }}
                    >
                        Last 7 Days
                    </strong>

                    <span
                        style={{
                            fontSize: "12px",
                            color: "#8b98a5",
                        }}
                    >
                        Current target rules
                    </span>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(7, minmax(0, 1fr))",
                        gap: "8px",
                    }}
                >
                    {streakData.lastSevenDays.map(
                        ({ dateKey, data }) => (
                            <div
                                key={dateKey}
                                title={`${formatShortDate(dateKey)} — ${data.complete
                                        ? "Targets complete"
                                        : "Targets incomplete"
                                    }`}
                                style={{
                                    textAlign: "center",
                                    padding: "10px 6px",
                                    borderRadius: "10px",
                                    background: data.complete
                                        ? "#163a22"
                                        : "#1b2430",
                                    border: `1px solid ${data.complete
                                            ? "#1f4d2c"
                                            : "#232e3b"
                                        }`,
                                }}
                            >
                                <span
                                    style={{
                                        display: "block",
                                        fontSize: "10px",
                                        color: "#8b98a5",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {parseDateKey(dateKey).toLocaleDateString(
                                        "en-IN",
                                        { weekday: "short" }
                                    )}
                                </span>

                                <span
                                    style={{
                                        fontSize: "18px",
                                    }}
                                >
                                    {data.complete ? "🔥" : "○"}
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default DailyStreak;
