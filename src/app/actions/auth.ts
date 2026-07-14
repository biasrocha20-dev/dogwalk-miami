"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const SignupSchema = z.object({
  fullName: z.string().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Enter a valid email." }),
  password: z.string().min(8, { error: "Password must be at least 8 characters." }),
  role: z.enum(["owner", "walker"], { error: "Choose an account type." }),
});

export type AuthFormState = { error?: string; checkEmail?: boolean } | undefined;

export async function signup(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { fullName, email, password, role } = parsed.data;
  const supabase = await createClient();

  // profiles/walker_profiles rows are created by the on_auth_user_created
  // trigger (SECURITY DEFINER), since no session exists yet if email
  // confirmation is required.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role } },
  });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account. Try again." };

  if (!data.session) {
    return { checkEmail: true };
  }

  redirect(role === "walker" ? "/walker/onboarding" : "/owner/pets");
}

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email." }),
  password: z.string().min(1, { error: "Password is required." }),
});

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(profile?.role === "walker" ? "/walker/dashboard" : "/owner/pets");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
