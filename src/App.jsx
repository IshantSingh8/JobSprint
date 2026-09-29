import { useEffect, useMemo, useState } from "react";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationTable from "./components/ApplicationTable";
import DSATracker from "./pages/DSATracker";
import Development from "./pages/Development";
import CSFundamentals from "./pages/CSFundamentals";
import DailyProgress from "./pages/DailyProgress";
import Analytics from "./pages/Analytics";
import SalaryOffers from "./pages/SalaryOffers";
import Backup from "./pages/Backup";
import Settings from "./pages/Settings";
import DailyStreak from "./components/DailyStreak";
import ApplicationIntelligence from "./components/ApplicationIntelligence";
import "./App.css";
import "./DashboardPolish.css";

function App() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem(
      "jobsprint-applications"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [dsaProblems] = useState(() => {
    const saved = localStorage.getItem(
      "jobsprint-dsa"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [showApplicationForm, setShowApplicationForm] =
    useState(false);

  const [editingApplication, setEditingApplication] =
    useState(null);

  // Refresh dashboard time-based values automatically.
  // This keeps the deadline countdown current without requiring a page refresh.
  const [dashboardClock, setDashboardClock] = useState(() => Date.now());

  useEffect(() => {
    const updateClock = () => setDashboardClock(Date.now());

    // Update regularly so the countdown also reacts if the deadline is
    // changed in Settings while the dashboard is open.
    const interval = window.setInterval(updateClock, 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  const dashboardData = useMemo(() => {
    const developmentActivities = (() => {
      try {
        const saved = localStorage.getItem(
          "jobsprint-development-activities"
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const developmentProjects = (() => {
      try {
        const saved = localStorage.getItem(
          "jobsprint-development"
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const csSubjects = (() => {
      try {
        const saved = localStorage.getItem(
          "jobsprint-cs-fundamentals"
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const salaryOffers = (() => {
      try {
        const saved = localStorage.getItem(
          "jobsprint-salary-offers"
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const settings = (() => {
      try {
        const saved = localStorage.getItem(
          "jobsprint-settings"
        );

        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    })();

    const today = new Date().toLocaleDateString("en-CA");

    /*
     * =========================
     * DSA
     * =========================
     */

    const dsaSolved =
      dsaProblems.filter(
        (problem) =>
          problem.status === "Solved"
      ).length;

    const todayDsa =
      dsaProblems.filter(
        (problem) =>
          problem.status === "Solved" &&
          problem.dateSolved === today
      ).length;

    /*
     * =========================
     * DEVELOPMENT
     * =========================
     */

    const todayDevelopmentHours =
      developmentActivities
        .filter(
          (activity) =>
            activity.date === today
        )
        .reduce(
          (total, activity) =>
            total +
            Number(activity.hours || 0),
          0
        );

    const totalDevelopmentHours =
      developmentActivities.reduce(
        (total, activity) =>
          total +
          Number(activity.hours || 0),
        0
      );

    /*
     * =========================
     * PROJECTS
     * =========================
     */

    const completedProjects =
      developmentProjects.filter(
        (project) =>
          project.status === "Completed"
      ).length;

    /*
     * =========================
     * CS FUNDAMENTALS
     * =========================
     */

    const completedTopics =
      csSubjects.reduce(
        (total, subject) =>
          total +
          Number(subject.completed || 0),
        0
      );

    const totalTopics =
      csSubjects.reduce(
        (total, subject) =>
          total +
          Number(subject.target || 0),
        0
      );

    const csProgress =
      totalTopics > 0
        ? Math.min(
          Math.round(
            (completedTopics /
              totalTopics) *
            100
          ),
          100
        )
        : 0;

    /*
     * =========================
     * OFFERS
     * =========================
     */

    const offersReceived =
      salaryOffers.filter(
        (offer) =>
          offer.status ===
          "Offer Received"
      ).length;

    const acceptedOffers =
      salaryOffers.filter(
        (offer) =>
          offer.status === "Accepted"
      ).length;

    /*
     * =========================
     * DEADLINE
     * =========================
     */

    let daysRemaining = null;

    if (settings.deadline) {
      // Compare calendar dates, not hours/minutes.
      // Example: Sep 29 → Nov 8 = 40 days remaining.
      const deadline = new Date(
        `${settings.deadline}T00:00:00`
      );

      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const difference =
        deadline.getTime() -
        todayStart.getTime();

      daysRemaining = Math.max(
        0,
        Math.ceil(
          difference /
          (1000 * 60 * 60 * 24)
        )
      );
    }

    /*
     * =========================
     * FOLLOW-UPS
     * =========================
     */

    const overdueFollowUps =
      applications.filter(
        (application) =>
          application.followUpDate &&
          application.followUpDate < today &&
          application.status !==
          "Rejected" &&
          application.status !==
          "Selected"
      );

    const todayFollowUps =
      applications.filter(
        (application) =>
          application.followUpDate ===
          today &&
          application.status !==
          "Rejected" &&
          application.status !==
          "Selected"
      );

    const upcomingFollowUps =
      applications
        .filter(
          (application) =>
            application.followUpDate &&
            application.followUpDate >
            today &&
            application.status !==
            "Rejected" &&
            application.status !==
            "Selected"
        )
        .sort((a, b) =>
          a.followUpDate.localeCompare(
            b.followUpDate
          )
        );

    const followUpApplications = [
      ...overdueFollowUps,
      ...todayFollowUps,
      ...upcomingFollowUps,
    ];

    /*
     * =========================
     * APPLICATIONS TODAY
     * =========================
     */

    const todayApplications =
      applications.filter(
        (application) =>
          application.dateApplied ===
          today
      ).length;

    /*
     * =========================
     * DAILY TARGETS
     * =========================
     */

    const applicationTarget =
      Math.max(
        0,
        Number(
          settings.dailyApplications ||
          0
        )
      );

    const dsaTarget =
      Math.max(
        0,
        Number(
          settings.dailyDsa || 0
        )
      );

    const developmentTarget =
      Math.max(
        0,
        Number(
          settings.dailyDevelopmentHours ||
          0
        )
      );

    const applicationProgress =
      applicationTarget > 0
        ? Math.min(
          Math.round(
            (todayApplications /
              applicationTarget) *
            100
          ),
          100
        )
        : 0;

    const dsaProgress =
      dsaTarget > 0
        ? Math.min(
          Math.round(
            (todayDsa /
              dsaTarget) *
            100
          ),
          100
        )
        : 0;

    const developmentProgress =
      developmentTarget > 0
        ? Math.min(
          Math.round(
            (todayDevelopmentHours /
              developmentTarget) *
            100
          ),
          100
        )
        : 0;

    const activeTargets = [
      applicationTarget > 0
        ? applicationProgress
        : null,
      dsaTarget > 0
        ? dsaProgress
        : null,
      developmentTarget > 0
        ? developmentProgress
        : null,
    ].filter(
      (value) => value !== null
    );

    const dailyOverallProgress =
      activeTargets.length > 0
        ? Math.round(
          activeTargets.reduce(
            (total, value) =>
              total + value,
            0
          ) /
          activeTargets.length
        )
        : 0;

    return {
      developmentActivities,
      developmentProjects,
      csSubjects,
      salaryOffers,
      settings,

      dsaSolved,
      todayDsa,

      todayDevelopmentHours,
      totalDevelopmentHours,

      completedProjects,

      completedTopics,
      totalTopics,
      csProgress,

      offersReceived,
      acceptedOffers,

      daysRemaining,

      overdueFollowUps,
      todayFollowUps,
      upcomingFollowUps,
      followUpApplications,

      todayApplications,

      applicationTarget,
      dsaTarget,
      developmentTarget,

      applicationProgress,
      dsaProgress,
      developmentProgress,
      dailyOverallProgress,
    };
  }, [dsaProblems, applications, dashboardClock]);

  /*
   * =========================
   * APPLICATION FUNCTIONS
   * =========================
   */

  const saveApplications = (
    updatedApplications
  ) => {
    setApplications(
      updatedApplications
    );

    localStorage.setItem(
      "jobsprint-applications",
      JSON.stringify(
        updatedApplications
      )
    );
  };

  const handleAddApplication = (
    application
  ) => {
    const newApplication = {
      ...application,
      id: Date.now(),
    };

    saveApplications([
      ...applications,
      newApplication,
    ]);

    setShowApplicationForm(false);
  };

  const handleEditApplication = (
    application
  ) => {
    setEditingApplication(
      application
    );

    setShowApplicationForm(true);
  };

  const handleUpdateApplication = (
    updatedApplication
  ) => {
    const updatedApplications =
      applications.map(
        (application) =>
          application.id ===
            updatedApplication.id
            ? updatedApplication
            : application
      );

    saveApplications(
      updatedApplications
    );

    setEditingApplication(null);
    setShowApplicationForm(false);
  };

  const handleDeleteApplication = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this application?"
      );

    if (!confirmed) {
      return;
    }

    const updatedApplications =
      applications.filter(
        (application) =>
          application.id !== id
      );

    saveApplications(
      updatedApplications
    );
  };

  const handleCloseApplicationForm =
    () => {
      setShowApplicationForm(false);
      setEditingApplication(null);
    };

  /*
   * =========================
   * APPLICATION STATS
   * =========================
   */

  const totalApplications =
    applications.length;

  const appliedApplications =
    applications.filter(
      (application) =>
        application.status ===
        "Applied"
    ).length;

  const interviewApplications =
    applications.filter(
      (application) =>
        application.status ===
        "Interview" ||
        application.status ===
        "Interview Scheduled"
    ).length;

  const offerApplications =
    applications.filter(
      (application) =>
        application.status ===
        "Offer"
    ).length;

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status ===
        "Rejected"
    ).length;

  /*
   * =========================
   * NAVIGATION
   * =========================
   */

  const goTo = (page) => {
    setCurrentPage(page);
  };

  const openApplicationFromFollowUp =
    (application) => {
      goTo("applications");

      setEditingApplication(
        application
      );

      setShowApplicationForm(true);
    };

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 20L30 32L18 44" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="34" y="40" width="14" height="6" rx="3" fill="currentColor" />
            </svg>
          </div>

          <div>
            <h2>
              JobSprint <span className="logo-pulse" title="Live"></span>
            </h2>

            <span>
              Career Command Center
            </span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <button
            className={`nav-item ${currentPage ===
              "dashboard"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo("dashboard")
            }
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${currentPage ===
              "applications"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo("applications")
            }
          >
            <span>📋</span>
            Applications
          </button>

          <button
            className={`nav-item ${currentPage === "dsa"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo("dsa")
            }
          >
            <span>🧠</span>
            DSA Tracker
          </button>

          <button
            className={`nav-item ${currentPage ===
              "development"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo("development")
            }
          >
            <span>💻</span>
            Development
          </button>

          <button
            className={`nav-item ${currentPage ===
              "cs-fundamentals"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo(
                "cs-fundamentals"
              )
            }
          >
            <span>📚</span>
            CS Fundamentals
          </button>

          <button
            className={`nav-item ${currentPage ===
              "daily-progress"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo(
                "daily-progress"
              )
            }
          >
            <span>📅</span>
            Daily Progress
          </button>

          <button
            className={`nav-item ${currentPage ===
              "analytics"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo("analytics")
            }
          >
            <span>📊</span>
            Analytics
          </button>

          <button
            className={`nav-item ${currentPage ===
              "salary-offers"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo(
                "salary-offers"
              )
            }
          >
            <span>💰</span>
            Salary & Offers
          </button>

          <button
            className={`nav-item ${currentPage ===
              "backup"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo("backup")
            }
          >
            <span>💾</span>
            Backup & Data
          </button>

          <button
            className={`nav-item ${currentPage ===
              "settings"
              ? "active"
              : ""
              }`}
            onClick={() =>
              goTo("settings")
            }
          >
            <span>⚙️</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="deadline-card">

            <span>
              🎯 Target
            </span>

            <strong>
              ₹
              {dashboardData
                .settings
                .targetSalary ||
                "5"}
              + LPA
            </strong>

            <small>
              Deadline:{" "}
              {dashboardData
                .settings
                .deadline ||
                "08 Nov 2026"}
            </small>

          </div>

        </div>

      </aside>

      <main className="main-content">

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        {currentPage ===
          "dashboard" && (

            <div className="dashboard-page">

              {/* Header */}

              <div className="page-header">

                <div>

                  <h1>
                    Good evening, Ishant 👋
                  </h1>

                  <p>
                    Here's your current
                    job-hunt overview.
                  </p>

                </div>

                <button
                  className="primary-button"
                  onClick={() => {

                    goTo(
                      "applications"
                    );

                    setEditingApplication(
                      null
                    );

                    setShowApplicationForm(
                      true
                    );

                  }}
                >
                  + Add Application
                </button>

              </div>

              {/* Goal Banner */}

              <div className="dashboard-goal-banner">

                <div>

                  <span>
                    🎯 Current Goal
                  </span>

                  <h2>
                    Get a ₹
                    {dashboardData
                      .settings
                      .targetSalary ||
                      "5"}
                    + LPA opportunity
                  </h2>

                  <p>
                    Keep building skills,
                    solving DSA and applying
                    consistently.
                  </p>

                </div>

                <div className="dashboard-deadline">

                  <strong>
                    {dashboardData
                      .daysRemaining ??
                      "—"}
                  </strong>

                  <span>
                    days remaining
                  </span>

                </div>

              </div>

              {/* Main Stats */}

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">
                    📋
                  </div>

                  <div>

                    <span>
                      Applications
                    </span>

                    <strong>
                      {totalApplications}
                    </strong>

                    <small>
                      {
                        appliedApplications
                      }{" "}
                      currently applied
                    </small>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    🎤
                  </div>

                  <div>

                    <span>
                      Interviews
                    </span>

                    <strong>
                      {
                        interviewApplications
                      }
                    </strong>

                    <small>
                      Interview stage
                    </small>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    🧠
                  </div>

                  <div>

                    <span>
                      DSA Solved
                    </span>

                    <strong>
                      {
                        dashboardData
                          .dsaSolved
                      }
                    </strong>

                    <small>
                      {
                        dashboardData
                          .todayDsa
                      }{" "}
                      solved today
                    </small>

                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    💻
                  </div>

                  <div>

                    <span>
                      Dev Hours
                    </span>

                    <strong>
                      {
                        dashboardData
                          .totalDevelopmentHours
                      }
                      h
                    </strong>

                    <small>
                      {
                        dashboardData
                          .todayDevelopmentHours
                      }
                      h today
                    </small>

                  </div>

                </div>

              </div>

              {/* ==================================================
                DAILY TARGET SYSTEM
            ================================================== */}

              <div
                style={{
                  marginTop:
                    "24px",
                  background:
                    "#111820",
                  border:
                    "1px solid #232e3b",
                  borderRadius:
                    "16px",
                  padding:
                    "24px",
                  boxShadow:
                    "0 4px 18px rgba(15, 23, 42, 0.05)",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap:
                      "16px",
                    flexWrap:
                      "wrap",
                    marginBottom:
                      "20px",
                  }}
                >

                  <div>

                    <h2
                      style={{
                        margin:
                          "0 0 6px",
                        fontSize:
                          "20px",
                        color:
                          "#e6edf3",
                      }}
                    >
                      🎯 Today's Targets
                    </h2>

                    <p
                      style={{
                        margin:
                          0,
                        color:
                          "#8b98a5",
                        fontSize:
                          "14px",
                      }}
                    >
                      Your daily job-preparation
                      targets from Settings.
                    </p>

                  </div>

                  <div
                    style={{
                      textAlign:
                        "right",
                    }}
                  >

                    <strong
                      style={{
                        display:
                          "block",
                        fontSize:
                          "28px",
                        color:
                          "#e6edf3",
                      }}
                    >
                      {
                        dashboardData
                          .dailyOverallProgress
                      }%
                    </strong>

                    <span
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#8b98a5",
                      }}
                    >
                      Overall progress
                    </span>

                  </div>

                </div>

                {/* Overall Progress */}

                <div
                  style={{
                    height:
                      "10px",
                    background:
                      "#232e3b",
                    borderRadius:
                      "999px",
                    overflow:
                      "hidden",
                    marginBottom:
                      "22px",
                  }}
                >

                  <div
                    style={{
                      width: `${dashboardData
                        .dailyOverallProgress
                        }%`,
                      height:
                        "100%",
                      background:
                        "linear-gradient(90deg, #f0b429, #a371f7)",
                      borderRadius:
                        "999px",
                      transition:
                        "width 0.3s ease",
                    }}
                  />

                </div>

                {/* Target Cards */}

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap:
                      "14px",
                  }}
                >

                  {/* Applications Target */}

                  <div
                    style={{
                      border:
                        "1px solid #232e3b",
                      borderRadius:
                        "12px",
                      padding:
                        "16px",
                      background:
                        "#0d1420",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginBottom:
                          "10px",
                      }}
                    >

                      <span
                        style={{
                          fontSize:
                            "13px",
                          fontWeight:
                            "600",
                          color:
                            "#c7d1db",
                        }}
                      >
                        📋 Applications
                      </span>

                      <strong
                        style={{
                          fontSize:
                            "14px",
                          color:
                            dashboardData
                              .applicationProgress >=
                              100
                              ? "#3fb950"
                              : "#e6edf3",
                        }}
                      >
                        {
                          dashboardData
                            .todayApplications
                        }{" "}
                        /{" "}
                        {
                          dashboardData
                            .applicationTarget
                        }
                      </strong>

                    </div>

                    <div
                      style={{
                        height:
                          "7px",
                        background:
                          "#232e3b",
                        borderRadius:
                          "999px",
                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          width: `${dashboardData
                            .applicationProgress
                            }%`,
                          height:
                            "100%",
                          background:
                            "#58a6ff",
                          borderRadius:
                            "999px",
                        }}
                      />

                    </div>

                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "8px",
                        color:
                          "#8b98a5",
                      }}
                    >
                      {
                        dashboardData
                          .applicationProgress
                      }
                      % complete
                    </small>

                  </div>

                  {/* DSA Target */}

                  <div
                    style={{
                      border:
                        "1px solid #232e3b",
                      borderRadius:
                        "12px",
                      padding:
                        "16px",
                      background:
                        "#0d1420",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginBottom:
                          "10px",
                      }}
                    >

                      <span
                        style={{
                          fontSize:
                            "13px",
                          fontWeight:
                            "600",
                          color:
                            "#c7d1db",
                        }}
                      >
                        🧠 DSA
                      </span>

                      <strong
                        style={{
                          fontSize:
                            "14px",
                          color:
                            dashboardData
                              .dsaProgress >=
                              100
                              ? "#3fb950"
                              : "#e6edf3",
                        }}
                      >
                        {
                          dashboardData
                            .todayDsa
                        }{" "}
                        /{" "}
                        {
                          dashboardData
                            .dsaTarget
                        }
                      </strong>

                    </div>

                    <div
                      style={{
                        height:
                          "7px",
                        background:
                          "#232e3b",
                        borderRadius:
                          "999px",
                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          width: `${dashboardData
                            .dsaProgress
                            }%`,
                          height:
                            "100%",
                          background:
                            "#a371f7",
                          borderRadius:
                            "999px",
                        }}
                      />

                    </div>

                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "8px",
                        color:
                          "#8b98a5",
                      }}
                    >
                      {
                        dashboardData
                          .dsaProgress
                      }
                      % complete
                    </small>

                  </div>

                  {/* Development Target */}

                  <div
                    style={{
                      border:
                        "1px solid #232e3b",
                      borderRadius:
                        "12px",
                      padding:
                        "16px",
                      background:
                        "#0d1420",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginBottom:
                          "10px",
                      }}
                    >

                      <span
                        style={{
                          fontSize:
                            "13px",
                          fontWeight:
                            "600",
                          color:
                            "#c7d1db",
                        }}
                      >
                        💻 Development
                      </span>

                      <strong
                        style={{
                          fontSize:
                            "14px",
                          color:
                            dashboardData
                              .developmentProgress >=
                              100
                              ? "#3fb950"
                              : "#e6edf3",
                        }}
                      >
                        {
                          dashboardData
                            .todayDevelopmentHours
                        }
                        h /{" "}
                        {
                          dashboardData
                            .developmentTarget
                        }
                        h
                      </strong>

                    </div>

                    <div
                      style={{
                        height:
                          "7px",
                        background:
                          "#232e3b",
                        borderRadius:
                          "999px",
                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          width: `${dashboardData
                            .developmentProgress
                            }%`,
                          height:
                            "100%",
                          background:
                            "#34d399",
                          borderRadius:
                            "999px",
                        }}
                      />

                    </div>

                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "8px",
                        color:
                          "#8b98a5",
                      }}
                    >
                      {
                        dashboardData
                          .developmentProgress
                      }
                      % complete
                    </small>

                  </div>

                </div>

                {/* Settings Link */}

                <div
                  style={{
                    marginTop:
                      "18px",
                    display:
                      "flex",
                    justifyContent:
                      "flex-end",
                  }}
                >

                  <button
                    className="dashboard-link"
                    onClick={() =>
                      goTo("settings")
                    }
                  >
                    Change Daily Targets →
                  </button>

                </div>

              </div>

              {/* ==================================================
                DAILY STREAK
            ================================================== */}

              <DailyStreak />

              {/* ==================================================
                APPLICATION INTELLIGENCE
            ================================================== */}

              <ApplicationIntelligence
                applications={applications}
              />

              {/* ==================================================
                FOLLOW-UP CENTER
            ================================================== */}

              <div
                style={{
                  marginTop:
                    "24px",
                  background:
                    "linear-gradient(135deg, #111820 0%, #0d1420 100%)",
                  border:
                    "1px solid #232e3b",
                  borderRadius:
                    "16px",
                  padding:
                    "24px",
                  boxShadow:
                    "0 4px 18px rgba(15, 23, 42, 0.05)",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap:
                      "16px",
                    marginBottom:
                      "20px",
                    flexWrap:
                      "wrap",
                  }}
                >

                  <div>

                    <h2
                      style={{
                        margin:
                          "0 0 6px",
                        fontSize:
                          "20px",
                        color:
                          "#e6edf3",
                      }}
                    >
                      🔔 Application Follow-ups
                    </h2>

                    <p
                      style={{
                        margin:
                          0,
                        color:
                          "#8b98a5",
                        fontSize:
                          "14px",
                      }}
                    >
                      Applications that need
                      your attention.
                    </p>

                  </div>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      goTo(
                        "applications"
                      )
                    }
                  >
                    View Applications →
                  </button>

                </div>

                {/* Follow-up Summary */}

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 1fr))",
                    gap:
                      "12px",
                    marginBottom:
                      "20px",
                  }}
                >

                  <div
                    style={{
                      background:
                        "#2a1414",
                      border:
                        "1px solid #5a2626",
                      borderRadius:
                        "12px",
                      padding:
                        "14px",
                    }}
                  >

                    <span
                      style={{
                        display:
                          "block",
                        fontSize:
                          "12px",
                        color:
                          "#ff7b72",
                        fontWeight:
                          "600",
                        marginBottom:
                          "5px",
                      }}
                    >
                      🔴 Overdue
                    </span>

                    <strong
                      style={{
                        fontSize:
                          "24px",
                        color:
                          "#f85149",
                      }}
                    >
                      {
                        dashboardData
                          .overdueFollowUps
                          .length
                      }
                    </strong>

                  </div>

                  <div
                    style={{
                      background:
                        "#2a2110",
                      border:
                        "1px solid #4d3c10",
                      borderRadius:
                        "12px",
                      padding:
                        "14px",
                    }}
                  >

                    <span
                      style={{
                        display:
                          "block",
                        fontSize:
                          "12px",
                        color:
                          "#d29922",
                        fontWeight:
                          "600",
                        marginBottom:
                          "5px",
                      }}
                    >
                      🟡 Due Today
                    </span>

                    <strong
                      style={{
                        fontSize:
                          "24px",
                        color:
                          "#e3b341",
                      }}
                    >
                      {
                        dashboardData
                          .todayFollowUps
                          .length
                      }
                    </strong>

                  </div>

                  <div
                    style={{
                      background:
                        "#12233a",
                      border:
                        "1px solid #1c3a5c",
                      borderRadius:
                        "12px",
                      padding:
                        "14px",
                    }}
                  >

                    <span
                      style={{
                        display:
                          "block",
                        fontSize:
                          "12px",
                        color:
                          "#58a6ff",
                        fontWeight:
                          "600",
                        marginBottom:
                          "5px",
                      }}
                    >
                      🔵 Upcoming
                    </span>

                    <strong
                      style={{
                        fontSize:
                          "24px",
                        color:
                          "#388bfd",
                      }}
                    >
                      {
                        dashboardData
                          .upcomingFollowUps
                          .length
                      }
                    </strong>

                  </div>

                </div>

                {/* Follow-up List */}

                {dashboardData
                  .followUpApplications
                  .length === 0 ? (

                  <div
                    style={{
                      padding:
                        "28px 20px",
                      textAlign:
                        "center",
                      background:
                        "#0d1420",
                      borderRadius:
                        "12px",
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          "32px",
                        marginBottom:
                          "8px",
                      }}
                    >
                      🎉
                    </div>

                    <strong
                      style={{
                        display:
                          "block",
                        color:
                          "#e6edf3",
                        marginBottom:
                          "5px",
                      }}
                    >
                      No follow-ups need attention
                    </strong>

                    <span
                      style={{
                        color:
                          "#8b98a5",
                        fontSize:
                          "13px",
                      }}
                    >
                      You're all caught up!
                    </span>

                  </div>

                ) : (

                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap:
                        "10px",
                    }}
                  >

                    {dashboardData
                      .followUpApplications
                      .slice(0, 5)
                      .map(
                        (
                          application
                        ) => {

                          const today =
                            new Date()
                              .toLocaleDateString(
                                "en-CA"
                              );

                          const isOverdue =
                            application.followUpDate <
                            today;

                          const isToday =
                            application.followUpDate ===
                            today;

                          const badgeBackground =
                            isOverdue
                              ? "#3a1a1a"
                              : isToday
                                ? "#3a2c10"
                                : "#13253d";

                          const badgeColor =
                            isOverdue
                              ? "#ff7b72"
                              : isToday
                                ? "#e3b341"
                                : "#388bfd";

                          const statusText =
                            isOverdue
                              ? "Overdue"
                              : isToday
                                ? "Due Today"
                                : "Upcoming";

                          return (
                            <div
                              key={
                                application.id
                              }
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "space-between",
                                gap:
                                  "16px",
                                padding:
                                  "14px 16px",
                                border:
                                  "1px solid #232e3b",
                                borderRadius:
                                  "12px",
                                background:
                                  "#111820",
                              }}
                            >

                              <div
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  gap:
                                    "12px",
                                  minWidth:
                                    0,
                                }}
                              >

                                <div
                                  style={{
                                    width:
                                      "38px",
                                    height:
                                      "38px",
                                    borderRadius:
                                      "10px",
                                    background:
                                      "#161a3a",
                                    color:
                                      "#f0b429",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    fontWeight:
                                      "700",
                                    flexShrink:
                                      0,
                                  }}
                                >
                                  {(
                                    application.company ||
                                    "?"
                                  )
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>

                                <div
                                  style={{
                                    minWidth:
                                      0,
                                  }}
                                >

                                  <strong
                                    style={{
                                      display:
                                        "block",
                                      color:
                                        "#e6edf3",
                                      fontSize:
                                        "14px",
                                    }}
                                  >
                                    {
                                      application.company
                                    }
                                  </strong>

                                  <span
                                    style={{
                                      display:
                                        "block",
                                      color:
                                        "#8b98a5",
                                      fontSize:
                                        "13px",
                                      marginTop:
                                        "3px",
                                    }}
                                  >
                                    {
                                      application.role
                                    }
                                  </span>

                                </div>

                              </div>

                              <div
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  gap:
                                    "12px",
                                  flexShrink:
                                    0,
                                }}
                              >

                                <div
                                  style={{
                                    textAlign:
                                      "right",
                                  }}
                                >

                                  <span
                                    style={{
                                      display:
                                        "block",
                                      fontSize:
                                        "11px",
                                      color:
                                        "#6e7b87",
                                      marginBottom:
                                        "3px",
                                    }}
                                  >
                                    Follow-up
                                  </span>

                                  <strong
                                    style={{
                                      fontSize:
                                        "12px",
                                      color:
                                        "#c7d1db",
                                    }}
                                  >
                                    {
                                      application.followUpDate
                                    }
                                  </strong>

                                </div>

                                <span
                                  style={{
                                    background:
                                      badgeBackground,
                                    color:
                                      badgeColor,
                                    padding:
                                      "5px 9px",
                                    borderRadius:
                                      "999px",
                                    fontSize:
                                      "11px",
                                    fontWeight:
                                      "700",
                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {statusText}
                                </span>

                                <button
                                  className="secondary-button"
                                  onClick={() =>
                                    openApplicationFromFollowUp(
                                      application
                                    )
                                  }
                                >
                                  Open
                                </button>

                              </div>

                            </div>
                          );
                        }
                      )}

                    {dashboardData
                      .followUpApplications
                      .length > 5 && (

                        <button
                          className="dashboard-link"
                          onClick={() =>
                            goTo(
                              "applications"
                            )
                          }
                          style={{
                            marginTop:
                              "4px",
                          }}
                        >
                          View all{" "}
                          {
                            dashboardData
                              .followUpApplications
                              .length
                          }{" "}
                          follow-ups →
                        </button>

                      )}

                  </div>

                )}

              </div>

              {/* ==================================================
                PREPARATION OVERVIEW
            ================================================== */}

              <div className="dashboard-section-title">

                <div>

                  <h2>
                    Preparation Overview
                  </h2>

                  <p>
                    Your technical
                    preparation at a glance.
                  </p>

                </div>

              </div>

              <div className="dashboard-preparation-grid">

                {/* DSA */}

                <div className="dashboard-prep-card">

                  <div className="dashboard-prep-top">

                    <div className="dashboard-prep-icon">
                      🧠
                    </div>

                    <div>

                      <h3>
                        DSA
                      </h3>

                      <span>
                        {
                          dashboardData
                            .dsaSolved
                        }{" "}
                        solved
                      </span>

                    </div>

                  </div>

                  <div className="dashboard-progress">

                    <div
                      style={{
                        width: `${Math.min(
                          dashboardData
                            .dsaSolved *
                          2,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <button
                    className="dashboard-link"
                    onClick={() =>
                      goTo("dsa")
                    }
                  >
                    Open DSA →
                  </button>

                </div>

                {/* Development */}

                <div className="dashboard-prep-card">

                  <div className="dashboard-prep-top">

                    <div className="dashboard-prep-icon">
                      💻
                    </div>

                    <div>

                      <h3>
                        Development
                      </h3>

                      <span>
                        {
                          dashboardData
                            .completedProjects
                        }{" "}
                        projects completed
                      </span>

                    </div>

                  </div>

                  <div className="dashboard-progress">

                    <div
                      style={{
                        width: `${dashboardData
                          .developmentProjects
                          .length >
                          0
                          ? Math.round(
                            (dashboardData
                              .completedProjects /
                              dashboardData
                                .developmentProjects
                                .length) *
                            100
                          )
                          : 0
                          }%`,
                      }}
                    />

                  </div>

                  <button
                    className="dashboard-link"
                    onClick={() =>
                      goTo(
                        "development"
                      )
                    }
                  >
                    Open Development →
                  </button>

                </div>

                {/* CS */}

                <div className="dashboard-prep-card">

                  <div className="dashboard-prep-top">

                    <div className="dashboard-prep-icon">
                      📚
                    </div>

                    <div>

                      <h3>
                        CS Fundamentals
                      </h3>

                      <span>
                        {
                          dashboardData
                            .completedTopics
                        }{" "}
                        /{" "}
                        {
                          dashboardData
                            .totalTopics
                        }{" "}
                        topics
                      </span>

                    </div>

                  </div>

                  <div className="dashboard-progress">

                    <div
                      style={{
                        width: `${dashboardData.csProgress}%`,
                      }}
                    />

                  </div>

                  <button
                    className="dashboard-link"
                    onClick={() =>
                      goTo(
                        "cs-fundamentals"
                      )
                    }
                  >
                    Open CS →
                  </button>

                </div>

                {/* Offers */}

                <div className="dashboard-prep-card">

                  <div className="dashboard-prep-top">

                    <div className="dashboard-prep-icon">
                      💰
                    </div>

                    <div>

                      <h3>
                        Offers
                      </h3>

                      <span>
                        {
                          dashboardData
                            .offersReceived
                        }{" "}
                        received
                      </span>

                    </div>

                  </div>

                  <div className="dashboard-offer-number">

                    {
                      dashboardData
                        .acceptedOffers
                    }

                    <span>
                      accepted
                    </span>

                  </div>

                  <button
                    className="dashboard-link"
                    onClick={() =>
                      goTo(
                        "salary-offers"
                      )
                    }
                  >
                    View Offers →
                  </button>

                </div>

              </div>

              {/* ==================================================
                LOWER DASHBOARD
            ================================================== */}

              <div className="dashboard-grid">

                <div className="dashboard-card">

                  <div className="card-header">

                    <div>

                      <h2>
                        Job Hunt Overview
                      </h2>

                      <p>
                        Current application
                        pipeline
                      </p>

                    </div>

                    <button
                      className="secondary-button"
                      onClick={() =>
                        goTo(
                          "applications"
                        )
                      }
                    >
                      View All
                    </button>

                  </div>

                  <div className="overview-list">

                    <div className="overview-row">
                      <span>
                        Applications
                      </span>

                      <strong>
                        {
                          totalApplications
                        }
                      </strong>
                    </div>

                    <div className="overview-row">
                      <span>
                        Interviews
                      </span>

                      <strong>
                        {
                          interviewApplications
                        }
                      </strong>
                    </div>

                    <div className="overview-row">
                      <span>
                        Offers
                      </span>

                      <strong>
                        {
                          offerApplications
                        }
                      </strong>
                    </div>

                    <div className="overview-row">
                      <span>
                        Rejected
                      </span>

                      <strong>
                        {
                          rejectedApplications
                        }
                      </strong>
                    </div>

                  </div>

                </div>

                <div className="dashboard-card">

                  <div className="card-header">

                    <div>

                      <h2>
                        Today's Progress
                      </h2>

                      <p>
                        Your activity today
                      </p>

                    </div>

                  </div>

                  <div className="today-progress-list">

                    <div>
                      <span>
                        🧠 DSA
                      </span>

                      <strong>
                        {
                          dashboardData
                            .todayDsa
                        }{" "}
                        solved
                      </strong>
                    </div>

                    <div>
                      <span>
                        💻 Development
                      </span>

                      <strong>
                        {
                          dashboardData
                            .todayDevelopmentHours
                        }
                        h
                      </strong>
                    </div>

                    <div>
                      <span>
                        📝 Applications
                      </span>

                      <strong>
                        {
                          dashboardData
                            .todayApplications
                        }
                      </strong>
                    </div>

                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      goTo(
                        "daily-progress"
                      )
                    }
                  >
                    View Daily Progress
                  </button>

                </div>

              </div>

              {/* ==================================================
                RECENT APPLICATIONS
            ================================================== */}

              <div className="dashboard-card dashboard-recent">

                <div className="card-header">

                  <div>

                    <h2>
                      Recent Applications
                    </h2>

                    <p>
                      Your latest job
                      applications
                    </p>

                  </div>

                </div>

                {applications.length ===
                  0 ? (

                  <div className="empty-state">

                    <div>
                      📭
                    </div>

                    <h3>
                      No applications yet
                    </h3>

                    <p>
                      Start tracking your
                      job applications.
                    </p>

                    <button
                      className="primary-button"
                      onClick={() => {

                        goTo(
                          "applications"
                        );

                        setShowApplicationForm(
                          true
                        );

                      }}
                    >
                      Add Application
                    </button>

                  </div>

                ) : (

                  <div className="recent-applications">

                    {applications
                      .slice(-5)
                      .reverse()
                      .map(
                        (
                          application
                        ) => (

                          <div
                            className="recent-application"
                            key={
                              application.id
                            }
                          >

                            <div>

                              <strong>
                                {
                                  application.company
                                }
                              </strong>

                              <span>
                                {
                                  application.role
                                }
                              </span>

                            </div>

                            <span
                              className={`status-badge ${String(
                                application.status ||
                                ""
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {
                                application.status
                              }
                            </span>

                          </div>

                        )
                      )}

                  </div>

                )}

              </div>

            </div>
          )}

        {/* ==================================================
            APPLICATIONS
        ================================================== */}

        {currentPage ===
          "applications" && (

            <div className="page-container">

              <div className="page-header">

                <div>

                  <h1>
                    Applications
                  </h1>

                  <p>
                    Track and manage your
                    job applications.
                  </p>

                </div>

                <button
                  className="primary-button"
                  onClick={() => {

                    setEditingApplication(
                      null
                    );

                    setShowApplicationForm(
                      true
                    );

                  }}
                >
                  + Add Application
                </button>

              </div>

              <ApplicationTable
                applications={
                  applications
                }
                onEdit={
                  handleEditApplication
                }
                onDelete={
                  handleDeleteApplication
                }
              />

              {showApplicationForm && (

                <ApplicationForm
                  editingApplication={
                    editingApplication
                  }
                  onAdd={
                    handleAddApplication
                  }
                  onEdit={
                    handleUpdateApplication
                  }
                  onClose={
                    handleCloseApplicationForm
                  }
                />

              )}

            </div>
          )}

        {/* DSA */}

        {currentPage === "dsa" && (
          <DSATracker />
        )}

        {/* Development */}

        {currentPage ===
          "development" && (
            <Development />
          )}

        {/* CS Fundamentals */}

        {currentPage ===
          "cs-fundamentals" && (
            <CSFundamentals />
          )}

        {/* Daily Progress */}

        {currentPage ===
          "daily-progress" && (
            <DailyProgress />
          )}

        {/* Analytics */}

        {currentPage ===
          "analytics" && (
            <Analytics />
          )}

        {/* Salary & Offers */}

        {currentPage ===
          "salary-offers" && (
            <SalaryOffers />
          )}

        {/* Backup */}

        {currentPage === "backup" && (
          <Backup />
        )}

        {/* Settings */}

        {currentPage === "settings" && (
          <Settings />
        )}

      </main>
    </div>
  );
}

export default App;