"use client";

type ManagerGradeStoryProps = {
    managerName: string | null;
    teamName: string | null;
    bodyHtml: string | null;
    rosterImageUrl: string | null;
    rosterImageUrl2: string | null;
};

export function ManagerGradeStory({
    managerName,
    teamName,
    bodyHtml,
    rosterImageUrl,
    rosterImageUrl2,
}: ManagerGradeStoryProps) {
    return (
        <details className="manager-grade-story">
            <summary className="manager-grade-story-summary">
                <div>
                    <h4>{teamName || "Unnamed Team"}</h4>

                    <p className="manager-grade-team-name">
                        {managerName || "Unnamed Manager"}
                    </p>
                </div>

                <span className="manager-grade-expand-label">
                    <span className="manager-grade-arrow">▼</span>
                    Read Grade
                </span>
            </summary>

            <div className="manager-grade-expanded-story">
                <div className="manager-grade-roster">
                    <p className="eyebrow">Drafted Roster</p>

                    {rosterImageUrl || rosterImageUrl2 ? (
                        <div className="manager-grade-roster-images">
                            {rosterImageUrl && (
                                <img
                                    src={rosterImageUrl}
                                    alt={`${managerName || "Manager"} drafted roster part 1`}
                                    className="manager-grade-roster-image"
                                />
                            )}

                            {rosterImageUrl2 && (
                                <img
                                    src={rosterImageUrl2}
                                    alt={`${managerName || "Manager"} drafted roster part 2`}
                                    className="manager-grade-roster-image"
                                />
                            )}
                        </div>
                    ) : (
                        <p>
                            Yahoo roster data will appear here once league integration is available.
                        </p>
                    )}
                </div>

                <div
                    className="story-body"
                    dangerouslySetInnerHTML={{
                        __html:
                            bodyHtml ||
                            "<p>This manager grade remains unwritten.</p>",
                    }}
                />
            </div>
        </details>
    );
}