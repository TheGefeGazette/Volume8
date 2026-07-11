import Link from "next/link";
import { Masthead } from "@/components/masthead";
import { MatchupCard } from "@/components/matchup-card";
import { demoMatchups, latestEdition } from "@/lib/demo-data";

export default async function EditionPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="edition-page">
      <Link href="/" className="back-link">
        ← Fold the paper
      </Link>

      <article className="edition-sheet">
        <Masthead />

        <header className="lead-header">
          <p className="section-kicker">The Week in Fake Football</p>
          <h2>
            {slug === latestEdition.slug
              ? latestEdition.title
              : "The Gefe Gazette"}
          </h2>
          <p>{latestEdition.subtitle}</p>
        </header>

        <div className="article-layout">
          <div className="article-column">
            <section className="story-section">
              <h3>Welcome!</h3>
              <p className="dropcap">
                Welcome back, Gefes. The sleep-deprived staff here at The Gefe
                Gazette has once again mistaken surviving the deadline for
                professional competence.
              </p>
              <div
                className="gif-placeholder"
                role="img"
                aria-label="GIF placeholder"
              >
                GIF punchline goes here
              </div>
            </section>

            <section className="story-section">
              <h3>Bonehead Benching of the Week</h3>
              <p>
                The academy reviewed the evidence, ignored several conflicts of
                interest, and reached a unanimous decision before the money fire
                went out.
              </p>

              <div className="award-box">
                <span>BBW</span>
                <strong>Chuck</strong>
                <small>For services to the opposing lineup</small>
              </div>
            </section>

            <section className="story-section">
              <h3>Matchup Recap</h3>
              <div className="matchup-list">
                {demoMatchups.map((matchup) => (
                  <MatchupCard key={matchup.id} matchup={matchup} />
                ))}
              </div>
            </section>
          </div>

          <aside className="edition-sidebar">
            <div className="staff-note">
              <span>Today&apos;s Newsroom</span>
              <p>
                The over-caffeinated C.H.U.D.s survived another deadline with
                only minor structural damage.
              </p>
              <small>Optional prototype module</small>
            </div>

            <div className="optional-module">
              <span>Optional Newspaper Detail</span>
              <h4>Corrections</h4>
              <p>
                Last week&apos;s paper suggested someone had learned a lesson.
                We regret the error.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
