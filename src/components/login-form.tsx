"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "@/app/admin/actions";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await loginAdmin(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#0F2C59]"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#0F2C59]"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#0F2C59] px-6 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
