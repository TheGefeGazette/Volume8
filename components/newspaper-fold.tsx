"use client";

import Link from "next/link";
import { Masthead } from "@/components/masthead";

type NewspaperFoldProps = {
  latestEdition: {
    title: string;
    subtitle: string | null;
    slug: string;
    publication_date: string | null;
    volume_number: number | null;
    issue_number: number | null;
  };
};

export function NewspaperFold({
  latestEdition,
}: NewspaperFoldProps) {

  const formattedPublicationDate = latestEdition.publication_date
    ? new Date(`${latestEdition.publication_date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    )
    : undefined;

  return (
    <section className="desk-stage">
      <div className="paper-shadow" aria-hidden="true" />

      <article className="folded-paper">
        <div className="paper-top">
          <Masthead
            volume={latestEdition.volume_number ?? undefined}
            issue={latestEdition.issue_number ?? undefined}
            date={formattedPublicationDate}
          />
          <p className="edition-kicker">This Week&apos;s Edition</p>
          <h2>{latestEdition.title}</h2>
          <p className="edition-deck">{latestEdition.subtitle}</p>
        </div>

        <div className="paper-bottom">
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
        <Link
          className="press-button"
          href={`/editions/${latestEdition.slug}`}
        >
          Read This Week&apos;s Edition
        </Link>

        <Link className="text-link" href="/">
          Visit The Gazette Offices
        </Link>
      </div>
    </section>
  );
}
