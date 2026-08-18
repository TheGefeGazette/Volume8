"use client";

import { useState } from "react";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import { draftGradesSections } from "@/lib/gazette/edition-sections";
import { addManagerGrade } from "@/app/offices/editions/new/actions";

type DraftGradesEditorProps = {
    editionId?: string;
    initialActiveSlug?: string;
    savedSectionBodies: Record<string, string>;
    savedManagerGrades: {
        id: number;
        manager_name: string | null;
        team_name: string | null;
        body_html: string | null;
        sort_order: number | null;
    }[];
};



export function DraftGradesEditor({
    editionId,
    initialActiveSlug,
    savedSectionBodies,
    savedManagerGrades,
}: DraftGradesEditorProps) {
    const [activeSlug, setActiveSlug] = useState(
        draftGradesSections.some(
            (section) => section.slug === initialActiveSlug
        )
            ? initialActiveSlug!
            : "welcome"
    );
    return (
        <>
            <input
                type="hidden"
                name="activeSection"
                value={activeSlug}
            />
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
                                    {editionId ? (
                                        <button
                                            type="submit"
                                            className="office-secondary"
                                            formAction={addManagerGrade}
                                        >
                                            + Add Manager
                                        </button>
                                    ) : (
                                        <p>
                                            Save this edition before adding manager grades.
                                        </p>
                                    )}

                                    {savedManagerGrades.length === 0 ? (
                                        <p>
                                            No manager grades have been added yet.
                                        </p>
                                    ) : (
                                        <div>
                                            {savedManagerGrades.map((managerGrade) => (
                                                <div key={managerGrade.id}>
                                                    <input
                                                        type="hidden"
                                                        name={`managerGradeId:${managerGrade.id}`}
                                                        value={managerGrade.id}
                                                        readOnly
                                                    />

                                                    <label>
                                                        Manager
                                                        <input
                                                            type="text"
                                                            name={`managerGradeManager:${managerGrade.id}`}
                                                            defaultValue={managerGrade.manager_name ?? ""}
                                                            placeholder="Manager name"
                                                        />
                                                    </label>

                                                    <label>
                                                        Team
                                                        <input
                                                            type="text"
                                                            name={`managerGradeTeam:${managerGrade.id}`}
                                                            defaultValue={managerGrade.team_name ?? ""}
                                                            placeholder="Fantasy team name"
                                                        />
                                                    </label>

                                                    <GazetteRichTextEditor
                                                        fieldName={`managerGradeBody:${managerGrade.id}`}
                                                        initialContent={managerGrade.body_html ?? ""}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
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