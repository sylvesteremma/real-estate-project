"use client";

import { useState, useTransition } from "react";
import { UserPlus } from "lucide-react";

export function AdminUserManager() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function createAdmin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        const response = await fetch("/api/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(formData.get("name") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
            password: String(formData.get("password") ?? ""),
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Administrator could not be created.");
        }

        form.reset();
        setMessage(`Administrator ${result.admin.email} created.`);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Administrator could not be created.",
        );
      }
    });
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0F2C59]">
          Administrator access
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Create a standard admin account. Only super admins can do this.
        </p>
      </div>
      <form
        onSubmit={createAdmin}
        className="grid gap-4 border-y border-slate-200 py-6 md:grid-cols-3"
      >
        <label className="text-sm font-medium text-slate-700">
          Name
          <input
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Temporary password
          <input
            name="password"
            type="password"
            required
            minLength={12}
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 md:col-span-3">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            <UserPlus size={17} />
            {isPending ? "Creating..." : "Create admin"}
          </button>
          {message ? (
            <p role="status" className="text-sm text-slate-700">
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}