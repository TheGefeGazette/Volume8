import type { Matchup } from "@/types/content";

export function MatchupCard({ matchup }: { matchup: Matchup }) {
  return (
    <article className="matchup-card">
      <p className="section-kicker">Matchup Recap</p>
      <h3>{matchup.headline}</h3>

      <div
        className="scoreline"
        aria-label={`${matchup.winner} defeated ${matchup.loser}`}
      >
        <div>
          <strong>{matchup.winner}</strong>
          <span>Winner</span>
        </div>
        <b>{matchup.winnerScore.toFixed(2)}</b>
        <span className="score-dash">—</span>
        <b>{matchup.loserScore.toFixed(2)}</b>
        <div>
          <strong>{matchup.loser}</strong>
          <span>Loser</span>
        </div>
      </div>

      <p>{matchup.story}</p>
    </article>
  );
}
