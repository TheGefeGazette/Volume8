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
    const chrisCornerBodyValue = formData.get("chrisCornerBody");
    const boneheadBenchingBodyValue = formData.get("boneheadBenchingBody");

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

    const chrisCornerBody =
        typeof chrisCornerBodyValue === "string"
            ? chrisCornerBodyValue.trim()
            : "";
            
    const boneheadBenchingBody =
        typeof boneheadBenchingBodyValue === "string"
            ? boneheadBenchingBodyValue.trim()
            : "";

    const sectionDefinitions = [
        {
            slug: "welcome",
            title: "Welcome",
            body: welcomeBody,
            sortOrder: 0,
        },
        {
            slug: "chris-corner",
            title: "Chris' Corner",
            body: chrisCornerBody,
            sortOrder: 1,
        },
        {
            slug: "bonehead-benching",
            title: "Bonehead Benching of the Week",
            body: boneheadBenchingBody,
            sortOrder: 2,
        },
    ];

    async function saveSection(
        targetEditionId: string,
        sectionSlug: string,
        sectionTitle: string,
        sectionBody: string,
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
            })
            .eq("id", editionId);

        if (error) {
            redirect(
                `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                    error.message
                )}`
            );
        }
        for (const section of sectionDefinitions) {
            const sectionSaveError = await saveSection(
                editionId,
                section.slug,
                section.title,
                section.body,
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

    for (const section of sectionDefinitions) {
        const sectionSaveError = await saveSection(
            data.id,
            section.slug,
            section.title,
            section.body,
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
        `/offices/editions/new?edition=${data.id}&success=Draft saved`
    );
}