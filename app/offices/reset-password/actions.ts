"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
    const passwordValue = formData.get("password");
    const confirmPasswordValue = formData.get("confirmPassword");

    const password =
        typeof passwordValue === "string" ? passwordValue : "";

    const confirmPassword =
        typeof confirmPasswordValue === "string"
            ? confirmPasswordValue
            : "";

    if (password.length < 8) {
        redirect(
            `/offices/reset-password?error=${encodeURIComponent(
                "Password must be at least 8 characters."
            )}`
        );
    }

    if (password !== confirmPassword) {
        redirect(
            `/offices/reset-password?error=${encodeURIComponent(
                "Passwords do not match."
            )}`
        );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password,
    });

    if (error) {
        redirect(
            `/offices/reset-password?error=${encodeURIComponent(
                error.message
            )}`
        );
    }

    redirect(
        `/offices/login?success=${encodeURIComponent(
            "Password updated. Sign in with your new password."
        )}`
    );
}