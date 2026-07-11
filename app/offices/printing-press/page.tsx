const details = [
  "Weather",
  "Corrections",
  "Market Report",
  "Obituaries",
  "Editorial Cartoon",
  "League Ticker"
];

export default function PrintingPressPage() {
  return (
    <>
      <header className="office-header">
        <div>
          <p>Publication Controls</p>
          <h1>Printing Press</h1>
        </div>
        <button className="office-primary" type="button">
          Save Settings
        </button>
      </header>

      <section className="settings-panel">
        <h2>Permanent Identity</h2>
        <label>
          Motto
          <input defaultValue="All The Fake Football News Fit To Print" />
        </label>

        <div className="setting-preview">
          <span>Price:</span>
          <small>(your precious)</small>
          <strong>FREE!</strong>
          <small>(time)</small>
        </div>
      </section>

      <section className="settings-panel">
        <h2>Optional Newspaper Details</h2>
        <p>
          Enable only what earns its ink. Disabled modules leave no empty space.
        </p>

        <div className="toggle-grid">
          {details.map((detail) => (
            <label key={detail}>
              <input type="checkbox" />
              <span>{detail}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="settings-panel">
        <h2>Newsroom Staff Prototype</h2>
        <label className="switch-row">
          <input type="checkbox" defaultChecked />
          <span>
            <strong>Show compact Newsroom Staff module</strong>
            <small>Can also be removed from an individual edition.</small>
          </span>
        </label>
      </section>
    </>
  );
}
