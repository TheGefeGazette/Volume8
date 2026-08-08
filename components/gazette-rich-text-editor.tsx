"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { GifPicker } from "@/components/gif-picker";
import { PictureUpload } from "@/components/picture-upload";

type GazetteRichTextEditorProps = {
    fieldName: string;
    initialContent?: string;
};

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function prepareInitialContent(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return "<p></p>";
    }

    // Existing Gazette sections are currently stored as plain text.
    // Once a section has been saved through Tiptap, it will already contain HTML.
    if (trimmedValue.startsWith("<")) {
        return trimmedValue;
    }

    return trimmedValue
        .split(/\n\s*\n/)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
        .join("");
}

export function GazetteRichTextEditor({
    fieldName,
    initialContent = "",
}: GazetteRichTextEditorProps) {
    const preparedContent = prepareInitialContent(initialContent);
    const [html, setHtml] = useState(preparedContent);
    const savedCursorPosition = useRef(1);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
        ],
        content: preparedContent,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setHtml(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="gazette-rich-editor">
            <input
                type="hidden"
                name={fieldName}
                value={html}
                readOnly
            />

            <div className="gazette-rich-toolbar">
                <button
                    type="button"
                    className={editor.isActive("bold") ? "is-active" : ""}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    Bold
                </button>

                <button
                    type="button"
                    className={editor.isActive("italic") ? "is-active" : ""}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    Italic
                </button>

                <button
                    type="button"
                    className={
                        editor.isActive("heading", { level: 2 }) ? "is-active" : ""
                    }
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    Heading
                </button>

                <div
                    onMouseDown={() => {
                        savedCursorPosition.current = editor.state.selection.from;
                    }}
                >
                    <GifPicker
                        onSelectGif={(gifUrl) => {
                            editor
                                .chain()
                                .focus()
                                .setTextSelection(savedCursorPosition.current)
                                .setImage({
                                    src: gifUrl,
                                    alt: "Gazette GIF punchline",
                                })
                                .run();
                        }}
                    />
                </div>
                <div
                    onMouseDown={() => {
                        savedCursorPosition.current = editor.state.selection.from;
                    }}
                >
                    <PictureUpload
                        onPictureUploaded={(imageUrl) => {
                            editor
                                .chain()
                                .focus()
                                .setTextSelection(savedCursorPosition.current)
                                .setImage({
                                    src: imageUrl,
                                    alt: "Gazette picture",
                                })
                                .run();
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    Divider
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    Undo
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    Redo
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}