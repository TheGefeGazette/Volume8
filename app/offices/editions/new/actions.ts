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

    async function saveMatchups(targetEditionId: string) {
        const matchupIdEntries = Array.from(formData.entries()).filter(
            ([key]) => key.startsWith("matchupId:")
        );

        for (const [key, value] of matchupIdEntries) {
            const matchupId = key.replace("matchupId:", "");

            if (!matchupId || typeof value !== "string") {
                continue;
            }

            const winnerValue = formData.get(`matchupWinner:${matchupId}`);
            const loserValue = formData.get(`matchupLoser:${matchupId}`);
            const winnerScoreValue = formData.get(
                `matchupWinnerScore:${matchupId}`
            );
            const loserScoreValue = formData.get(
                `matchupLoserScore:${matchupId}`
            );
            const headlineValue = formData.get(
                `matchupHeadline:${matchupId}`
            );
            const bodyValue = formData.get(`matchupBody:${matchupId}`);

            const winner =
                typeof winnerValue === "string" ? winnerValue.trim() : "";

            const loser =
                typeof loserValue === "string" ? loserValue.trim() : "";

            const headline =
                typeof headlineValue === "string"
                    ? headlineValue.trim()
                    : "";

            const bodyHtml =
                typeof bodyValue === "string" ? bodyValue.trim() : "";

            const winnerScore =
                typeof winnerScoreValue === "string" &&
                    winnerScoreValue.trim() !== ""
                    ? Number(winnerScoreValue)
                    : null;

            const loserScore =
                typeof loserScoreValue === "string" &&
                    loserScoreValue.trim() !== ""
                    ? Number(loserScoreValue)
                    : null;

            const { error: updateError } = await supabase
                .from("edition_matchups")
                .update({
                    winner,
                    loser,
                    winner_score: winnerScore,
                    loser_score: loserScore,
                    headline,
                    body_html: bodyHtml,
                })
                .eq("id", matchupId)
                .eq("edition_id", targetEditionId);

            if (updateError) {
                return updateError;
            }
        }

        return null;
    }

    async function savePicks(targetEditionId: string) {
        const favoriteEntries = Array.from(formData.entries()).filter(
            ([key]) => key.startsWith("pickFavorite:")
        );

        for (const [key] of favoriteEntries) {
            const pickId = key.replace("pickFavorite:", "");

            if (!pickId) {
                continue;
            }

            const favoriteValue = formData.get(`pickFavorite:${pickId}`);
            const jokeValue = formData.get(`pickJoke:${pickId}`);
            const underdogValue = formData.get(`pickUnderdog:${pickId}`);

            const favorite =
                typeof favoriteValue === "string"
                    ? favoriteValue.trim()
                    : "";

            const jokeText =
                typeof jokeValue === "string"
                    ? jokeValue.trim()
                    : "";

            const underdog =
                typeof underdogValue === "string"
                    ? underdogValue.trim()
                    : "";

            const { error: updateError } = await supabase
                .from("edition_picks")
                .update({
                    favorite,
                    joke_text: jokeText,
                    underdog,
                })
                .eq("id", pickId)
                .eq("edition_id", targetEditionId);

            if (updateError) {
                return updateError;
            }
        }

        return null;
    }

    async function saveBoneheadRecipient(targetEditionId: string) {
        const recipientValue = formData.get("boneheadRecipient");

        const recipient =
            typeof recipientValue === "string"
                ? recipientValue.trim()
                : "";

        const { data: existingBonehead, error: lookupError } = await supabase
            .from("edition_boneheads")
            .select("id")
            .eq("edition_id", targetEditionId)
            .maybeSingle();

        if (lookupError) {
            return lookupError;
        }

        if (existingBonehead) {
            const { error: updateError } = await supabase
                .from("edition_boneheads")
                .update({
                    recipient,
                })
                .eq("id", existingBonehead.id);

            return updateError;
        }

        const { error: insertError } = await supabase
            .from("edition_boneheads")
            .insert({
                edition_id: targetEditionId,
                recipient,
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

        const matchupSaveError = await saveMatchups(editionId);

        if (matchupSaveError) {
            redirect(
                `/offices/editions/new?edition=${editionId}&section=matchups&error=${encodeURIComponent(
                    matchupSaveError.message
                )}`
            );
        }

        const picksSaveError = await savePicks(editionId);

        if (picksSaveError) {
            redirect(
                `/offices/editions/new?edition=${editionId}&section=next-weeks-picks&error=${encodeURIComponent(
                    picksSaveError.message
                )}`
            );
        }

        const boneheadSaveError = await saveBoneheadRecipient(editionId);

        if (boneheadSaveError) {
            redirect(
                `/offices/editions/new?edition=${editionId}&section=bonehead-benching&error=${encodeURIComponent(
                    boneheadSaveError.message
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

export async function addMatchup(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    const editionIdValue = formData.get("editionId");

    const editionId =
        typeof editionIdValue === "string" ? editionIdValue.trim() : "";

    if (!editionId) {
        redirect(
            `/offices/editions/new?error=${encodeURIComponent(
                "Save the edition before adding a matchup."
            )}`
        );
    }

    const { data: existingMatchups, error: lookupError } = await supabase
        .from("edition_matchups")
        .select("sort_order")
        .eq("edition_id", editionId)
        .order("sort_order", { ascending: false })
        .limit(1);

    if (lookupError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=matchups&error=${encodeURIComponent(
                lookupError.message
            )}`
        );
    }

    const highestSortOrder =
        existingMatchups?.[0]?.sort_order ?? -1;

    const { error: insertError } = await supabase
        .from("edition_matchups")
        .insert({
            edition_id: editionId,
            winner: "",
            loser: "",
            winner_score: null,
            loser_score: null,
            headline: "",
            body_html: "",
            sort_order: highestSortOrder + 1,
        });

    if (insertError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=matchups&error=${encodeURIComponent(
                insertError.message
            )}`
        );
    }

    redirect(
        `/offices/editions/new?edition=${editionId}&section=matchups&success=${encodeURIComponent(
            "Matchup added"
        )}`
    );
}

export async function deleteMatchup(
    editionId: string,
    matchupId: string,
    formData: FormData
) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    if (!editionId || !matchupId) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=matchups&error=${encodeURIComponent(
                "We could not identify the matchup to delete."
            )}`
        );
    }

    const { error: deleteError } = await supabase
        .from("edition_matchups")
        .delete()
        .eq("id", matchupId)
        .eq("edition_id", editionId);

    if (deleteError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=matchups&error=${encodeURIComponent(
                deleteError.message
            )}`
        );
    }

    redirect(
        `/offices/editions/new?edition=${editionId}&section=matchups&success=${encodeURIComponent(
            "Matchup deleted"
        )}`
    );
}

export async function addPick(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    const editionIdValue = formData.get("editionId");

    const editionId =
        typeof editionIdValue === "string" ? editionIdValue.trim() : "";

    if (!editionId) {
        redirect(
            `/offices/editions/new?error=${encodeURIComponent(
                "Save the edition before adding a pick."
            )}`
        );
    }

    const { data: existingPicks, error: lookupError } = await supabase
        .from("edition_picks")
        .select("sort_order")
        .eq("edition_id", editionId)
        .order("sort_order", { ascending: false })
        .limit(1);

    if (lookupError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=next-weeks-picks&error=${encodeURIComponent(
                lookupError.message
            )}`
        );
    }

    const highestSortOrder =
        existingPicks?.[0]?.sort_order ?? -1;

    const { error: insertError } = await supabase
        .from("edition_picks")
        .insert({
            edition_id: editionId,
            favorite: "",
            joke_text: "",
            underdog: "",
            sort_order: highestSortOrder + 1,
        });

    if (insertError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=next-weeks-picks&error=${encodeURIComponent(
                insertError.message
            )}`
        );
    }

    redirect(
        `/offices/editions/new?edition=${editionId}&section=next-weeks-picks&success=${encodeURIComponent(
            "Pick added"
        )}`
    );
}

export async function deletePick(
    editionId: string,
    pickId: number,
    formData: FormData
) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    if (!editionId || !pickId) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=next-weeks-picks&error=${encodeURIComponent(
                "We could not identify the pick to delete."
            )}`
        );
    }

    const { error: deleteError } = await supabase
        .from("edition_picks")
        .delete()
        .eq("id", pickId)
        .eq("edition_id", editionId);

    if (deleteError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=next-weeks-picks&error=${encodeURIComponent(
                deleteError.message
            )}`
        );
    }

    redirect(
        `/offices/editions/new?edition=${editionId}&section=next-weeks-picks&success=${encodeURIComponent(
            "Pick deleted"
        )}`
    );
}

export async function deleteStory(
    editionId: string,
    storySlug: string,
    formData: FormData
) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/offices/login");
    }

    if (!editionId || !storySlug) {
        redirect(
            `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                "We could not identify the story to delete."
            )}`
        );
    }

    const { error: deleteError } = await supabase
        .from("edition_sections")
        .delete()
        .eq("edition_id", editionId)
        .eq("slug", storySlug)
        .eq("section_type", "custom");

    if (deleteError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&section=${encodeURIComponent(
                storySlug
            )}&error=${encodeURIComponent(deleteError.message)}`
        );
    }

    redirect(
        `/offices/editions/new?edition=${editionId}&section=welcome&success=${encodeURIComponent(
            "Story deleted"
        )}`
    );
}

export async function deleteEdition(editionId: string) {
    if (!editionId) {
        redirect(
            `/offices/editions/new?error=${encodeURIComponent(
                "We could not identify the edition to delete."
            )}`
        );
    }

    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect(
            `/offices/login?error=${encodeURIComponent(
                "You must be signed in to delete an edition."
            )}`
        );
    }

    const { error: matchupsError } = await supabase
        .from("edition_matchups")
        .delete()
        .eq("edition_id", editionId);

    if (matchupsError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                matchupsError.message
            )}`
        );
    }

    const { error: sectionsError } = await supabase
        .from("edition_sections")
        .delete()
        .eq("edition_id", editionId);

    if (sectionsError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                sectionsError.message
            )}`
        );
    }

    const { error: editionError } = await supabase
        .from("editions")
        .delete()
        .eq("id", editionId);

    if (editionError) {
        redirect(
            `/offices/editions/new?edition=${editionId}&error=${encodeURIComponent(
                editionError.message
            )}`
        );
    }

    redirect(
        `/offices/editions/new?success=${encodeURIComponent("Edition deleted")}`
    );
}

