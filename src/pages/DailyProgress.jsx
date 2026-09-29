import { useEffect, useMemo, useState } from "react";

const DSA_KEY = "jobsprint-dsa";
const DEVELOPMENT_ACTIVITIES_KEY = "jobsprint-development-activities";
const CS_KEY = "jobsprint-cs-fundamentals";
const APPLICATIONS_KEY = "jobsprint-applications";

const getToday = () => {
    return new Date().toISOString().split("T")[0];
};

const getStoredData = (key) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

function DailyProgress() {
    const [selectedDate, setSelectedDate] = useState(getToday());

    const [dsaProblems, setDsaProblems] = useState([]);
    const [activities, setActivities] = useState([]);
    const [csSubjects, setCsSubjects] = useState([]);
    const [applications, setApplications] = useState([]);

    const loadData = () => {
        setDsaProblems(getStoredData(DSA_KEY));
        setActivities(getStoredData(DEVELOPMENT_ACTIVITIES_KEY));
        setCsSubjects(getStoredData(CS_KEY));
        setApplications(getStoredData(APPLICATIONS_KEY));
    };

    useEffect(() => {
        loadData();
    }, []);

    const dailyData = useMemo(() => {
        const dsaToday = dsaProblems.filter(
            (problem) =>
                problem.status === "Solved" &&
                problem.dateSolved === selectedDate
        );

        const developmentToday = activities.filter(
            (activity) => activity.date === selectedDate
        );

        const applicationToday = applications.filter(
            (application) => application.dateApplied === selectedDate
        );

        const developmentHours = developmentToday.reduce(
            (total, activity) => total + Number(activity.hours || 0),
            0
        );

        const csCompleted = csSubjects.reduce(
            (total, subject) => total + Number(subject.completed || 0),
            0
        );

        const csRevision = csSubjects.reduce(
            (total, subject) => total + Number(subject.revision || 0),
            0
        );

        return {
            dsaToday,
            developmentToday,
            applicationToday,
            developmentHours,
            csCompleted,
            csRevision,
        };
    }, [
        selectedDate,
        dsaProblems,
        activities,
        csSubjects,
        applications,
    ]);

    const dsaScore = Math.min(dailyData.dsaToday.length * 20, 40);

    const developmentScore = Math.min(
        dailyData.developmentHours * 5,
        30
    );

    const applicationScore = Math.min(
        dailyData.applicationToday.length * 10,
        20
    );

    const csScore =
        dailyData.csCompleted > 0 || dailyData.csRevision > 0
            ? 10
            : 0;

    const dailyScore = Math.min(
        dsaScore +
        developmentScore +
        applicationScore +
        csScore,
        100
    );

    const getProgressMessage = () => {
        if (dailyScore >= 80) {
            return "Excellent progress! Keep the momentum going. 🔥";
        }

        if (dailyScore >= 50) {
            return "Good progress today. You're moving forward. 💪";
        }

        if (dailyScore > 0) {
            return "You've started making progress. Keep going! 🚀";
        }

        return "No activity recorded for this date yet.";
    };

    const formatDate = (date) => {
        const parsedDate = new Date(`${date}T00:00:00`);

        return parsedDate.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Daily Progress</h1>
                    <p>
                        Track everything you did toward your job goal.
                    </p>
                </div>

                <div className="page-header-actions">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) =>
                            setSelectedDate(e.target.value)
                        }
                    />

                    <button
                        className="secondary-button"
                        onClick={() => {
                            setSelectedDate(getToday());
                            loadData();
                        }}
                    >
                        Today
                    </button>
                </div>
            </div>

            <div className="daily-progress-date">
                {formatDate(selectedDate)}
            </div>

            <div className="daily-score-card">
                <div>
                    <span className="daily-score-label">
                        Daily Progress Score
                    </span>

                    <h2>{dailyScore}%</h2>

                    <p>{getProgressMessage()}</p>
                </div>

                <div className="daily-score-circle">
                    <div
                        className="daily-score-circle-inner"
                        style={{
                            background: `conic-gradient(
                #58a6ff ${dailyScore * 3.6}deg,
                #232e3b ${dailyScore * 3.6}deg
              )`,
                        }}
                    >
                        <span>{dailyScore}</span>
                    </div>
                </div>
            </div>

            <div className="daily-progress-grid">
                <div className="daily-progress-card">
                    <div className="daily-card-icon">🧠</div>

                    <div className="daily-card-content">
                        <h3>DSA</h3>

                        <strong>
                            {dailyData.dsaToday.length}
                        </strong>

                        <p>Problems solved</p>

                        {dailyData.dsaToday.length > 0 && (
                            <div className="daily-item-list">
                                {dailyData.dsaToday.map((problem) => (
                                    <div
                                        className="daily-item"
                                        key={problem.id}
                                    >
                                        <span>{problem.name}</span>
                                        <span className="status-badge completed">
                                            Solved
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="daily-progress-card">
                    <div className="daily-card-icon">💻</div>

                    <div className="daily-card-content">
                        <h3>Development</h3>

                        <strong>
                            {dailyData.developmentHours}h
                        </strong>

                        <p>Development time</p>

                        {dailyData.developmentToday.length > 0 && (
                            <div className="daily-item-list">
                                {dailyData.developmentToday.map(
                                    (activity) => (
                                        <div
                                            className="daily-item"
                                            key={activity.id}
                                        >
                                            <span>{activity.title}</span>
                                            <span>
                                                {activity.hours}h
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="daily-progress-card">
                    <div className="daily-card-icon">📚</div>

                    <div className="daily-card-content">
                        <h3>CS Fundamentals</h3>

                        <strong>
                            {dailyData.csCompleted}
                        </strong>

                        <p>Topics completed</p>

                        <div className="daily-cs-extra">
                            Revision count:{" "}
                            <strong>
                                {dailyData.csRevision}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="daily-progress-card">
                    <div className="daily-card-icon">📝</div>

                    <div className="daily-card-content">
                        <h3>Applications</h3>

                        <strong>
                            {dailyData.applicationToday.length}
                        </strong>

                        <p>Applications added</p>

                        {dailyData.applicationToday.length > 0 && (
                            <div className="daily-item-list">
                                {dailyData.applicationToday.map(
                                    (application) => (
                                        <div
                                            className="daily-item"
                                            key={application.id}
                                        >
                                            <span>
                                                {application.company}
                                            </span>

                                            <span>
                                                {application.role}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="daily-breakdown">
                <div className="section-header">
                    <div>
                        <h2>Today's Breakdown</h2>
                        <p>
                            How your daily score is calculated.
                        </p>
                    </div>
                </div>

                <div className="daily-breakdown-list">
                    <div className="daily-breakdown-row">
                        <span>🧠 DSA</span>
                        <strong>{dsaScore}/40</strong>
                    </div>

                    <div className="daily-breakdown-row">
                        <span>💻 Development</span>
                        <strong>
                            {developmentScore}/30
                        </strong>
                    </div>

                    <div className="daily-breakdown-row">
                        <span>📝 Job Applications</span>
                        <strong>
                            {applicationScore}/20
                        </strong>
                    </div>

                    <div className="daily-breakdown-row">
                        <span>📚 CS Fundamentals</span>
                        <strong>{csScore}/10</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DailyProgress;