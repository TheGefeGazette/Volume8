import { NewspaperFold } from "@/components/newspaper-fold";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: latestEdition } = await supabase
    .from("editions")
    .select(
      "title, subtitle, slug, publication_date, volume_number, issue_number"
    )
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const homepageEdition = latestEdition ?? {
    title: "No Edition Published Yet",
    subtitle: "The presses are waiting for fresh copy.",
    slug: "",
    publication_date: null,
    volume_number: null,
    issue_number: null,
  };

  return (
    <main>
      <NewspaperFold latestEdition={homepageEdition} />
    </main>
  );
}