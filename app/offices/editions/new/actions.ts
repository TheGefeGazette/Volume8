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

    async function saveCustomSections(targetEditionId: string) {
        const customBodyEntries = Array.from(formData.entries()).filter(
            ([key]) => key.startsWith("customBody:")
        );

        for (const [key, value] of customBodyEntries) {
            const sectionSlug = key.replace("customBody:", "");

            if (!sectionSlug) {
                continue;
            }

            const sectionBody =
                typeof value === "string" ? value.trim() : "";

            const gifValue = formData.get(`gifUrl:${sectionSlug}`);

            const gifUrl =
                typeof gifValue === "string" ? gifValue.trim() : "";

            const { error: updateError } = await supabase
                .from("edition_sections")
                .update({
                    body_html: sectionBody,
                    gif_url: gifUrl,
                })
                .eq("edition_id", targetEditionId)
                .eq("slug", sectionSlug)
                .eq("section_type", "custom");

            if (updateError) {
                return updateError;
            }
        }

        return null;
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

        const customSectionSaveError = await saveCustomSections(editionId);

        if (customSectionSaveError) {
            redirect(
                `/offices/editions/new?edition=${editionId}&section=${encodeURIComponent(
                    activeSection
                )}&error=${encodeURIComponent(
                    customSectionSaveError.message
                )}`
            );
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

export async function addStory(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    const editionIdValue = formData.get("editionId");
    const storyTitleValue = formData.get("storyTitle");

    const editionId =
        typeof editionIdValue === "string" ? editionIdValue.trim() : "";

    const storyTitle =
        typeof storyTitleValue === "string" ? storyTitleValue.trim() : "";

    if (!editionId) {
        redirect(
            `/offices/editions/new?error=${encodeURIComponent(
                "Save the edition before adding a story."
            )}`
        );
    }

    if (!storyTitle) {
        redirect(
            `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                "Give the new story a title."
            )}`
        );
    }

    const slugBase = storyTitle
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const storySlug = `${slugBase || "new-story"}-${Date.now()}`;

    const { data: existingSections, error: lookupError } = await supabase
        .from("edition_sections")
        .select("sort_order")
        .eq("edition_id", editionId)
        .order("sort_order", { ascending: false })
        .limit(1);

    if (lookupError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                lookupError.message
            )}`
        );
    }

    const highestSortOrder =
        existingSections?.[0]?.sort_order ?? editionSections.length - 1;

    const { error: insertError } = await supabase
        .from("edition_sections")
        .insert({
            edition_id: editionId,
            title: storyTitle,
            slug: storySlug,
            section_type: "custom",
            body_html: "",
            gif_url: "",
            sort_order: highestSortOrder + 1,
        });

    if (insertError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                insertError.message
            )}`
        );
    }

    redirect(
        `/offices/editions/new?edition=${editionId}&section=${encodeURIComponent(
            storySlug
        )}&success=${encodeURIComponent("Story added")}`
    );
}