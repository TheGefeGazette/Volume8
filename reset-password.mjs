import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const userId = process.env.RESET_USER_ID;
const newPassword = process.env.RESET_NEW_PASSWORD;

if (!supabaseUrl || !supabaseSecretKey || !userId || !newPassword) {
    throw new Error("Missing required environment variables.");
}

const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    {
        password: newPassword,
    }
);

if (error) {
    console.error("Password reset failed:", error.message);
    process.exit(1);
}

console.log("Password reset succeeded for:", data.user.email);