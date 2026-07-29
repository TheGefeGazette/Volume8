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
  const { edition: editionId } = await searchParams;

  let savedEdition: {
    title: string;
    subtitle: string | null;
  } | null = null;

  let savedSectionBodies: Record<string, string> = {};

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
      .select("slug, body_html")
      .eq("edition_id", editionId);

    savedSectionBodies = Object.fromEntries(
      (savedSections ?? []).map((section) => [
        section.slug,
        section.body_html ?? "",
      ])
    );
  }
  return (
    <form action={saveDraft}>
      <input type="hidden" name="editionId" value={editionId ?? ""} />
      <>
        <header className="office-header">
          <div>
            <p>Fresh Ink</p>
            <h1>New Edition</h1>
          </div>
          <button className="office-primary" type="submit">
            Save Draft
          </button>
        </header>

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

                <textarea
                  name={section.fieldName}
                  defaultValue={
                    savedSectionBodies[section.slug] || section.placeholder
                  }
                  rows={10}
                  placeholder={section.placeholder}
                />

                <button type="button">+ Add GIF punchline</button>
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
