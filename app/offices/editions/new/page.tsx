import Link from "next/link";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import { GifPicker } from "@/components/gif-picker";
import { editionSections } from "@/lib/gazette/edition-sections";
import { createClient } from "@/lib/supabase/server";
import { saveDraft } from "./actions";


type NewEditionPageProps = {
  searchParams: Promise<{
    edition?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function NewEditionPage({
  searchParams,
}: NewEditionPageProps) {
  const {
    edition: editionId,
    success,
    error,
  } = await searchParams;

  let savedEdition: {
    title: string;
    subtitle: string | null;
  } | null = null;

  let savedSectionBodies: Record<string, string> = {};

  let savedSectionGifUrls: Record<string, string> = {};

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
      .select("slug, body_html, gif_url")
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

        <div className="editor-shell">
          <aside className="section-list">
            <h2>Sections</h2>
            {editionSections.map((section, index) => (
              <button key={section.slug} type="button">
                <span>{index + 1}</span>
                {section.title}
              </button>
            ))}
            <button className="add-section" type="button">
              + Optional Detail
            </button>
          </aside>

          <section className="editor-canvas">
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

            {editionSections.map((section) => (
              <div className="editor-paper" key={section.slug}>
                <p className="eyebrow">{section.title}</p>
                <h2>{section.heading}</h2>

                {section.slug === "matchups" ? (
                  <textarea
                    name={section.fieldName}
                    defaultValue={savedSectionBodies[section.slug] ?? ""}
                    rows={10}
                    placeholder={section.placeholder}
                  />
                ) : (
                  <GazetteRichTextEditor
                    fieldName={section.fieldName}
                    initialContent={savedSectionBodies[section.slug] ?? ""}
                  />
                )}

                <GifPicker
                  fieldName={`gifUrl:${section.slug}`}
                  initialUrl={savedSectionGifUrls[section.slug] ?? ""}
                />
              </div>
            ))}
          </section>

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
