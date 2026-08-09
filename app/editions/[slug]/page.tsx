import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/masthead";
import { createClient } from "@/lib/supabase/server";
import { MatchupStory } from "@/components/matchup-story";

export default async function EditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: edition, error: editionError } = await supabase
    .from("editions")
    .select("id, title, subtitle, slug")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (editionError || !edition) {
    notFound();
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("edition_sections")
    .select("id, title, slug, body_html, gif_url, sort_order")
    .eq("edition_id", edition.id)
    .order("sort_order", { ascending: true });

  const { data: matchups, error: matchupsError } = await supabase
    .from("edition_matchups")
    .select(
      "id, winner, loser, winner_score, loser_score, headline, body_html, sort_order"
    )
    .eq("edition_id", edition.id)
    .order("sort_order", { ascending: true });

  const { data: picks, error: picksError } = await supabase
    .from("edition_picks")
    .select(
      "id, favorite, joke_text, underdog, sort_order"
    )
    .eq("edition_id", edition.id)
    .order("sort_order", { ascending: true });

  return (
    <main className="edition-page published-edition-page">
      <Link href="/" className="back-link">
        ← Fold the paper
      </Link>

      <article className="edition-sheet">
        <Masthead />

        <header className="lead-header">
          <p className="section-kicker">The Week in Fake Football</p>
          <h2>{edition.title}</h2>

          {edition.subtitle && <p>{edition.subtitle}</p>}
        </header>

        <div className="preview-story-layout">
          {sectionsError && (
            <section className="story-section">
              <h3>Newsroom Error</h3>
              <p>We were unable to retrieve this edition’s articles.</p>
            </section>
          )}

          {!sectionsError && sections?.length === 0 && (
            <section className="story-section">
              <h3>No Articles Found</h3>
              <p>
                This edition reached the presses without any copy, which is
                unfortunately consistent with newsroom standards.
              </p>
            </section>
          )}

          {!sectionsError && sections && sections.length > 0 && (
            <>
              <div className="preview-opening-layout">
                <section className="story-section preview-welcome-story">

                  <aside className="edition-sidebar">
                    <div className="staff-note">
                      <span>Today&apos;s Newsroom</span>
                      <p>
                        The over-caffeinated C.H.U.D.s survived another deadline
                        with only minor structural damage.
                      </p>
                      <small>Optional prototype module</small>
                    </div>

                    <div className="optional-module">
                      <span>Optional Newspaper Detail</span>
                      <h4>Corrections</h4>
                      <p>
                        Last week&apos;s paper suggested someone had learned a
                        lesson. We regret the error.
                      </p>
                    </div>
                  </aside>

                  <div
                    className="story-body"
                    dangerouslySetInnerHTML={{
                      __html:
                        sections[0].body_html ||
                        "<p>This section remains unwritten.</p>",
                    }}
                  />

                  {sections[0].gif_url &&
                    !(sections[0].body_html || "").includes("<img") && (
                      <img
                        className="story-gif"
                        src={sections[0].gif_url}
                        alt={`${sections[0].title} GIF`}
                      />
                    )}
                </section>
              </div>

              <div className="preview-full-width-stories">
                {sections.slice(1).map((section) => {
                  const bodyHtml =
                    section.body_html ||
                    "<p>This section remains unwritten.</p>";

                  const containsInlineImage = bodyHtml.includes("<img");

                  return (
                    <section className="story-section" key={section.id}>
                      <h3>{section.title}</h3>

                      {section.slug === "matchups" ? (
                        <div className="structured-matchups-preview">
                          {matchupsError && (
                            <p>
                              We were unable to retrieve the matchup desk records.
                            </p>
                          )}

                          {!matchupsError &&
                            (!matchups || matchups.length === 0) && (
                              <p>
                                No structured matchups have been added yet.
                              </p>
                            )}

                          {!matchupsError &&
                            matchups?.map((matchup) => (
                              <MatchupStory
                                key={matchup.id}
                                headline={matchup.headline}
                                winner={matchup.winner}
                                loser={matchup.loser}
                                winnerScore={matchup.winner_score}
                                loserScore={matchup.loser_score}
                                bodyHtml={matchup.body_html}
                              />
                            ))}
                        </div>
                      ) : section.slug === "next-weeks-picks" ? (
                        <div className="structured-picks-preview">
                          {picksError && (
                            <p>
                              We were unable to retrieve next week&apos;s picks.
                            </p>
                          )}

                          {!picksError &&
                            (!picks || picks.length === 0) && (
                              <p>
                                No picks have been added yet.
                              </p>
                            )}

                          {!picksError &&
                            picks?.map((pick) => (
                              <p
                                className="pick-preview-line"
                                key={pick.id}
                              >
                                <strong>
                                  {pick.favorite || "Favorite"}
                                </strong>{" "}
                                {pick.joke_text || "does something unpleasant to"}{" "}
                                <strong>
                                  {pick.underdog || "Underdog"}
                                </strong>.
                              </p>
                            ))}
                        </div>
                      ) : (
                        <>
                          <div
                            className="story-body"
                            dangerouslySetInnerHTML={{ __html: bodyHtml }}
                          />

                          {section.gif_url && !containsInlineImage && (
                            <img
                              className="story-gif"
                              src={section.gif_url}
                              alt={`${section.title} GIF`}
                            />
                          )}
                        </>
                      )}
                    </section>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </article>
    </main>
  );
}