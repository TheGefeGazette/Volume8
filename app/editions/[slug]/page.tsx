import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/masthead";
import { createClient } from "@/lib/supabase/server";

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
    .select("id, title, slug, body_html, sort_order")
    .eq("edition_id", edition.id)
    .order("sort_order", { ascending: true });

  return (
    <main className="edition-page">
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
                  This edition reached the presses without any copy, which is
                  unfortunately consistent with newsroom standards.
                </p>
              </section>
            )}

            {!sectionsError &&
              sections?.map((section, index) => (
                <section className="story-section" key={section.id}>
                  <h3>{section.title}</h3>

                  <p
                    className={index === 0 ? "dropcap" : undefined}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {section.body_html || "This section remains unwritten."}
                  </p>

                  <div
                    className="gif-placeholder"
                    role="img"
                    aria-label={`${section.title} GIF placeholder`}
                  >
                    GIF punchline goes here
                  </div>
                </section>
              ))}
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