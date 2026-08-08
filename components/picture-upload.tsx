"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PictureUploadProps = {
    onPictureUploaded: (imageUrl: string) => void;
};

export function PictureUpload({
    onPictureUploaded,
}: PictureUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function uploadPicture(file: File) {
        setUploading(true);
        setErrorMessage("");

        const supabase = createClient();

        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${crypto.randomUUID()}.${extension}`;

        const filePath = `gazette-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("gazette-published")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type,
            });

        if (uploadError) {
            setErrorMessage(uploadError.message);
            setUploading(false);
            return;
        }

        const { data } = supabase.storage
            .from("gazette-published")
            .getPublicUrl(filePath);

        onPictureUploaded(data.publicUrl);

        setUploading(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className="picture-upload">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                        void uploadPicture(file);
                    }
                }}
            />

            <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
            >
                {uploading ? "Uploading..." : "Picture"}
            </button>

            {errorMessage && (
                <p className="picture-upload-error">
                    Upload failed: {errorMessage}
                </p>
            )}
        </div>
    );
}