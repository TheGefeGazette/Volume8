import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const noUserSignedIn =
    error?.message.toLowerCase().includes("session") ?? false;

  const connectionWorked = !error || noUserSignedIn;

  return (
    <main
  style={{
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    color: "white",
    backgroundColor: "black",
    minHeight: "100vh",
  }}
>
      <h1>Supabase Connection Test</h1>

      {connectionWorked ? (
        <>
          <h2>Connection successful</h2>
          <p>The Gefe Gazette received a response from Supabase.</p>
          <p>
            Current user:{" "}
            <strong>{data.user?.email ?? "No user signed in yet"}</strong>
          </p>
        </>
      ) : (
        <>
          <h2>Connection failed</h2>
          <p>{error.message}</p>
        </>
      )}
    </main>
  );
}