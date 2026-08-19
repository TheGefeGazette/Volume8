"use client";

import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import {
    addSidebarBox,
    deleteSidebarBox,
} from "@/app/offices/editions/new/actions";

type SidebarBoxesEditorProps = {
    editionId?: string;
    savedSidebarBoxes: {
        id: number;
        title: string | null;
        body_html: string | null;
        sort_order: number | null;
    }[];
};

export function SidebarBoxesEditor({
    editionId,
    savedSidebarBoxes,
}: SidebarBoxesEditorProps) {
    return (
        <div>
            <div className="sidebar-boxes-header">
                <p className="eyebrow">Welcome Page</p>
                <h2>Newspaper Boxes</h2>

                <p>
                    Optional front-page boxes for short features,
                    announcements, corrections, jokes, or other Gazette details.
                </p>
            </div>

            {editionId ? (
                <button
                    type="submit"
                    className="office-secondary"
                    formAction={addSidebarBox}
                >
                    + Add Newspaper Box
                </button>
            ) : (
                <p>
                    Save this edition before adding newspaper boxes.
                </p>
            )}

            {savedSidebarBoxes.length === 0 ? (
                <p>
                    No newspaper boxes have been added yet.
                </p>
            ) : (
                <div className="sidebar-boxes-list">
                    {savedSidebarBoxes.map((box) => (
                        <div
                            key={box.id}
                            className="sidebar-box-editor"
                        >
                            <input
                                type="hidden"
                                name={`sidebarBoxId:${box.id}`}
                                value={box.id}
                                readOnly
                            />

                            {editionId && (
                                <button
                                    type="submit"
                                    className="office-secondary"
                                    formAction={deleteSidebarBox.bind(
                                        null,
                                        box.id,
                                        editionId
                                    )}
                                >
                                    Delete Box
                                </button>
                            )}

                            <label>
                                Box Title
                                <input
                                    type="text"
                                    name={`sidebarBoxTitle:${box.id}`}
                                    defaultValue={box.title ?? ""}
                                    placeholder="Box title"
                                />
                            </label>

                            <GazetteRichTextEditor
                                fieldName={`sidebarBoxBody:${box.id}`}
                                initialContent={box.body_html ?? ""}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}