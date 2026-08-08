import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Masthead } from "@/components/masthead";
import { createClient } from "@/lib/supabase/server";

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
        .select("id, title, subtitle, slug, status")
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

    return (
        <main className="edition-page">
            <div className="preview-banner">
                <strong>DRAFT PREVIEW — NOT PUBLISHED</strong>

                <Link href={`/offices/editions/new?edition=${edition.id}`}>
                    Return to Editor
                </Link>
            </div>

            <article className="edition-sheet">
                <Masthead />

                <header className="lead-header">
                    <p className="section-kicker">The Week in Fake Football</p>
                    <h2>{edition.title}</h2>

                    {edition.subtitle && <p>{edition.subtitle}</p>}
                </header>

                <div className="article-layout">
                    <div className="article-column">
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
                                    This edition currently contains no copy worth embarrassing
                                    the league with.
                                </p>
                            </section>
                        )}

                        {!sectionsError &&
                            sections?.map((section) => {
                                const bodyHtml =
                                    section.body_html || "<p>This section remains unwritten.</p>";

                                const containsInlineImage = bodyHtml.includes("<img");

                                return (
                                    <section className="story-section" key={section.id}>
                                        <h3>{section.title}</h3>

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
                                    </section>
                                );
                            })}
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