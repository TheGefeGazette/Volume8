"use client";

type EditionTypeSelectProps = {
    value: string;
    onChange: (value: string) => void;
};

export function EditionTypeSelect({
    value,
    onChange,
}: EditionTypeSelectProps) {
    return (
        <select
            name="editionType"
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            <option value="regular_season">
                Regular Season Edition
            </option>

            <option value="draft_grades">
                Draft Grades and Preseason Predictions
            </option>

            <option value="playoffs">
                Playoff Edition
            </option>

            <option value="championship">
                Championship Edition
            </option>

            <option value="special">
                Special Edition
            </option>

            <option value="custom">
                Custom Edition
            </option>
        </select>
    );
}