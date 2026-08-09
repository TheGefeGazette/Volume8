"use client";

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
    return (
        <div className="matchups-editor">
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
                    type="submit"
                    className="office-secondary"
                    formAction={addMatchup}
                    disabled={!editionId}
                >
                    + Add Matchup
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
                                type="submit"
                                className="office-secondary"
                                formAction={deleteMatchup.bind(
                                    null,
                                    editionId,
                                    matchup.id
                                )}
                                onClick={(event) => {
                                    const confirmed = window.confirm(
                                        `Delete Matchup ${index + 1}?\n\nThis cannot be undone.`
                                    );

                                    if (!confirmed) {
                                        event.preventDefault();
                                    }
                                }}
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