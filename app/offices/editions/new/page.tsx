import Link from "next/link";
import { SectionEditorTabs } from "@/components/section-editor-tabs";
import { createClient } from "@/lib/supabase/server";
import { saveDraft } from "./actions";


type NewEditionPageProps = {
  searchParams: Promise<{
    edition?: string;
    success?: string;
    error?: string;
    section?: string;
  }>;
};

export default async function NewEditionPage({
  searchParams,
}: NewEditionPageProps) {
  const {
    edition: editionId,
    success,
    error,
    section: activeSection,
  } = await searchParams;

  let savedMatchups: {
    id: string;
    winner: string | null;
    loser: string | null;
    winner_score: number | null;
    loser_score: number | null;
    headline: string | null;
    body_html: string | null;
    sort_order: number | null;
  }[] = [];

  let savedPicks: {
    id: number;
    favorite: string | null;
    joke_text: string | null;
    underdog: string | null;
    sort_order: number | null;
  }[] = [];

  let savedEdition: {
    title: string;
    subtitle: string | null;
  } | null = null;

  let savedSectionBodies: Record<string, string> = {};

  let savedSectionGifUrls: Record<string, string> = {};

  let customSections: {
    title: string;
    slug: string;
    sortOrder: number;
  }[] = [];

  if (editionId) {
    const supabase = await createClient();

    const { data } = await supabase
      .from("editions")
      .select("title, subtitle")
      .eq("id", editionId)
      .single();

    savedEdition = data;

    const { data: savedSections } = await supabase
      .from("edition_sections")
      .select("slug, title, body_html, gif_url, section_type, sort_order")
      .eq("edition_id", editionId);

    savedSectionBodies = Object.fromEntries(
      (savedSections ?? []).map((section) => [
        section.slug,
        section.body_html ?? "",
      ])
    );

    savedSectionGifUrls = Object.fromEntries(
      (savedSections ?? []).map((section) => [
        section.slug,
        section.gif_url ?? "",
      ])
    );

    customSections = (savedSections ?? [])
      .filter((section) => section.section_type === "custom")
      .map((section) => ({
        title: section.title,
        slug: section.slug,
        sortOrder: section.sort_order ?? 100,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const { data: matchupData } = await supabase
      .from("edition_matchups")
      .select(
        "id, winner, loser, winner_score, loser_score, headline, body_html, sort_order"
      )
      .eq("edition_id", editionId)
      .order("sort_order", { ascending: true });

    savedMatchups = matchupData ?? [];
    const { data: picksData } = await supabase
      .from("edition_picks")
      .select(
        "id, favorite, joke_text, underdog, sort_order"
      )
      .eq("edition_id", editionId)
      .order("sort_order", { ascending: true });

    savedPicks = picksData ?? [];
  }
  return (
    <form key={editionId ?? "new"} action={saveDraft}>
      <input type="hidden" name="editionId" value={editionId ?? ""} />
      <>
        <header className="office-header">
          <div>
            <p>Fresh Ink</p>
            <h1>New Edition</h1>
          </div>
          <div className="office-header-actions">
            {editionId && (
              <Link className="office-secondary" href="/offices/editions/new">
                New Draft
              </Link>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="office-primary" type="submit">
                Save Draft
              </button>

              {editionId && (
                <Link
                  className="office-secondary"
                  href={`/offices/editions/preview/${editionId}`}
                >
                  Preview Edition
                </Link>
              )}

              <button
                className="office-primary"
                type="submit"
                name="action"
                value="publish"
              >
                Publish
              </button>
            </div>
          </div>
        </header>

        {success && (
          <div className="editor-message editor-message-success" role="status">
            <strong>
              {success === "Edition published"
                ? "Extra! Extra! The presses are rolling."
                : success}
            </strong>

            {success === "Edition published" && (
              <p>The edition was successfully published.</p>
            )}
          </div>
        )}

        {error && (
          <div className="editor-message editor-message-error" role="alert">
            <strong>Newsroom problem</strong>
            <p>{error}</p>
          </div>
        )}

        <section className="editor-canvas editor-edition-details">
          <label>
            Edition title
            <input
              name="title"
              defaultValue={savedEdition?.title ?? "Untitled Edition"}
            />
          </label>

          <label>
            Subtitle
            <input
              name="subtitle"
              defaultValue={savedEdition?.subtitle ?? ""}
              placeholder="A dignified summary of this week’s indignities"
            />
          </label>
        </section>

        <div className="editor-shell">
          <SectionEditorTabs
            savedSectionBodies={savedSectionBodies}
            savedSectionGifUrls={savedSectionGifUrls}
            initialActiveSlug={activeSection}
            editionId={editionId}
            customSections={customSections}
            savedMatchups={savedMatchups}
            savedPicks={savedPicks}
          />

          <aside className="tool-drawer">
            <h2>Newsroom Tools</h2>
            <button type="button">
              AI Newsroom <small>Assistant only</small>
            </button>
            <button type="button">
              GIF Search <small>Coming later</small>
            </button>
            <button type="button">
              Image Studio <small>Coming later</small>
            </button>

            <div className="principle">
              <strong>Rule No. 1</strong>
              <p>The AI is the newsroom assistant—not the editor-in-chief.</p>
            </div>
          </aside>
        </div>
      </>
    </form>
  );
}
