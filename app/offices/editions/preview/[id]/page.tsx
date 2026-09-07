import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Masthead } from "@/components/masthead";
import { createClient } from "@/lib/supabase/server";
import { MatchupStory } from "@/components/matchup-story";
import { ManagerGradeStory } from "@/components/manager-grade-story";

export default async function PreviewEditionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    const { data: edition, error: editionError } = await supabase
        .from("editions")
        .select(
            "id, title, subtitle, slug, status, publication_date, volume_number, issue_number, picks_tagline, edition_type"
        )
        .eq("id", id)
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

    const { data: sidebarBoxes, error: sidebarBoxesError } = await supabase
        .from("edition_sidebar_boxes")
        .select("id, title, body_html, sort_order")
        .eq("edition_id", edition.id)
        .order("sort_order", { ascending: true });

    const { data: managerGrades, error: managerGradesError } = await supabase
        .from("edition_manager_grades")
        .select(
            "id, manager_name, team_name, body_html, roster_image_url, roster_image_url_2, sort_order"
        )
        .eq("edition_id", edition.id)
        .order("sort_order", { ascending: true });

    const { data: bonehead, error: boneheadError } = await supabase
        .from("edition_boneheads")
        .select("recipient")
        .eq("edition_id", edition.id)
        .maybeSingle();

    const orderedSections = sections
        ? [
            ...sections.filter(
                (section) => section.slug !== "next-weeks-picks"
            ),
            ...sections.filter(
                (section) => section.slug === "next-weeks-picks"
            ),
        ]
        : [];

    const formattedPublicationDate = edition.publication_date
        ? new Date(`${edition.publication_date}T00:00:00`).toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        )
        : undefined;

    const isDraftGradesEdition =
        edition.edition_type === "draft_grades";

    const draftWelcomeSection = sections?.find(
        (section) => section.slug === "draft-welcome"
    );

    const draftClosingSection = sections?.find(
        (section) => section.slug === "closing"
    );

    return (
        <main className="edition-page preview-edition-page">
            <div className="preview-banner">
                <strong>DRAFT PREVIEW — NOT PUBLISHED</strong>

                <Link href={`/offices/editions/new?edition=${edition.id}`}>
                    Return to Editor
                </Link>
            </div>

            <article className="edition-sheet">
                <Masthead
                    volume={edition.volume_number ?? undefined}
                    issue={edition.issue_number ?? undefined}
                    date={formattedPublicationDate}
                />

                <header className="lead-header">
                    <p className="section-kicker">The Week in Fake Football</p>
                    <h2>{edition.title}</h2>

                    {edition.subtitle && <p>{edition.subtitle}</p>}
                </header>

                <div className="preview-story-layout">
                    {isDraftGradesEdition && (
                        <>
                            <div className="preview-opening-layout">
                                <section className="story-section preview-welcome-story">
                                    {!sidebarBoxesError &&
                                        sidebarBoxes &&
                                        sidebarBoxes.length > 0 && (
                                            <aside className="edition-sidebar">
                                                {sidebarBoxes.map((box) => (
                                                    <div
                                                        className="optional-module"
                                                        key={box.id}
                                                    >
                                                        {box.title && <h4>{box.title}</h4>}

                                                        <div
                                                            className="story-body"
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    box.body_html ||
                                                                    "<p>This newspaper box remains unwritten.</p>",
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </aside>
                                        )}

                                    <div
                                        className="story-body"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                draftWelcomeSection?.body_html ||
                                                "<p>This section remains unwritten.</p>",
                                        }}
                                    />
                                </section>
                            </div>

                            <div className="preview-full-width-stories">
                                <section className="story-section">
                                    <h3>Manager Grades</h3>

                                    {managerGradesError && (
                                        <p>
                                            We were unable to retrieve the manager grades.
                                        </p>
                                    )}

                                    {!managerGradesError &&
                                        (!managerGrades || managerGrades.length === 0) && (
                                            <p>
                                                No manager grades have been added yet.
                                            </p>
                                        )}

                                    {!managerGradesError &&
                                        managerGrades?.map((managerGrade) => (
                                            <ManagerGradeStory
                                                key={managerGrade.id}
                                                managerName={managerGrade.manager_name}
                                                teamName={managerGrade.team_name}
                                                bodyHtml={managerGrade.body_html}
                                                rosterImageUrl={managerGrade.roster_image_url}
                                                rosterImageUrl2={managerGrade.roster_image_url_2}
                                            />
                                        ))}
                                </section>

                                <section className="story-section">
                                    <h3>Draft Wrap-Up</h3>

                                    <div
                                        className="story-body"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                draftClosingSection?.body_html ||
                                                "<p>This section remains unwritten.</p>",
                                        }}
                                    />
                                </section>
                            </div>
                        </>
                    )}
                    {!isDraftGradesEdition && sectionsError && (
                        <section className="story-section">
                            <h3>Newsroom Error</h3>
                            <p>We were unable to retrieve this edition’s articles.</p>
                        </section>
                    )}

                    {!isDraftGradesEdition &&
                        !sectionsError &&
                        orderedSections.length === 0 && (
                            <section className="story-section">
                                <h3>No Articles Found</h3>
                                <p>
                                    This edition currently contains no copy worth embarrassing
                                    the league with.
                                </p>
                            </section>
                        )}

                    {!isDraftGradesEdition &&
                        !sectionsError &&
                        orderedSections.length > 0 && (
                            <>
                                <div className="preview-opening-layout">
                                    <section className="story-section preview-welcome-story">

                                        {!sidebarBoxesError && sidebarBoxes && sidebarBoxes.length > 0 && (
                                            <aside className="edition-sidebar">
                                                {sidebarBoxes.map((box) => (
                                                    <div
                                                        className="optional-module"
                                                        key={box.id}
                                                    >
                                                        {box.title && <h4>{box.title}</h4>}

                                                        <div
                                                            className="story-body"
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    box.body_html ||
                                                                    "<p>This newspaper box remains unwritten.</p>",
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </aside>
                                        )}

                                        <div
                                            className="story-body"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    orderedSections[0].body_html ||
                                                    "<p>This section remains unwritten.</p>",
                                            }}
                                        />

                                        {orderedSections[0].gif_url &&
                                            !(orderedSections[0].body_html || "").includes("<img") && (
                                                <img
                                                    className="story-gif"
                                                    src={orderedSections[0].gif_url}
                                                    alt={`${orderedSections[0].title} GIF`}
                                                />
                                            )}
                                    </section>
                                </div>
                                <div className="preview-full-width-stories">
                                    {orderedSections.slice(1).map((section) => {
                                        const bodyHtml =
                                            section.body_html || "<p>This section remains unwritten.</p>";

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
                                                    <div className="structured-picks-preview gazette-sports-book">
                                                        <div className="sports-book-header">
                                                            <p className="eyebrow">The Gazette Sports Book</p>
                                                            <h4>Next Week&apos;s Picks</h4>
                                                            {edition.picks_tagline && (
                                                                <p className="sports-book-tagline">
                                                                    {edition.picks_tagline}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {picksError && (
                                                            <p>
                                                                We were unable to retrieve next week&apos;s picks.
                                                            </p>
                                                        )}

                                                        {!picksError &&
                                                            picks?.map((pick) => (
                                                                <div
                                                                    className="pick-preview-line"
                                                                    key={pick.id}
                                                                >
                                                                    <p>
                                                                        <strong>
                                                                            {pick.favorite || "Favorite"}
                                                                        </strong>{" "}
                                                                        {pick.joke_text || "does something unpleasant to"}{" "}
                                                                        <strong>
                                                                            {pick.underdog || "Underdog"}
                                                                        </strong>.
                                                                    </p>
                                                                </div>
                                                            ))}
                                                    </div>
                                                ) : section.slug === "bonehead-benching" ? (
                                                    <>
                                                        {boneheadError && (
                                                            <p>
                                                                We were unable to retrieve this week&apos;s Bonehead recipient.
                                                            </p>
                                                        )}

                                                        <div
                                                            className="story-body"
                                                            dangerouslySetInnerHTML={{
                                                                __html: bodyHtml,
                                                            }}
                                                        />

                                                        {!boneheadError && bonehead?.recipient && (
                                                            <div className="bonehead-award-ending">
                                                                <p className="bonehead-award-closing">
                                                                    So give it up, Gefes, for this week&apos;s winner —{" "}
                                                                    <strong>{bonehead.recipient}</strong>!{" "}Here&apos;s your trophy, Bonehead. You earned it.
                                                                </p>

                                                                <img
                                                                    className="bonehead-static-trophy"
                                                                    src="/bbw-trophy.jpg"
                                                                    alt="Bonehead Benching of the Week trophy"
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="story-body"
                                                            dangerouslySetInnerHTML={{
                                                                __html: bodyHtml,
                                                            }}
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
                        )
                    }
                </div >
            </article >
        </main >
    );
}