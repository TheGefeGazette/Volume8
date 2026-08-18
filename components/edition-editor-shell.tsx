"use client";

import { useState } from "react";
import { EditionTypeSelect } from "@/components/edition-type-select";
import { SectionEditorTabs } from "@/components/section-editor-tabs";

type EditionEditorShellProps = {
    initialEditionType: string;
    savedSectionBodies: Record<string, string>;
    savedSectionGifUrls: Record<string, string>;
    initialActiveSlug?: string;
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
    savedManagerGrades: {
        id: number;
        manager_name: string | null;
        team_name: string | null;
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
    savedManagerGrades,
    savedBoneheadRecipient,
}: EditionEditorShellProps) {
    const [editionType, setEditionType] = useState(initialEditionType);

    return (
        <div className="edition-editor-wrapper">
            <section className="editor-canvas editor-edition-details">
                <label>
                    Edition Type
                    <EditionTypeSelect
                        value={editionType}
                        onChange={setEditionType}
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
                    savedManagerGrades={savedManagerGrades}
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
    );
}