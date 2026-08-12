"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    addPick,
    deletePick,
} from "@/app/offices/editions/new/actions";

type PicksEditorProps = {
    editionId?: string;
    picks: {
        id: number;
        favorite: string | null;
        joke_text: string | null;
        underdog: string | null;
        sort_order: number | null;
    }[];
};

export function PicksEditor({
    editionId,
    picks,
}: PicksEditorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function getCurrentForm(button: HTMLButtonElement) {
        return button.form;
    }

    function handleAddPick(
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        event.preventDefault();

        const form = getCurrentForm(event.currentTarget);

        if (!form) {
            return;
        }

        const formData = new FormData(form);

        startTransition(async () => {
            const result = await addPick(formData);

            if (result?.error) {
                window.alert(result.error);
                return;
            }

            router.refresh();
        });
    }

    function handleDeletePick(
        event: React.MouseEvent<HTMLButtonElement>,
        pickId: number,
        pickNumber: number
    ) {
        event.preventDefault();

        const confirmed = window.confirm(
            `Delete Pick ${pickNumber}?\n\nThis cannot be undone.`
        );

        if (!confirmed || !editionId) {
            return;
        }

        const form = getCurrentForm(event.currentTarget);

        if (!form) {
            return;
        }

        const formData = new FormData(form);

        startTransition(async () => {
            const result = await deletePick(
                editionId,
                pickId,
                formData
            );

            if (result?.error) {
                window.alert(result.error);
                return;
            }

            router.refresh();
        });
    }

    return (
        <div className="picks-editor">
            <div className="picks-editor-header">
                <div>
                    <p className="eyebrow">Sports Desk</p>
                    <h3>Next Week&apos;s Picks</h3>
                </div>

                <button
                    type="button"
                    className="office-secondary"
                    onClick={handleAddPick}
                    disabled={!editionId || isPending}
                >
                    {isPending ? "Working..." : "+ Add Pick"}
                </button>
            </div>

            {picks.length === 0 ? (
                <div className="pick-entry">
                    <p className="matchup-prototype-note">
                        No picks added yet.
                    </p>
                </div>
            ) : (
                picks.map((pick, index) => (
                    <div className="pick-entry" key={pick.id}>
                        <div className="matchup-number">
                            Pick {index + 1}
                        </div>

                        {editionId && (
                            <button
                                type="button"
                                className="office-secondary"
                                disabled={isPending}
                                onClick={(event) =>
                                    handleDeletePick(
                                        event,
                                        pick.id,
                                        index + 1
                                    )
                                }
                            >
                                Delete Pick
                            </button>
                        )}

                        <div className="pick-fields">
                            <label>
                                Favorite
                                <input
                                    type="text"
                                    name={`pickFavorite:${pick.id}`}
                                    defaultValue={pick.favorite ?? ""}
                                    placeholder="Favored team"
                                />
                            </label>

                            <label className="pick-joke-field">
                                Joke / Action
                                <textarea
                                    name={`pickJoke:${pick.id}`}
                                    defaultValue={pick.joke_text ?? ""}
                                    rows={4}
                                    placeholder="What terrible thing does the favorite do to the underdog?"
                                />
                            </label>

                            <label>
                                Underdog
                                <input
                                    type="text"
                                    name={`pickUnderdog:${pick.id}`}
                                    defaultValue={pick.underdog ?? ""}
                                    placeholder="Underdog team"
                                />
                            </label>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}