"use client";

type MatchupStoryProps = {
    headline: string | null;
    winner: string | null;
    loser: string | null;
    winnerScore: number | null;
    loserScore: number | null;
    bodyHtml: string | null;
};

export function MatchupStory({
    headline,
    winner,
    loser,
    winnerScore,
    loserScore,
    bodyHtml,
}: MatchupStoryProps) {
    return (
        <details className="structured-matchup-story">
            <summary className="matchup-story-summary">
                {headline && (
                    <h4>{headline}</h4>
                )}

                <div className="structured-scoreline">
                    <strong className="matchup-team matchup-team-winner">
                        {winner || "Winner"}
                    </strong>

                    <span className="matchup-score">
                        {winnerScore ?? "—"}
                    </span>

                    <span className="matchup-score-dash">
                        -
                    </span>

                    <span className="matchup-score">
                        {loserScore ?? "—"}
                    </span>

                    <strong className="matchup-team matchup-team-loser">
                        {loser || "Loser"}
                    </strong>
                </div>

                <span className="matchup-expand-label">
                    Read Matchup
                </span>
            </summary>

            <div className="matchup-expanded-story">
                <div
                    className="story-body"
                    dangerouslySetInnerHTML={{
                        __html:
                            bodyHtml ||
                            "<p>This matchup recap remains unwritten.</p>",
                    }}
                />
            </div>
        </details>
    );
}