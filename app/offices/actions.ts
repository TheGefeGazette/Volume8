"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteDraft(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    const editionIdValue = formData.get("editionId");

    if (typeof editionIdValue !== "string" || !editionIdValue.trim()) {
        redirect("/offices?error=Missing edition ID.");
    }

    const editionId = editionIdValue.trim();

    const { data: edition, error: lookupError } = await supabase
        .from("editions")
        .select("id, status")
        .eq("id", editionId)
        .single();

    if (lookupError || !edition) {
        redirect(
            `/offices?error=${encodeURIComponent(
                lookupError?.message ?? "Edition not found."
            )}`
        );
    }

    if (edition.status !== "draft") {
        redirect("/offices?error=Only draft editions can be deleted.");
    }

    const { error: deleteError } = await supabase
        .from("editions")
        .delete()
        .eq("id", editionId)
        .eq("status", "draft");

    if (deleteError) {
        redirect(
            `/offices?error=${encodeURIComponent(deleteError.message)}`
        );
    }

    revalidatePath("/offices");
    redirect("/offices?success=Draft deleted");
}