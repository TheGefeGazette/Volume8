import Link from "next/link";

type PublicOfficeHomeProps = {
    latestEdition: {
        title: string;
        subtitle: string | null;
        slug: string;
        publication_date: string | null;
        volume_number: number | null;
        issue_number: number | null;
    };
    showEditorLink: boolean;
};

export function PublicOfficeHome({
    latestEdition,
    showEditorLink,
}: PublicOfficeHomeProps) {
    const hasPublishedEdition = Boolean(latestEdition.slug);

    return (
        <main className="public-office-home">
            <section className="public-office-scene">
                <img
                    className="public-office-image"
                    src="/gazette-office-home.png"
                    alt="The Gefe Gazette Offices"
                />

                <div
                    className="public-office-hotspots"
                    aria-label="Gazette Offices navigation"
                >
                    {hasPublishedEdition ? (
                        <Link
                            className="office-hotspot office-hotspot-edition"
                            href={`/editions/${latestEdition.slug}`}
                            aria-label="Read This Week's Edition"
                        />
                    ) : (
                        <span
                            className="office-hotspot office-hotspot-edition"
                            aria-disabled="true"
                        />
                    )}

                    <span
                        className="office-hotspot office-hotspot-trophy"
                        aria-label="Trophy Room — Coming Soon"
                        aria-disabled="true"
                    />

                    <span
                        className="office-hotspot office-hotspot-history"
                        aria-label="History Book — Coming Soon"
                        aria-disabled="true"
                    />

                    <span
                        className="office-hotspot office-hotspot-archive"
                        aria-label="Archive — Coming Soon"
                        aria-disabled="true"
                    />

                    <span
                        className="office-hotspot office-hotspot-bonehead"
                        aria-label="Bonehead Benching — Coming Soon"
                        aria-disabled="true"
                    />

                    <span
                        className="office-hotspot office-hotspot-lil-gefe"
                        aria-label="Lil' Gefe — Coming Soon"
                        aria-disabled="true"
                    />
                </div>

                {showEditorLink && (
                    <Link className="public-office-editor-link" href="/offices">
                        Enter Editor
                    </Link>
                )}
            </section>
        </main>
    );
}