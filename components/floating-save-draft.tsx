"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveDraft } from "@/app/offices/editions/new/actions";

export function FloatingSaveDraft() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleSave(
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        event.preventDefault();

        const form = event.currentTarget.form;

        if (!form) {
            return;
        }

        const formData = new FormData(form);
        const scrollPosition = window.scrollY;

        startTransition(async () => {
            await saveDraft(formData);

            router.refresh();

            setTimeout(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: "auto",
                });
            }, 50);
        });
    }

    return (
        <button
            type="button"
            className="office-primary floating-save-draft"
            onClick={handleSave}
            disabled={isPending}
        >
            {isPending ? "Saving..." : "Save Draft"}
        </button>
    );
}