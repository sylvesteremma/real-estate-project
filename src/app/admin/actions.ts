"use server";

import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validations";
import { clearAdminSession, setAdminSession, signInAdmin } from "@/lib/auth";

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const parsed = adminLoginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const admin = await signInAdmin(parsed.data.email, parsed.data.password);
  if (!admin) {
    return { error: "Invalid credentials or inactive account." };
  }

  await setAdminSession(admin);
  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
