"use client";

import { MatchupsEditor } from "@/components/matchups-editor";
import {
    addStory,
    deleteStory,
} from "@/app/offices/editions/new/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import { GifPicker } from "@/components/gif-picker";
import { editionSections } from "@/lib/gazette/edition-sections";

type SectionEditorTabsProps = {
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
};

export function SectionEditorTabs({
    savedSectionBodies,
    savedSectionGifUrls,
    initialActiveSlug,
    editionId,
    customSections = [],
    savedMatchups,
}: SectionEditorTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const allSections = [
        ...editionSections,
        ...customSections.map((section) => ({
            title: section.title,
            heading: section.title,
            slug: section.slug,
            fieldName: `customBody:${section.slug}`,
            placeholder: `Write ${section.title}...`,
            sortOrder: section.sortOrder,
        })),
    ];

    const sectionFromUrl = searchParams.get("section");

    const activeSlug = allSections.some(
        (section) => section.slug === sectionFromUrl
    )
        ? sectionFromUrl!
        : allSections.some(
            (section) => section.slug === initialActiveSlug
        )
            ? initialActiveSlug!
            : allSections[0]?.slug ?? "welcome";

    function chooseSection(sectionSlug: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set("section", sectionSlug);
        params.delete("success");
        params.delete("error");

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    }

    return (
        <>
            <input type="hidden" name="activeSection" value={activeSlug} />

            <aside className="section-list">
                <h2>Sections</h2>

                {allSections.map((section, index) => (
                    <button
                        key={section.slug}
                        type="button"
                        className={activeSlug === section.slug ? "is-active" : ""}
                        onClick={() => chooseSection(section.slug)}
                    >
                        <span>{index + 1}</span>
                        {section.title}
                    </button>
                ))}

                {editionId ? (
                    <div className="add-story-form">
                        <input
                            type="text"
                            name="storyTitle"
                            placeholder="Story title"
                        />

                        <button
                            className="add-section"
                            type="submit"
                            formAction={addStory}
                        >
                            + Add Story
                        </button>
                    </div>
                ) : (
                    <p className="add-story-note">
                        Save this edition before adding a custom story.
                    </p>
                )}
            </aside>

            <div className="section-editor-pages">
                {allSections.map((section) => (
                    <div
                        key={section.slug}
                        className={`section-editor-page ${activeSlug === section.slug ? "is-active" : ""
                            }`}
                    >
                        <div className="editor-paper">
                            <p className="eyebrow">{section.title}</p>
                            <h2>{section.heading}</h2>

                            {customSections.some(
                                (customSection) => customSection.slug === section.slug
                            ) && editionId && (
                                    <button
                                        type="submit"
                                        className="office-secondary"
                                        formAction={deleteStory.bind(null, editionId, section.slug)}

                                    >
                                        Delete Story
                                    </button>
                                )}

                            {section.slug === "matchups" ? (
                                <MatchupsEditor
                                    fieldName={section.fieldName}
                                    initialContent={savedSectionBodies[section.slug] ?? ""}
                                    editionId={editionId}
                                    matchups={savedMatchups}
                                />
                            ) : (
                                <GazetteRichTextEditor
                                    fieldName={section.fieldName}
                                    initialContent={savedSectionBodies[section.slug] ?? ""}
                                />
                            )}

                            <GifPicker
                                fieldName={`gifUrl:${section.slug}`}
                                initialUrl={savedSectionGifUrls[section.slug] ?? ""}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}