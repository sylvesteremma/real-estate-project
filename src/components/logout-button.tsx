"use client";

import { logoutAdmin } from "@/app/admin/actions";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => logoutAdmin()}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0F2C59] hover:text-[#0F2C59]"
    >
      Logout
    </button>
  );
}
