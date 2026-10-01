import { company } from "@/lib/company";

export default function ContactPage() {
  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#0F2C59]">
            Talk to {company.name}
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-3xl bg-[#0F2C59] p-8 text-white shadow-sm">
            <h2 className="text-2xl font-bold">Reach us</h2>
            <div className="mt-8 space-y-6 text-slate-200">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                  Phone
                </p>
                <a
                  href={company.phoneUrl}
                  className="mt-2 block text-lg font-medium text-white"
                >
                  {company.phone}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                  WhatsApp
                </p>
                <a
                  href={company.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-lg font-medium text-white"
                >
                  {company.whatsapp}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                  Email
                </p>
                <a
                  href={`mailto:${company.email}`}
                  className="mt-2 block text-lg font-medium text-white"
                >
                  {company.email}
                </a>
              </div>
            </div>
          </div>

          <form className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0F2C59]"
                  placeholder="Your name"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0F2C59]"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Phone
                <input
                  type="tel"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0F2C59]"
                  placeholder="0803..."
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Subject
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0F2C59]"
                  placeholder="How can we help?"
                />
              </label>
            </div>

            <label className="mt-5 block text-sm font-medium text-slate-700">
              Message
              <textarea
                rows={5}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0F2C59]"
                placeholder="Tell us what you need"
              />
            </label>

            <button
              type="submit"
              className="mt-6 inline-flex rounded-full bg-[#0F2C59] px-6 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
