"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveDraft(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    const editionIdValue = formData.get("editionId");
    const titleValue = formData.get("title");
    const subtitleValue = formData.get("subtitle");
    const welcomeBodyValue = formData.get("welcomeBody");

    const editionId =
        typeof editionIdValue === "string" ? editionIdValue.trim() : "";

    const title =
        typeof titleValue === "string" && titleValue.trim()
            ? titleValue.trim()
            : "Untitled Edition";

    const subtitle =
        typeof subtitleValue === "string" ? subtitleValue.trim() : "";

    const welcomeBody =
        typeof welcomeBodyValue === "string" ? welcomeBodyValue.trim() : "";

    if (editionId) {
        const { error } = await supabase
            .from("editions")
            .update({
                title,
                subtitle,
            })
            .eq("id", editionId);

        if (error) {
            redirect(
                `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                    error.message
                )}`
            );
        }
        const { data: existingWelcomeSection, error: sectionLookupError } =
            await supabase
                .from("edition_sections")
                .select("id")
                .eq("edition_id", editionId)
                .eq("slug", "welcome")
                .maybeSingle();

        if (sectionLookupError) {
            redirect(
                `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                    sectionLookupError.message
                )}`
            );
        }

        let sectionSaveError = null;

        if (existingWelcomeSection) {
            const { error } = await supabase
                .from("edition_sections")
                .update({
                    title: "Welcome",
                    body_html: welcomeBody,
                    sort_order: 0,
                })
                .eq("id", existingWelcomeSection.id);

            sectionSaveError = error;
        } else {
            const { error } = await supabase
                .from("edition_sections")
                .insert({
                    edition_id: editionId,
                    title: "Welcome",
                    slug: "welcome",
                    section_type: "article",
                    body_html: welcomeBody,
                    sort_order: 0,
                });

            sectionSaveError = error;
        }

        if (sectionSaveError) {
            redirect(
                `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                    sectionSaveError.message
                )}`
            );
        }

        redirect(
            `/offices/editions/new?edition=${editionId}&success=Draft updated`
        );
    }

    const slugBase = title
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const slug = `${slugBase || "untitled-edition"}-${Date.now()}`;

    const { data, error } = await supabase
        .from("editions")
        .insert({
            title,
            subtitle,
            slug,
            status: "draft",
        })
        .select("id")
        .single();

    if (error) {
        redirect(
            `/offices/editions/new?error=${encodeURIComponent(error.message)}`
        );
    }

    const { error: welcomeSectionError } = await supabase
        .from("edition_sections")
        .insert({
            edition_id: data.id,
            title: "Welcome",
            slug: "welcome",
            section_type: "article",
            body_html: welcomeBody,
            sort_order: 0,
        });

    if (welcomeSectionError) {
        redirect(
            `/offices/editions/new?edition=${data.id}&error=${encodeURIComponent(
                welcomeSectionError.message
            )}`
        );
    }

    redirect(
        `/offices/editions/new?edition=${data.id}&success=Draft saved`
    );
}