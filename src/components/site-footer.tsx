import Link from "next/link";
import { company } from "@/lib/company";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/properties/rent", label: "Rent" },
  { href: "/properties/buy", label: "Buy" },
  { href: "/properties/land", label: "Land" },
  { href: "/taken-properties", label: "Taken Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#0F2C59] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 text-2xl font-bold tracking-wide">
              {company.name}
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-200">
              {company.shortDescription}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#D4AF37]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-slate-200">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-[#D4AF37]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#D4AF37]">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>
                <a href={company.phoneUrl}>{company.phone}</a>
              </li>
              <li>
                <a href={company.whatsappUrl} target="_blank" rel="noreferrer">
                  {company.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-200">
          Copyright © {new Date().getFullYear()} {company.name}
        </div>
      </div>
    </footer>
  );
}
