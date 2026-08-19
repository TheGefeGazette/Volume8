"use client";

import { useState } from "react";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import { draftGradesSections } from "@/lib/gazette/edition-sections";
import { addManagerGrade } from "@/app/offices/editions/new/actions";
import { SidebarBoxesEditor } from "@/components/sidebar-boxes-editor";

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

    savedSidebarBoxes: {
        id: number;
        title: string | null;
        body_html: string | null;
        sort_order: number | null;
    }[];
};



export function DraftGradesEditor({
    editionId,
    initialActiveSlug,
    savedSectionBodies,
    savedManagerGrades,
    savedSidebarBoxes,
}: DraftGradesEditorProps) {
    const [activeSlug, setActiveSlug] = useState(
        draftGradesSections.some(
            (section) => section.slug === initialActiveSlug
        )
            ? initialActiveSlug!
            : "draft-welcome"
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
                                        !editionId ? (
                                            <div className="manager-grade-preview">
                                                <label>
                                                    Manager
                                                    <input
                                                        type="text"
                                                        placeholder="Manager name"
                                                        disabled
                                                    />
                                                </label>

                                                <label>
                                                    Team
                                                    <input
                                                        type="text"
                                                        placeholder="Fantasy team name"
                                                        disabled
                                                    />
                                                </label>

                                                <div className="manager-grade-roster">
                                                    <p className="eyebrow">Drafted Roster</p>

                                                    <p>
                                                        Yahoo roster data will appear here once league integration is available.
                                                    </p>
                                                </div>

                                                <div className="manager-grade-writeup">
                                                    <p className="eyebrow">Gazette Writeup</p>

                                                    <p>
                                                        Save this edition to begin adding manager grades.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p>
                                                No manager grades have been added yet.
                                            </p>
                                        )
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

                                                    <div className="manager-grade-roster">
                                                        <p className="eyebrow">Drafted Roster</p>

                                                        <p>
                                                            Yahoo roster data will appear here once league integration is available.
                                                        </p>
                                                    </div>

                                                    <div className="manager-grade-writeup">
                                                        <p className="eyebrow">Gazette Writeup</p>

                                                        <GazetteRichTextEditor
                                                            fieldName={`managerGradeBody:${managerGrade.id}`}
                                                            initialContent={managerGrade.body_html ?? ""}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : section.slug === "draft-welcome" ? (
                                <>
                                    <GazetteRichTextEditor
                                        fieldName={section.fieldName}
                                        initialContent={
                                            savedSectionBodies[section.slug] ?? ""
                                        }
                                    />

                                    <SidebarBoxesEditor
                                        editionId={editionId}
                                        savedSidebarBoxes={savedSidebarBoxes}
                                    />
                                </>
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