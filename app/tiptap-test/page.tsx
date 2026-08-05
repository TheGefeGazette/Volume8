import { TiptapTestEditor } from "@/components/tiptap-test-editor";

export default function TiptapTestPage() {
    return (
        <main className="tiptap-test-page">
            <h1>Tiptap Editor Test</h1>

            <p>
                This page is only for testing. It does not affect the Gazette editor.
            </p>

            <TiptapTestEditor />
        </main>
    );
}