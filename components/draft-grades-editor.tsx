"use client";

import { useState } from "react";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import { draftGradesSections } from "@/lib/gazette/edition-sections";

type DraftGradesEditorProps = {
    editionId?: string;
    savedSectionBodies: Record<string, string>;
};



export function DraftGradesEditor({
    editionId,
    savedSectionBodies,
}: DraftGradesEditorProps) {
    const [activeSlug, setActiveSlug] = useState("welcome");

    return (
        <>
            <aside className="section-list">
                <h2>Sections</h2>

                {draftGradesSections.map((section, index) => (
                    <button
                        key={section.slug}
                        type="button"
                        className={
                            activeSlug === section.slug
                                ? "is-active"
                                : ""
                        }
                        onClick={() => setActiveSlug(section.slug)}
                    >
                        <span>{index + 1}</span>
                        {section.title}
                    </button>
                ))}
            </aside>

            <div className="section-editor-pages">
                {draftGradesSections.map((section) => (
                    <div
                        key={section.slug}
                        className={`section-editor-page ${activeSlug === section.slug
                            ? "is-active"
                            : ""
                            }`}
                    >
                        <div className="editor-paper">
                            <p className="eyebrow">
                                {section.title}
                            </p>

                            <h2>{section.title}</h2>

                            {section.slug === "manager-grades" ? (
                                <div>
                                    <p>
                                        Yahoo roster data will appear here
                                        once Yahoo API access is available.
                                    </p>

                                    <GazetteRichTextEditor
                                        fieldName={section.fieldName}
                                        initialContent=""
                                    />
                                </div>
                            ) : (
                                <GazetteRichTextEditor
                                    fieldName={section.fieldName}
                                    initialContent={
                                        savedSectionBodies[section.slug] ?? ""
                                    }
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <input
                type="hidden"
                name="draftGradesEditionId"
                value={editionId ?? ""}
            />
        </>
    );
}