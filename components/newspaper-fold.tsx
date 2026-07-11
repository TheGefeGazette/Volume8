"use client";

import { useState } from "react";
import Link from "next/link";
import { Masthead } from "@/components/masthead";
import { latestEdition } from "@/lib/demo-data";

export function NewspaperFold() {
  const [opened, setOpened] = useState(false);

  return (
    <section className={`desk-stage ${opened ? "is-open" : ""}`}>
      <div className="paper-shadow" aria-hidden="true" />

      <article className="folded-paper">
        <div className="paper-top">
          <Masthead />
          <p className="edition-kicker">This Week&apos;s Edition</p>
          <h2>{latestEdition.title}</h2>
          <p className="edition-deck">{latestEdition.subtitle}</p>
        </div>

        <div className="paper-bottom" aria-hidden={!opened}>
          <div className="front-grid">
            <section>
              <p className="section-kicker">Lead Story</p>
              <h3>League Dignity Reaches New Seasonal Low</h3>
              <p>
                Anonymous sources inside The Gazette Offices confirm that
                everyone remains extremely confident despite overwhelming
                evidence to the contrary.
              </p>
            </section>

            <aside className="staff-note">
              <span>Today&apos;s Newsroom</span>
              <p>
                The over-caffeinated C.H.U.D.s survived another deadline with
                only minor structural damage.
              </p>
              <small>Optional prototype module</small>
            </aside>
          </div>
        </div>
      </article>

      <div className="fold-actions">
        {!opened ? (
          <button className="press-button" onClick={() => setOpened(true)}>
            Read This Week&apos;s Edition
          </button>
        ) : (
          <Link
            className="press-button"
            href={`/editions/${latestEdition.slug}`}
          >
            Enter the Edition
          </Link>
        )}

        <Link className="text-link" href="/offices">
          Visit The Gazette Offices
        </Link>
      </div>
    </section>
  );
}
