"use client";

import { MatchupsEditor } from "@/components/matchups-editor";
import {
    addStory,
    deleteStory,
} from "@/app/offices/editions/new/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import {
    editionSections,
    draftGradesSections,
} from "@/lib/gazette/edition-sections";
import { PicksEditor } from "@/components/picks-editor";
import { DraftGradesEditor } from "@/components/draft-grades-editor";
import { SidebarBoxesEditor } from "@/components/sidebar-boxes-editor";

type SectionEditorTabsProps = {
    savedSectionBodies: Record<string, string>;
    savedSectionGifUrls: Record<string, string>;
    initialActiveSlug?: string;
    editionId?: string;
    editionType: string;
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

export function SectionEditorTabs({
    savedSectionBodies,
    savedSectionGifUrls,
    initialActiveSlug,
    editionId,
    editionType,
    customSections = [],
    savedMatchups,
    savedPicks,
    savedPicksTagline,
    savedManagerGrades,
    savedSidebarBoxes,
    savedBoneheadRecipient,
}: SectionEditorTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isDraftGradesEdition =
        editionType === "draft_grades";

    const baseSections =
        editionType === "draft_grades"
            ? draftGradesSections
            : editionSections;



    const regularSections = baseSections.filter(
        (section) => section.slug !== "next-weeks-picks"
    );

    const nextWeeksPicksSection = baseSections.find(
        (section) => section.slug === "next-weeks-picks"
    );

    const allSections = [
        ...regularSections,

        ...customSections.map((section) => ({
            title: section.title,
            heading: section.title,
            slug: section.slug,
            fieldName: `customBody:${section.slug}`,
            placeholder: `Write ${section.title}...`,
            sortOrder: section.sortOrder,
        })),

        ...(nextWeeksPicksSection ? [nextWeeksPicksSection] : []),
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

    if (isDraftGradesEdition) {
        return (
            <DraftGradesEditor
                editionId={editionId}
                initialActiveSlug={initialActiveSlug}
                savedSectionBodies={savedSectionBodies}
                savedManagerGrades={savedManagerGrades}
                savedSidebarBoxes={savedSidebarBoxes}
            />
        );
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
                                        formAction={deleteStory.bind(
                                            null,
                                            editionId,
                                            section.slug
                                        )}
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
                            ) : section.slug === "next-weeks-picks" ? (
                                <PicksEditor
                                    editionId={editionId}
                                    picks={savedPicks}
                                    tagline={savedPicksTagline}
                                />
                            ) : section.slug === "bonehead-benching" ? (
                                <>
                                    <div className="bonehead-recipient-field">
                                        <label>
                                            Recipient
                                            <input
                                                type="text"
                                                name="boneheadRecipient"
                                                defaultValue={savedBoneheadRecipient}
                                                placeholder="This week's Bonehead"
                                            />
                                        </label>
                                    </div>

                                    <GazetteRichTextEditor
                                        fieldName={section.fieldName}
                                        initialContent={savedSectionBodies[section.slug] ?? ""}
                                    />
                                </>
                            ) : section.slug === "welcome" ? (
                                <>
                                    <GazetteRichTextEditor
                                        fieldName={section.fieldName}
                                        initialContent={savedSectionBodies[section.slug] ?? ""}
                                    />

                                    <SidebarBoxesEditor
                                        editionId={editionId}
                                        savedSidebarBoxes={savedSidebarBoxes}
                                    />
                                </>
                            ) : (
                                <GazetteRichTextEditor
                                    fieldName={section.fieldName}
                                    initialContent={savedSectionBodies[section.slug] ?? ""}
                                />
                            )}


                            <input
                                type="hidden"
                                name={`gifUrl:${section.slug}`}
                                value={savedSectionGifUrls[section.slug] ?? ""}
                                readOnly
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}