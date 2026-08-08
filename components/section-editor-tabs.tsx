"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import { GifPicker } from "@/components/gif-picker";
import { editionSections } from "@/lib/gazette/edition-sections";

type SectionEditorTabsProps = {
    savedSectionBodies: Record<string, string>;
    savedSectionGifUrls: Record<string, string>;
    initialActiveSlug?: string;
};

export function SectionEditorTabs({
    savedSectionBodies,
    savedSectionGifUrls,
    initialActiveSlug,
}: SectionEditorTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const sectionFromUrl = searchParams.get("section");

    const activeSlug = editionSections.some(
        (section) => section.slug === sectionFromUrl
    )
        ? sectionFromUrl!
        : editionSections.some(
            (section) => section.slug === initialActiveSlug
        )
            ? initialActiveSlug!
            : editionSections[0]?.slug ?? "welcome";

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

                {editionSections.map((section, index) => (
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

                <button className="add-section" type="button">
                    + Optional Detail
                </button>
            </aside>

            <div className="section-editor-pages">
                {editionSections.map((section) => (
                    <div
                        key={section.slug}
                        className={`section-editor-page ${activeSlug === section.slug ? "is-active" : ""
                            }`}
                    >
                        <div className="editor-paper">
                            <p className="eyebrow">{section.title}</p>
                            <h2>{section.heading}</h2>

                            {section.slug === "matchups" ? (
                                <textarea
                                    name={section.fieldName}
                                    defaultValue={savedSectionBodies[section.slug] ?? ""}
                                    rows={10}
                                    placeholder={section.placeholder}
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