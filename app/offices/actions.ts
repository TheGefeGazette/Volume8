"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteEdition(formData: FormData) {
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
        .select("id, title, status")
        .eq("id", editionId)
        .single();

    if (lookupError || !edition) {
        redirect(
            `/offices?error=${encodeURIComponent(
                lookupError?.message ?? "Edition not found."
            )}`
        );
    }

    const { error: matchupsError } = await supabase
        .from("edition_matchups")
        .delete()
        .eq("edition_id", editionId);

    if (matchupsError) {
        redirect(
            `/offices?error=${encodeURIComponent(matchupsError.message)}`
        );
    }

    const { error: sectionsError } = await supabase
        .from("edition_sections")
        .delete()
        .eq("edition_id", editionId);

    if (sectionsError) {
        redirect(
            `/offices?error=${encodeURIComponent(sectionsError.message)}`
        );
    }

    const { error: deleteError } = await supabase
        .from("editions")
        .delete()
        .eq("id", editionId);

    if (deleteError) {
        redirect(
            `/offices?error=${encodeURIComponent(deleteError.message)}`
        );
    }

    revalidatePath("/offices");

    redirect(
        `/offices?success=${encodeURIComponent(
            `${edition.status === "draft" ? "Draft" : "Published edition"} deleted`
        )}`
    );
}

export async function copyEdition(formData: FormData) {
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

    const sourceEditionId = editionIdValue.trim();

    const { data: sourceEdition, error: editionError } = await supabase
        .from("editions")
        .select("title, subtitle")
        .eq("id", sourceEditionId)
        .single();

    if (editionError || !sourceEdition) {
        redirect(
            `/offices?error=${encodeURIComponent(
                editionError?.message ?? "Edition not found."
            )}`
        );
    }

    const { data: sourceSections, error: sectionsError } = await supabase
        .from("edition_sections")
        .select(
            "title, slug, section_type, body_html, sort_order"
        )
        .eq("edition_id", sourceEditionId)
        .order("sort_order", { ascending: true });

    if (sectionsError) {
        redirect(
            `/offices?error=${encodeURIComponent(sectionsError.message)}`
        );
    }

    const copiedTitle = `Copy of ${sourceEdition.title}`;

    const slugBase = copiedTitle
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const copiedSlug = `${slugBase || "copied-edition"}-${Date.now()}`;

    const { data: copiedEdition, error: copyError } = await supabase
        .from("editions")
        .insert({
            title: copiedTitle,
            subtitle: sourceEdition.subtitle ?? "",
            slug: copiedSlug,
            status: "draft",
        })
        .select("id")
        .single();

    if (copyError || !copiedEdition) {
        redirect(
            `/offices?error=${encodeURIComponent(
                copyError?.message ?? "Unable to copy edition."
            )}`
        );
    }

    if (sourceSections && sourceSections.length > 0) {
        const copiedSections = sourceSections.map((section) => ({
            edition_id: copiedEdition.id,
            title: section.title,
            slug: section.slug,
            section_type: section.section_type,
            body_html: section.body_html ?? "",
            sort_order: section.sort_order,
        }));

        const { error: sectionCopyError } = await supabase
            .from("edition_sections")
            .insert(copiedSections);

        if (sectionCopyError) {
            await supabase
                .from("editions")
                .delete()
                .eq("id", copiedEdition.id);

            redirect(
                `/offices?error=${encodeURIComponent(
                    sectionCopyError.message
                )}`
            );
        }
    }

    revalidatePath("/offices");

    redirect(
        `/offices/editions/new?edition=${copiedEdition.id}&success=Edition copied`
    );
}