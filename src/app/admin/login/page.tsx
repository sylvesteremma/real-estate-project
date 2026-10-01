import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F9FA] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            Admin access
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#0F2C59]">Login</h1>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link
            href="/"
            className="font-medium text-[#0F2C59] hover:text-[#D4AF37]"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
