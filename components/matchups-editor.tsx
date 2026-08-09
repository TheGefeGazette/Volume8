"use client";

import { GazetteRichTextEditor } from "@/components/gazette-rich-text-editor";
import { addMatchup } from "@/app/offices/editions/new/actions";

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
                {matchups.length} structured matchup{matchups.length === 1 ? "" : "s"} loaded
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

            <div className="matchup-entry">
                <div className="matchup-number">Matchup 1</div>

                <div className="matchup-fields">
                    <label>
                        Winner
                        <input
                            type="text"
                            placeholder="Winner"
                            disabled
                        />
                    </label>

                    <label>
                        Loser
                        <input
                            type="text"
                            placeholder="Loser"
                            disabled
                        />
                    </label>

                    <label>
                        Winner Score
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            disabled
                        />
                    </label>

                    <label>
                        Loser Score
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            disabled
                        />
                    </label>
                </div>

                <label className="matchup-headline">
                    Matchup Headline
                    <input
                        type="text"
                        placeholder="Write a headline for this matchup..."
                        disabled
                    />
                </label>

                <div className="matchup-recap">
                    <span>Recap</span>

                    <GazetteRichTextEditor
                        fieldName={fieldName}
                        initialContent={initialContent}
                    />
                </div>

                <p className="matchup-prototype-note">
                    Winner, loser, scores, headline, and Add Matchup will be activated
                    after this layout is connected to the matchup database.
                </p>
            </div>
        </div>
    );
}