"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function TiptapTestEditor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: `
      <h2>Welcome to the Tiptap Test</h2>
      <p>This is a larger writing area for testing the future Gazette editor.</p>
      <p>Try typing, selecting text, and using the toolbar.</p>
    `,
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="tiptap-test-shell">
            <div className="tiptap-test-toolbar">
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