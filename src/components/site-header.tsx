import Link from "next/link";
import { PhoneCall, MessageCircleMore, Menu } from "lucide-react";
import { company } from "@/lib/company";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/properties/rent", label: "Rent" },
  { href: "/properties/buy", label: "Buy" },
  { href: "/properties/land", label: "Land" },
  { href: "/taken-properties", label: "Taken Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F2C59] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37] bg-white/5 text-sm font-bold text-[#D4AF37]">
            B
          </div>
          <div>
            <div className="text-lg font-bold tracking-[0.08em]">
              BENNY HOMES
            </div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-slate-200">
              REALTY
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white transition hover:text-[#D4AF37]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={company.phoneUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            <PhoneCall size={16} /> Call Now
          </a>
          <a
            href={company.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0F2C59] transition hover:bg-white"
          >
            <MessageCircleMore size={16} /> WhatsApp
          </a>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
