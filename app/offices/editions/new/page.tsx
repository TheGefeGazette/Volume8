const sections = [
  "Welcome",
  "Chris’ Corner",
  "Bonehead Benching of the Week",
  "Matchups",
  "Closing"
];

export default function NewEditionPage() {
  return (
    <>
      <header className="office-header">
        <div>
          <p>Fresh Ink</p>
          <h1>New Edition</h1>
        </div>
        <button className="office-primary" type="button">
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
            <input defaultValue="Untitled Edition" />
          </label>
          <label>
            Subtitle
            <input placeholder="A dignified summary of this week’s indignities" />
          </label>

          <div className="editor-paper">
            <p className="eyebrow">Welcome</p>
            <h2>Welcome back, Gefes!</h2>
            <p contentEditable suppressContentEditableWarning>
              Start writing here. The AI Newsroom will suggest, never silently
              replace.
            </p>
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
  );
}
