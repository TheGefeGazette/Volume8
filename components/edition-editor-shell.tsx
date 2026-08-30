"use client";

import { useState } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { EditionTypeSelect } from "@/components/edition-type-select";
import { SectionEditorTabs } from "@/components/section-editor-tabs";

type EditionEditorShellProps = {
    initialEditionType: string;
    savedSectionBodies: Record<string, string>;
    savedSectionGifUrls: Record<string, string>;
    initialActiveSlug?: string;
    initialVolumeNumber: number | null;
    initialIssueNumber: number | null;
    editionId?: string;
    customSections: {
        title: string;
        slug: string;
        sortOrder: number;
    }[];
    savedMatchups: {
        id: string;
        winner: string | null;
        loser: string | null;
        winner_score: number | null;
        loser_score: number | null;
        headline: string | null;
        body_html: string | null;
        sort_order: number | null;
    }[];
    savedPicks: {
        id: number;
        favorite: string | null;
        joke_text: string | null;
        underdog: string | null;
        sort_order: number | null;
    }[];
    savedPicksTagline: string;
    savedManagerGrades: {
        id: number;
        manager_name: string | null;
        team_name: string | null;
        body_html: string | null;
        roster_image_url: string | null;
        roster_image_url_2: string | null;
        sort_order: number | null;
    }[];
    savedSidebarBoxes: {
        id: number;
        title: string | null;
        body_html: string | null;
        sort_order: number | null;
    }[];
    savedBoneheadRecipient: string;
};

export function EditionEditorShell({
    initialEditionType,
    savedSectionBodies,
    savedSectionGifUrls,
    initialActiveSlug,
    editionId,
    customSections,
    savedMatchups,
    savedPicks,
    savedPicksTagline,
    savedManagerGrades,
    savedSidebarBoxes,
    savedBoneheadRecipient,
    initialVolumeNumber,
    initialIssueNumber,
}: EditionEditorShellProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const editionTypeFromUrl = searchParams.get("editionType");

    const [editionType, setEditionType] = useState(
        editionTypeFromUrl ?? initialEditionType
    );

    function chooseEditionType(value: string) {
        setEditionType(value);

        const params = new URLSearchParams(searchParams.toString());

        params.set("editionType", value);
        params.delete("success");
        params.delete("error");

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    }

    return (
        <>
            {editionType === "regular_season" && (
                <section className="editor-canvas editor-edition-details">
                    <div className="edition-masthead-fields">
                        <label>
                            Volume
                            <input
                                type="number"
                                name="volumeNumber"
                                min="1"
                                defaultValue={initialVolumeNumber ?? ""}
                            />
                        </label>

                        <label>
                            Issue Number
                            <input
                                type="number"
                                name="issueNumber"
                                min="1"
                                defaultValue={initialIssueNumber ?? ""}
                            />
                        </label>
                    </div>
                </section>
            )}

            <div className="edition-editor-wrapper">
                <section className="editor-canvas editor-edition-details">
                    <label>
                        Edition Type
                        <EditionTypeSelect
                            value={editionType}
                            onChange={chooseEditionType}
                        />
                    </label>
                </section>

                <div className="editor-shell">
                    <SectionEditorTabs
                        savedSectionBodies={savedSectionBodies}
                        savedSectionGifUrls={savedSectionGifUrls}
                        initialActiveSlug={initialActiveSlug}
                        editionId={editionId}
                        editionType={editionType}
                        customSections={customSections}
                        savedMatchups={savedMatchups}
                        savedPicks={savedPicks}
                        savedPicksTagline={savedPicksTagline}
                        savedManagerGrades={savedManagerGrades}
                        savedSidebarBoxes={savedSidebarBoxes}
                        savedBoneheadRecipient={savedBoneheadRecipient}
                    />

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
                            <p>
                                The AI is the newsroom assistant—not the
                                editor-in-chief.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}