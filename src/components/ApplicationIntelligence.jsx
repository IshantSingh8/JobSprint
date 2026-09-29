function getPercentage(value, total) {
    if (total <= 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
}

function ApplicationIntelligence({ applications }) {
    const totalApplications = applications.length;

    const interviewApplications = applications.filter(
        (application) =>
            application.status === "Interview" ||
            application.status === "Interview Scheduled"
    ).length;

    const offerApplications = applications.filter(
        (application) => application.status === "Offer"
    ).length;

    const rejectedApplications = applications.filter(
        (application) => application.status === "Rejected"
    ).length;

    const selectedApplications = applications.filter(
        (application) => application.status === "Selected"
    ).length;

    const activeApplications = applications.filter(
        (application) =>
            application.status !== "Rejected" &&
            application.status !== "Selected"
    );

    const waitingForResponse = applications.filter(
        (application) =>
            application.status === "Applied" ||
            application.status === "Application Submitted"
    ).length;

    const missingFollowUp = activeApplications.filter(
        (application) => !application.followUpDate
    ).length;

    const today = new Date().toLocaleDateString("en-CA");

    const overdueFollowUps = activeApplications.filter(
        (application) =>
            application.followUpDate &&
            application.followUpDate < today
    ).length;

    const dueToday = activeApplications.filter(
        (application) =>
            application.followUpDate === today
    ).length;

    const applicationToInterviewRate = getPercentage(
        interviewApplications,
        totalApplications
    );

    const interviewToOfferRate = getPercentage(
        offerApplications,
        interviewApplications
    );

    const overallOfferRate = getPercentage(
        offerApplications,
        totalApplications
    );

    const responseRate = getPercentage(
        totalApplications -
        waitingForResponse -
        rejectedApplications,
        totalApplications
    );

    const insights = [];

    if (totalApplications === 0) {
        insights.push({
            icon: "🚀",
            title: "Start your pipeline",
            text: "Add your first application to start generating application insights.",
            tone: "blue",
        });
    } else {
        if (missingFollowUp > 0) {
            insights.push({
                icon: "📅",
                title: "Add follow-up dates",
                text: `${missingFollowUp} active application${missingFollowUp === 1 ? "" : "s"
                    } ${missingFollowUp === 1 ? "has" : "have"
                    } no follow-up date.`,
                tone: "blue",
            });
        }

        if (overdueFollowUps > 0) {
            insights.push({
                icon: "🔴",
                title: "Follow-ups need attention",
                text: `${overdueFollowUps} active application${overdueFollowUps === 1 ? "" : "s"
                    } ${overdueFollowUps === 1 ? "is" : "are"
                    } past its follow-up date.`,
                tone: "red",
            });
        }

        if (dueToday > 0) {
            insights.push({
                icon: "🟡",
                title: "Follow up today",
                text: `${dueToday} application${dueToday === 1 ? "" : "s"
                    } ${dueToday === 1 ? "is" : "are"
                    } scheduled for today.`,
                tone: "yellow",
            });
        }

        if (waitingForResponse > 0) {
            insights.push({
                icon: "⏳",
                title: "Waiting for responses",
                text: `${waitingForResponse} application${waitingForResponse === 1 ? "" : "s"
                    } ${waitingForResponse === 1 ? "is" : "are"
                    } currently in the application stage.`,
                tone: "purple",
            });
        }

        if (
            totalApplications > 0 &&
            interviewApplications === 0
        ) {
            insights.push({
                icon: "🎤",
                title: "Build the interview pipeline",
                text: "You have applications in the pipeline but no recorded interview stage yet.",
                tone: "orange",
            });
        } else if (
            interviewApplications > 0 &&
            offerApplications === 0
        ) {
            insights.push({
                icon: "🎯",
                title: "Interview pipeline active",
                text: `${interviewApplications} application${interviewApplications === 1 ? "" : "s"
                    } ${interviewApplications === 1 ? "is" : "are"
                    } at the interview stage.`,
                tone: "green",
            });
        }

        if (insights.length < 3) {
            insights.push({
                icon: "📊",
                title: "Keep your data updated",
                text: "Update application statuses as you progress so these metrics stay useful.",
                tone: "gray",
            });
        }
    }

    const toneStyles = {
        blue: {
            background: "#12233a",
            border: "#1c3a5c",
            iconBackground: "#13253d",
        },
        red: {
            background: "#2a1414",
            border: "#5a2626",
            iconBackground: "#3a1a1a",
        },
        yellow: {
            background: "#2a2110",
            border: "#4d3c10",
            iconBackground: "#3a2c10",
        },
        purple: {
            background: "#1c1230",
            border: "#33224d",
            iconBackground: "#23163a",
        },
        orange: {
            background: "#2a1d10",
            border: "#4d3520",
            iconBackground: "#3a2818",
        },
        green: {
            background: "#0f2a18",
            border: "#1f4d2c",
            iconBackground: "#163a22",
        },
        gray: {
            background: "#0d1420",
            border: "#232e3b",
            iconBackground: "#1b2430",
        },
    };

    return (
        <div
            style={{
                marginTop: "24px",
                background: "#111820",
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
                        💡 Application Intelligence
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#8b98a5",
                            fontSize: "14px",
                        }}
                    >
                        Understand your application pipeline and identify what needs attention.
                    </p>
                </div>

                <div
                    style={{
                        padding: "7px 11px",
                        borderRadius: "999px",
                        background: "#161a3a",
                        color: "#d89a1a",
                        fontSize: "12px",
                        fontWeight: "700",
                    }}
                >
                    Data-driven
                </div>
            </div>

            {totalApplications === 0 ? (
                <div
                    style={{
                        padding: "28px 20px",
                        textAlign: "center",
                        background: "#0d1420",
                        borderRadius: "12px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "34px",
                            marginBottom: "8px",
                        }}
                    >
                        📭
                    </div>

                    <strong
                        style={{
                            display: "block",
                            color: "#e6edf3",
                            marginBottom: "5px",
                        }}
                    >
                        No application data yet
                    </strong>

                    <span
                        style={{
                            color: "#8b98a5",
                            fontSize: "13px",
                        }}
                    >
                        Add applications and update their statuses to unlock pipeline insights.
                    </span>
                </div>
            ) : (
                <>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(4, minmax(0, 1fr))",
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
                                📋 Applications
                            </span>

                            <strong
                                style={{
                                    fontSize: "24px",
                                    color: "#e6edf3",
                                }}
                            >
                                {totalApplications}
                            </strong>
                        </div>

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
                                🎤 Interview Rate
                            </span>

                            <strong
                                style={{
                                    fontSize: "24px",
                                    color: "#e6edf3",
                                }}
                            >
                                {applicationToInterviewRate}%
                            </strong>
                        </div>

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
                                🎯 Interview → Offer
                            </span>

                            <strong
                                style={{
                                    fontSize: "24px",
                                    color: "#e6edf3",
                                }}
                            >
                                {interviewToOfferRate}%
                            </strong>
                        </div>

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
                                💰 Offer Rate
                            </span>

                            <strong
                                style={{
                                    fontSize: "24px",
                                    color: "#e6edf3",
                                }}
                            >
                                {overallOfferRate}%
                            </strong>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(4, minmax(0, 1fr))",
                            gap: "10px",
                            marginBottom: "22px",
                        }}
                    >
                        <div
                            style={{
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background: "#0d1420",
                            }}
                        >
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "11px",
                                    color: "#8b98a5",
                                    marginBottom: "4px",
                                }}
                            >
                                Waiting
                            </span>
                            <strong style={{ color: "#c7d1db" }}>
                                {waitingForResponse}
                            </strong>
                        </div>

                        <div
                            style={{
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background: "#2a1414",
                            }}
                        >
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "11px",
                                    color: "#ff7b72",
                                    marginBottom: "4px",
                                }}
                            >
                                Overdue
                            </span>
                            <strong style={{ color: "#f85149" }}>
                                {overdueFollowUps}
                            </strong>
                        </div>

                        <div
                            style={{
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background: "#2a2110",
                            }}
                        >
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "11px",
                                    color: "#d29922",
                                    marginBottom: "4px",
                                }}
                            >
                                Due Today
                            </span>
                            <strong style={{ color: "#e3b341" }}>
                                {dueToday}
                            </strong>
                        </div>

                        <div
                            style={{
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background: "#0f2a18",
                            }}
                        >
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "11px",
                                    color: "#3fb950",
                                    marginBottom: "4px",
                                }}
                            >
                                Selected
                            </span>
                            <strong style={{ color: "#2ea043" }}>
                                {selectedApplications}
                            </strong>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap: "12px",
                            marginBottom: "22px",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "7px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#8b98a5",
                                    }}
                                >
                                    Applications → Interviews
                                </span>
                                <strong
                                    style={{
                                        fontSize: "12px",
                                        color: "#c7d1db",
                                    }}
                                >
                                    {interviewApplications}/{totalApplications}
                                </strong>
                            </div>

                            <div
                                style={{
                                    height: "7px",
                                    background: "#232e3b",
                                    borderRadius: "999px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${applicationToInterviewRate}%`,
                                        height: "100%",
                                        background: "#f0b429",
                                        borderRadius: "999px",
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "7px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#8b98a5",
                                    }}
                                >
                                    Interviews → Offers
                                </span>
                                <strong
                                    style={{
                                        fontSize: "12px",
                                        color: "#c7d1db",
                                    }}
                                >
                                    {offerApplications}/{interviewApplications}
                                </strong>
                            </div>

                            <div
                                style={{
                                    height: "7px",
                                    background: "#232e3b",
                                    borderRadius: "999px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${interviewToOfferRate}%`,
                                        height: "100%",
                                        background: "#34d399",
                                        borderRadius: "999px",
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "7px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#8b98a5",
                                    }}
                                >
                                    Follow-up coverage
                                </span>
                                <strong
                                    style={{
                                        fontSize: "12px",
                                        color: "#c7d1db",
                                    }}
                                >
                                    {activeApplications.length - missingFollowUp}/
                                    {activeApplications.length}
                                </strong>
                            </div>

                            <div
                                style={{
                                    height: "7px",
                                    background: "#232e3b",
                                    borderRadius: "999px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${activeApplications.length > 0
                                                ? Math.round(
                                                    ((activeApplications.length -
                                                        missingFollowUp) /
                                                        activeApplications.length) *
                                                    100
                                                )
                                                : 0
                                            }%`,
                                        height: "100%",
                                        background: "#58a6ff",
                                        borderRadius: "999px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3
                            style={{
                                margin: "0 0 12px",
                                fontSize: "15px",
                                color: "#e6edf3",
                            }}
                        >
                            What needs your attention
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "9px",
                            }}
                        >
                            {insights.slice(0, 3).map(
                                (insight, index) => {
                                    const style =
                                        toneStyles[insight.tone] ||
                                        toneStyles.gray;

                                    return (
                                        <div
                                            key={`${insight.title}-${index}`}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "12px 14px",
                                                background: style.background,
                                                border: `1px solid ${style.border}`,
                                                borderRadius: "11px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "34px",
                                                    height: "34px",
                                                    borderRadius: "9px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background:
                                                        style.iconBackground,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {insight.icon}
                                            </div>

                                            <div>
                                                <strong
                                                    style={{
                                                        display: "block",
                                                        fontSize: "13px",
                                                        color: "#e6edf3",
                                                        marginBottom: "2px",
                                                    }}
                                                >
                                                    {insight.title}
                                                </strong>

                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#8b98a5",
                                                    }}
                                                >
                                                    {insight.text}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ApplicationIntelligence;
