import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { copyEdition } from "./actions";
import { DeleteEditionForm } from "@/components/delete-edition-form";

export default async function OfficesPage() {
  const supabase = await createClient();

  const { data: editions, error } = await supabase
    .from("editions")
    .select("id, title, status, slug, updated_at")
    .order("updated_at", { ascending: false });

  const draftEditions =
    editions?.filter((edition) => edition.status === "draft") ?? [];

  const publishedEditions =
    editions?.filter((edition) => edition.status !== "draft") ?? [];

  const currentDraft = draftEditions[0];
  const latestPublished = publishedEditions[0];

  return (
    <>
      <header className="office-header">
        <div>
          <p>Editorial Command Center</p>
          <h1>The Gazette Offices</h1>
        </div>
        <div className="office-header-actions">
          <a
            className="office-secondary"
            href="/api/yahoo/connect"
          >
            Connect Yahoo
          </a>

          <Link className="office-primary" href="/offices/editions/new">
            New Edition
          </Link>
        </div>
      </header>

      <section className="status-grid">
        <article>
          <span>Current Draft</span>
          <strong>{currentDraft?.title ?? "No Active Draft"}</strong>
          <p>
            {currentDraft?.updated_at
              ? `Last updated ${new Date(
                currentDraft.updated_at
              ).toLocaleDateString()}`
              : "The newsroom is waiting for fresh copy"}
          </p>
        </article>

        <article>
          <span>Latest Edition</span>
          <strong>{latestPublished?.title ?? "Nothing Published Yet"}</strong>
          <p>
            {latestPublished?.updated_at
              ? `Published edition updated ${new Date(
                latestPublished.updated_at
              ).toLocaleDateString()}`
              : "The presses remain suspiciously quiet"}
          </p>
        </article>

        <article>
          <span>Newsroom Status</span>
          <strong>
            {draftEditions.length}{" "}
            {draftEditions.length === 1 ? "Draft" : "Drafts"} Waiting
          </strong>
          <p>
            {draftEditions.length === 0
              ? "Morale has improved to merely questionable"
              : "Morale remains at an all-time low"}
          </p>
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

        <h3 className="edition-group-heading">Drafts</h3>

        {draftEditions.length === 0 ? (
          <p>No draft editions.</p>
        ) : (
          draftEditions.map((edition) => (
            <div className="edition-row" key={edition.id}>
              <div>
                <strong>{edition.title}</strong>
                <span>
                  Updated{" "}
                  {edition.updated_at
                    ? new Date(edition.updated_at).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>

              <div className="edition-row-actions">
                <Link href={`/offices/editions/new?edition=${edition.id}`}>
                  Edit
                </Link>

                <Link href={`/offices/editions/preview/${edition.id}`}>
                  Preview
                </Link>

                <form action={copyEdition}>
                  <input
                    type="hidden"
                    name="editionId"
                    value={edition.id}
                  />

                  <button type="submit">
                    Copy
                  </button>
                </form>

                <DeleteEditionForm
                  editionId={edition.id}
                  editionTitle={edition.title}
                />
              </div>
            </div>
          ))
        )}

        <h3 className="edition-group-heading">Published</h3>
        {publishedEditions.length === 0 ? (
          <p>No published editions yet.</p>
        ) : (
          publishedEditions.map((edition) => (
            <div className="edition-row" key={edition.id}>
              <div>
                <strong>{edition.title}</strong>
                <span>
                  Updated{" "}
                  {edition.updated_at
                    ? new Date(edition.updated_at).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>

              <div className="edition-row-actions">
                <Link href={`/editions/${edition.slug}`}>
                  View
                </Link>

                <Link href={`/offices/editions/new?edition=${edition.id}`}>
                  Edit
                </Link>

                <DeleteEditionForm
                  editionId={edition.id}
                  editionTitle={edition.title}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}