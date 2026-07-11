import Link from "next/link";

export default function OfficesPage() {
  return (
    <>
      <header className="office-header">
        <div>
          <p>Editorial Command Center</p>
          <h1>The Gazette Offices</h1>
        </div>
        <Link className="office-primary" href="/offices/editions/new">
          New Edition
        </Link>
      </header>

      <section className="status-grid">
        <article>
          <span>Current Draft</span>
          <strong>Edition 10</strong>
          <p>Last saved 12 minutes ago</p>
        </article>
        <article>
          <span>Latest Edition</span>
          <strong>Issue 9</strong>
          <p>Presses ran successfully</p>
        </article>
        <article>
          <span>Newsroom Status</span>
          <strong>Questionable</strong>
          <p>Three C.H.U.D.s remain unaccounted for</p>
        </article>
      </section>

      <section className="office-panel">
        <p className="eyebrow">Recent Work</p>
        <h2>Open Editions</h2>

        <div className="edition-row">
          <div>
            <strong>Edition 10 — Untitled Draft</strong>
            <span>
              Welcome · Chris&apos; Corner · BBW · Matchups · Closing
            </span>
          </div>
          <Link href="/offices/editions/new">Edit</Link>
        </div>

        <div className="edition-row">
          <div>
            <strong>Edition 9 — Bad Decisions, Worse Excuses</strong>
            <span>Published October 13, 2026</span>
          </div>
          <Link href="/editions/bad-decisions-worse-excuses">View</Link>
        </div>
      </section>
    </>
  );
}
