"use client";

import { useMemo, useState } from "react";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";

type GifPickerProps = {
    fieldName?: string;
    initialUrl?: string;
    onSelectGif?: (gifUrl: string) => void;
};

export function GifPicker({
    fieldName,
    initialUrl = "",
    onSelectGif,
}: GifPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUrl, setSelectedUrl] = useState(initialUrl);

    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY ?? "";

    const giphy = useMemo(() => new GiphyFetch(apiKey), [apiKey]);

    const fetchGifs = (offset: number) => {
        if (searchTerm.trim()) {
            return giphy.search(searchTerm.trim(), {
                offset,
                limit: 12,
                rating: "pg-13",
            });
        }

        return giphy.trending({
            offset,
            limit: 12,
            rating: "pg-13",
        });
    };

    const selectGif = (gif: IGif, event: React.SyntheticEvent) => {
        event.preventDefault();

        const gifUrl =
            gif.images.fixed_width?.url ||
            gif.images.original?.url ||
            "";

        if (fieldName) {
            setSelectedUrl(gifUrl);
        }

        onSelectGif?.(gifUrl);
        setIsOpen(false);
    };

    return (
        <div className="gif-picker">
            {fieldName && (
                <input type="hidden" name={fieldName} value={selectedUrl} />
            )}
            {selectedUrl ? (
                <div className="gif-picker-preview">
                    <img src={selectedUrl} alt="Selected GIF preview" />

                    <div className="gif-picker-actions">
                        <button type="button" onClick={() => setIsOpen(true)}>
                            Change GIF
                        </button>

                        <button type="button" onClick={() => setSelectedUrl("")}>
                            Remove GIF
                        </button>
                    </div>
                </div>
            ) : (
                <button type="button" onClick={() => setIsOpen(true)}>
                    GIF
                </button>
            )}

            {isOpen && (
                <div className="gif-picker-panel">
                    <div className="gif-picker-header">
                        <div>
                            <p className="eyebrow">Photo Desk</p>
                            <h3>Search GIPHY</h3>
                        </div>

                        <button type="button" onClick={() => setIsOpen(false)}>
                            Close
                        </button>
                    </div>

                    {!apiKey ? (
                        <p>The GIPHY API key is missing from `.env.local`.</p>
                    ) : (
                        <>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search reactions, facepalms, disasters..."
                            />

                            <div className="gif-picker-grid">
                                <Grid
                                    key={searchTerm}
                                    width={520}
                                    columns={3}
                                    gutter={8}
                                    fetchGifs={fetchGifs}
                                    onGifClick={selectGif}
                                    noLink
                                />
                            </div>

                            <p className="giphy-attribution">Powered by GIPHY</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}