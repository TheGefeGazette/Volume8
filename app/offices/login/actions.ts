"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const email =
    typeof emailValue === "string" ? emailValue.trim() : "";

  const password =
    typeof passwordValue === "string" ? passwordValue : "";
  if (!email || !password) {
    redirect("/offices/login?error=Please enter an email and password.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/offices/login?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect("/offices");
}

export async function sendPasswordReset(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    redirect(
      `/offices/login?error=${encodeURIComponent(
        "Please enter your email address."
      )}`
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      "https://volume8.vercel.app/offices/reset-password",
  });

  if (error) {
    redirect(
      `/offices/login?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(
    `/offices/login?success=${encodeURIComponent(
      "Password reset email sent."
    )}`
  );
}