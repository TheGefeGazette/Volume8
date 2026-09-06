"use client";

import { useEffect, useMemo, useState } from "react";
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
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedUrl, setSelectedUrl] = useState(initialUrl);

    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY ?? "";

    const giphy = useMemo(() => new GiphyFetch(apiKey), [apiKey]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim());
        }, 600);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const fetchGifs = (offset: number) => {
        return giphy.search(debouncedSearchTerm, {
            offset,
            limit: 12,
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

                    {!apiKey ? (
                        <p>The GIPHY API key is missing from `.env.local`.</p>
                    ) : (
                        <>
                            <div className="gif-picker-sticky-controls">
                                <div className="gif-picker-header">
                                    <div>
                                        <p className="eyebrow">Photo Desk</p>
                                        <h3>Search GIPHY</h3>
                                    </div>

                                    <button type="button" onClick={() => setIsOpen(false)}>
                                        Close
                                    </button>
                                </div>

                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                        }
                                    }}
                                    placeholder="Search reactions, facepalms, disasters..."
                                />
                            </div>


                            <div className="gif-picker-grid">
                                {debouncedSearchTerm ? (
                                    <Grid
                                        key={debouncedSearchTerm}
                                        width={820}
                                        columns={4}
                                        gutter={8}
                                        fetchGifs={fetchGifs}
                                        onGifClick={selectGif}
                                        noLink
                                    />
                                ) : (
                                    <p>Type a search above to find GIFs.</p>
                                )}
                            </div>

                            <p className="giphy-attribution">Powered by GIPHY</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}