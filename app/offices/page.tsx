import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function OfficesPage() {
  const supabase = await createClient();

  const { data: editions, error } = await supabase
    .from("editions")
    .select("id, title, status, slug, updated_at")
    .order("updated_at", { ascending: false });

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
          <p>Morale remains at an all-time low</p>
        </article>
      </section>

      <section className="office-panel">
        <p className="eyebrow">Recent Work</p>
        <h2>Open Editions</h2>

        {error && (
          <p>Unable to load editions: {error.message}</p>
        )}

        {!error && editions?.length === 0 && (
          <p>No editions have been created yet.</p>
        )}

        {editions?.map((edition) => (
          <div className="edition-row" key={edition.id}>
            <div>
              <strong>{edition.title}</strong>
              <span>
                Status: {edition.status}
                {edition.updated_at &&
                  ` · Updated ${new Date(edition.updated_at).toLocaleDateString()}`}
              </span>
            </div>

            {edition.status === "draft" ? (
              <Link href={`/offices/editions/new?edition=${edition.id}`}>
                Edit
              </Link>
            ) : (
              <Link href={`/editions/${edition.slug}`}>
                View
              </Link>
            )}
          </div>
        ))}
      </section>
    </>
  );
}