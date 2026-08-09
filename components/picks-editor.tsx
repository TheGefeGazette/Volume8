"use client";

import { addPick } from "@/app/offices/editions/new/actions";

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
    return (
        <div className="picks-editor">
            <div className="picks-editor-header">
                <div>
                    <p className="eyebrow">Sports Desk</p>
                    <h3>Next Week&apos;s Picks</h3>
                </div>

                <button
                    type="submit"
                    className="office-secondary"
                    formAction={addPick}
                    disabled={!editionId}
                >
                    + Add Pick
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