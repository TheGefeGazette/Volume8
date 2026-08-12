"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import {
    addMatchup,
    deleteMatchup,
} from "@/app/offices/editions/new/actions";

type MatchupsEditorProps = {
    fieldName: string;
    initialContent?: string;
    editionId?: string;
    matchups: {
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

export function MatchupsEditor({
    fieldName,
    initialContent = "",
    editionId,
    matchups,
}: MatchupsEditorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function getCurrentForm(button: HTMLButtonElement) {
        return button.form;
    }

    function handleAddMatchup(
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        event.preventDefault();

        const form = getCurrentForm(event.currentTarget);

        if (!form) {
            return;
        }

        const formData = new FormData(form);

        startTransition(async () => {
            const result = await addMatchup(formData);

            if (result?.error) {
                window.alert(result.error);
                return;
            }

            router.refresh();
        });
    }

    function handleDeleteMatchup(
        event: React.MouseEvent<HTMLButtonElement>,
        matchupId: string,
        matchupNumber: number
    ) {
        event.preventDefault();

        const confirmed = window.confirm(
            `Delete Matchup ${matchupNumber}?\n\nThis cannot be undone.`
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
            const result = await deleteMatchup(
                editionId,
                matchupId,
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
        <div id="matchups-editor" className="matchups-editor">
            <p className="matchup-prototype-note">
                {matchups.length} structured matchup
                {matchups.length === 1 ? "" : "s"} loaded
            </p>

            <div className="matchups-editor-header">
                <div>
                    <p className="eyebrow">Matchup Desk</p>
                    <h3>Individual Matchups</h3>
                </div>

                <button
                    type="button"
                    className="office-secondary"
                    onClick={handleAddMatchup}
                    disabled={!editionId || isPending}
                >
                    {isPending ? "Working..." : "+ Add Matchup"}
                </button>
            </div>

            {matchups.length === 0 ? (
                <div className="matchup-entry">
                    <p className="matchup-prototype-note">
                        No matchups added yet. Click + Add Matchup to create one.
                    </p>

                    <input
                        type="hidden"
                        name={fieldName}
                        value={initialContent}
                        readOnly
                    />
                </div>
            ) : (
                matchups.map((matchup, index) => (
                    <div className="matchup-entry" key={matchup.id}>
                        <div className="matchup-number">
                            Matchup {index + 1}
                        </div>

                        {editionId && (
                            <button
                                type="button"
                                className="office-secondary"
                                disabled={isPending}
                                onClick={(event) =>
                                    handleDeleteMatchup(
                                        event,
                                        matchup.id,
                                        index + 1
                                    )
                                }
                            >
                                Delete Matchup
                            </button>
                        )}

                        <input
                            type="hidden"
                            name={`matchupId:${matchup.id}`}
                            value={matchup.id}
                        />

                        <div className="matchup-fields">
                            <label>
                                Winner
                                <input
                                    type="text"
                                    name={`matchupWinner:${matchup.id}`}
                                    defaultValue={matchup.winner ?? ""}
                                    placeholder="Winner"
                                />
                            </label>

                            <label>
                                Loser
                                <input
                                    type="text"
                                    name={`matchupLoser:${matchup.id}`}
                                    defaultValue={matchup.loser ?? ""}
                                    placeholder="Loser"
                                />
                            </label>

                            <label>
                                Winner Score
                                <input
                                    type="number"
                                    step="0.01"
                                    name={`matchupWinnerScore:${matchup.id}`}
                                    defaultValue={matchup.winner_score ?? ""}
                                    placeholder="0.00"
                                />
                            </label>

                            <label>
                                Loser Score
                                <input
                                    type="number"
                                    step="0.01"
                                    name={`matchupLoserScore:${matchup.id}`}
                                    defaultValue={matchup.loser_score ?? ""}
                                    placeholder="0.00"
                                />
                            </label>
                        </div>

                        <label className="matchup-headline">
                            Matchup Headline
                            <input
                                type="text"
                                name={`matchupHeadline:${matchup.id}`}
                                defaultValue={matchup.headline ?? ""}
                                placeholder="Write a headline for this matchup..."
                            />
                        </label>

                        <div className="matchup-recap">
                            <span>Recap</span>

                            <GazetteRichTextEditor
                                fieldName={`matchupBody:${matchup.id}`}
                                initialContent={matchup.body_html ?? ""}
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}