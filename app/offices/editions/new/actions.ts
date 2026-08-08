"use server";

import { editionSections } from "@/lib/gazette/edition-sections";
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

    const activeSectionValue = formData.get("activeSection");
    const editionIdValue = formData.get("editionId");
    const titleValue = formData.get("title");
    const subtitleValue = formData.get("subtitle");
    const activeSection =
        typeof activeSectionValue === "string" && activeSectionValue.trim()
            ? activeSectionValue.trim()
            : "welcome";

    const actionValue = formData.get("action");
    const isPublishing = actionValue === "publish";

    const editionId =
        typeof editionIdValue === "string" ? editionIdValue.trim() : "";

    const title =
        typeof titleValue === "string" && titleValue.trim()
            ? titleValue.trim()
            : "Untitled Edition";

    const subtitle =
        typeof subtitleValue === "string" ? subtitleValue.trim() : "";

    const sectionBodies: Record<string, string> = {};
    const sectionGifUrls: Record<string, string> = {};

    for (const section of editionSections) {
        const bodyValue = formData.get(section.fieldName);
        const gifValue = formData.get(`gifUrl:${section.slug}`);

        sectionBodies[section.slug] =
            typeof bodyValue === "string" ? bodyValue.trim() : "";

        sectionGifUrls[section.slug] =
            typeof gifValue === "string" ? gifValue.trim() : "";
    }

    async function saveSection(
        targetEditionId: string,
        sectionSlug: string,
        sectionTitle: string,
        sectionBody: string,
        gifUrl: string,
        sortOrder: number
    ) {
        const { data: existingSection, error: lookupError } = await supabase
            .from("edition_sections")
            .select("id")
            .eq("edition_id", targetEditionId)
            .eq("slug", sectionSlug)
            .maybeSingle();

        if (lookupError) {
            return lookupError;
        }

        if (existingSection) {
            const { error: updateError } = await supabase
                .from("edition_sections")
                .update({
                    title: sectionTitle,
                    body_html: sectionBody,
                    gif_url: gifUrl,
                    sort_order: sortOrder,
                })
                .eq("id", existingSection.id);

            return updateError;
        }

        const { error: insertError } = await supabase
            .from("edition_sections")
            .insert({
                edition_id: targetEditionId,
                title: sectionTitle,
                slug: sectionSlug,
                section_type: "article",
                body_html: sectionBody,
                gif_url: gifUrl,
                sort_order: sortOrder,
            });

        return insertError;
    }

    if (editionId) {
        const { error } = await supabase
            .from("editions")
            .update({
                title,
                subtitle,
                status: isPublishing ? "published" : "draft",
            })
            .eq("id", editionId);

        if (error) {
            redirect(
                `/offices/editions/new?edition=${editionId}&section=${encodeURIComponent(
                    activeSection
                )}&error=${encodeURIComponent(error.message)}`
            );
        }

        for (const section of editionSections) {
            const sectionSaveError = await saveSection(
                editionId,
                section.slug,
                section.title,
                sectionBodies[section.slug],
                sectionGifUrls[section.slug],
                section.sortOrder
            );

            if (sectionSaveError) {
                redirect(
                    `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                        sectionSaveError.message
                    )}`
                );
            }
        }

        redirect(
            `/offices/editions/new?edition=${editionId}&section=${encodeURIComponent(
                activeSection
            )}&success=${encodeURIComponent(
                isPublishing ? "Edition published" : "Draft updated"
            )}`
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
            status: isPublishing ? "published" : "draft",
        })
        .select("id")
        .single();

    if (error) {
        redirect(
            `/offices/editions/new?error=${encodeURIComponent(error.message)}`
        );
    }

    for (const section of editionSections) {
        const sectionSaveError = await saveSection(
            data.id,
            section.slug,
            section.title,
            sectionBodies[section.slug],
            sectionGifUrls[section.slug],
            section.sortOrder
        );

        if (sectionSaveError) {
            redirect(
                `/offices/editions/new?edition=${data.id}&error=${encodeURIComponent(
                    sectionSaveError.message
                )}`
            );
        }
    }

    redirect(
        `/offices/editions/new?edition=${data.id}&section=${encodeURIComponent(
            activeSection
        )}&success=${encodeURIComponent(
            isPublishing ? "Edition published" : "Draft saved"
        )}`
    );
}   