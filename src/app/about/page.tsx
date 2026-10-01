import Link from "next/link";
import { company } from "@/lib/company";

const services = [
  "Property rental assistance",
  "Purchase and sales advisory",
  "Land acquisition guidance",
  "Viewing and negotiation support",
];

export default function AboutPage() {
  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            About us
          </p>
          <h1 className="mt-4 text-4xl font-bold text-[#0F2C59]">
            {company.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-700">
            We help clients discover trusted residential, commercial, and land
            opportunities with a dependable, client-first approach.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-[#0F2C59] p-8 text-white shadow-sm">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="mt-4 text-slate-200">
              To make property decisions easier, clearer, and more rewarding for
              families, investors, and businesses.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold text-[#0F2C59]">Our Services</h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              {services.map((service) => (
                <li key={service} className="flex items-center gap-3">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
          <h2 className="text-3xl font-bold text-[#0F2C59]">
            Why Choose {company.name}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              "Transparent guidance",
              "Wide range of listings",
              "Professional support",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[#F8F9FA] p-6 text-center"
              >
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#D4AF37]/20 text-xl text-[#0F2C59]">
                  ✓
                </div>
                <h3 className="font-semibold text-[#0F2C59]">{item}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-[#0F2C59] p-8 text-white md:p-12">
          <h2 className="text-3xl font-bold">Need help with a property?</h2>
          <p className="mt-4 max-w-2xl text-slate-200">
            Talk to our team about your rental, purchase, or land acquisition
            needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-[#0F2C59] transition hover:bg-white"
            >
              Contact Us
            </Link>
            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              WhatsApp Us
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
