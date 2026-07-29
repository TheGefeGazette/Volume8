import { createClient } from "@/lib/supabase/server";
import { saveDraft } from "./actions";
const sections = [
  "Welcome",
  "Chris’ Corner",
  "Bonehead Benching of the Week",
  "Matchups",
  "Closing"
];

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

  let savedWelcomeBody = "";

  if (editionId) {
    const supabase = await createClient();

    const { data } = await supabase
      .from("editions")
      .select("title, subtitle")
      .eq("id", editionId)
      .single();

    savedEdition = data;
    const { data: welcomeSection } = await supabase
      .from("edition_sections")
      .select("body_html")
      .eq("edition_id", editionId)
      .eq("slug", "welcome")
      .maybeSingle();

    savedWelcomeBody = welcomeSection?.body_html ?? "";
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
            {sections.map((section, index) => (
              <button key={section} type="button">
                <span>{index + 1}</span>
                {section}
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


            <div className="editor-paper">
              <p className="eyebrow">Welcome</p>
              <h2>Welcome back, Gefes!</h2>
              <textarea
                name="welcomeBody"
                defaultValue={
                  savedWelcomeBody ||
                  "Start writing here. The AI Newsroom will suggest, never silently replace."
                }
                rows={10}
              />
              <button type="button">+ Add GIF punchline</button>
            </div>
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
