import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  PhoneCall,
  MessageCircleMore,
  Home,
  Landmark,
} from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { getPublishedProperties } from "@/lib/property-listings";
import { company } from "@/lib/company";

const categoryCards = [
  {
    title: "Rent",
    href: "/properties/rent",
    description: "Modern apartments, duplexes, and homes for flexible living.",
  },
  {
    title: "Buy Property",
    href: "/properties/buy",
    description:
      "Premium homes and commercial opportunities in great locations.",
  },
  {
    title: "Buy Land",
    href: "/properties/land",
    description:
      "Strategic plots for residential, agricultural, and industrial use.",
  },
];

export default async function HomePage() {
  const publishedProperties = await getPublishedProperties();
  const availableProperties = publishedProperties.filter(
    (property) => property.status === "AVAILABLE",
  );
  const featuredProperties = availableProperties.filter(
    (property) => property.featured,
  );
  const takenProperties = publishedProperties.filter(
    (property) => property.status === "TAKEN",
  );

  return (
    <main>
      <section className="bg-[#0F2C59] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Trusted property partner
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Find Your Perfect Property With {company.name}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              Helping clients rent, buy, and invest in properties across prime
              Nigerian locations with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-[#0F2C59] transition hover:bg-white"
              >
                View Properties <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Contact Us
              </Link>
              <a
                href={company.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <MessageCircleMore size={18} /> WhatsApp Us
              </a>
            </div>

            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-[#D4AF37]">
                  {availableProperties.length}
                </div>
                <div className="mt-1 text-sm text-slate-200">
                  Active listings
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-[#D4AF37]">98%</div>
                <div className="mt-1 text-sm text-slate-200">
                  Client satisfaction
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-[#D4AF37]">24/7</div>
                <div className="mt-1 text-sm text-slate-200">Support</div>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
            <div className="relative h-110 overflow-hidden rounded-3xl">
              {featuredProperties[0]?.image ? (
                <Image
                  src={featuredProperties[0].image}
                  alt={featuredProperties[0].title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#143765] text-center text-lg font-semibold text-white/75">
                  New listings will appear here
                </div>
              )}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Home size={16} /> Rent
                </div>
                <div className="mt-2 text-xl font-semibold">
                  Apartments & homes
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Landmark size={16} /> Buy
                </div>
                <div className="mt-2 text-xl font-semibold">
                  Plots & estates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FA] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-5">
              <input
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-[#0F2C59]"
                placeholder="Location"
              />
              <input
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-[#0F2C59]"
                placeholder="Keyword"
              />
              <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-[#0F2C59]">
                <option value="">Category</option>
                <option value="RENT">Rent</option>
                <option value="BUY PROPERTY">Buy</option>
                <option value="BUY LAND">Land</option>
              </select>
              <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-[#0F2C59]">
                <option value="">Price range</option>
                <option value="5000000">₦5m+</option>
                <option value="20000000">₦20m+</option>
              </select>
              <button className="rounded-xl bg-[#0F2C59] px-5 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FA] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                Available
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#0F2C59] sm:text-4xl">
                Available Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2C59] transition hover:text-[#D4AF37]"
            >
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>
          {availableProperties.length === 0 ? (
            <p className="text-slate-600">
              No properties have been listed yet.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {availableProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2C59] sm:text-4xl">
              Featured Properties
            </h2>
          </div>
          {featuredProperties.length === 0 ? (
            <p className="text-slate-600">No featured properties right now.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featuredProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F8F9FA] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Find by need
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2C59] sm:text-4xl">
              Property Categories
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {categoryCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#0F2C59]">
                  <Building2 size={20} />
                </div>
                <h3 className="text-2xl font-bold text-[#0F2C59]">
                  {card.title}
                </h3>
                <p className="mt-3 text-slate-600">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0F2C59] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Recently sold
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Properties Already Taken
            </h2>
          </div>
          {takenProperties.length === 0 ? (
            <p className="text-slate-200">No taken properties are listed.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {takenProperties.slice(0, 3).map((property) => (
                <div
                  key={property.slug}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                >
                  <div className="relative h-52">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F2C59]">
                      TAKEN
                    </span>
                    <h3 className="mt-4 text-2xl font-bold text-white">
                      {property.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-slate-200">
                      <MapPin size={14} /> {property.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F8F9FA] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Why choose us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0F2C59] sm:text-4xl">
              Why Choose {company.name}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Trusted guidance",
                text: "We help clients navigate buying, renting, and land opportunities with clarity.",
              },
              {
                title: "Market knowledge",
                text: "Our team understands location, pricing, and investment potential across key areas.",
              },
              {
                title: "Tailored support",
                text: "From viewing to paperwork, we keep every step relevant to your goals.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#0F2C59]">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-2xl font-bold text-[#0F2C59]">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              About us
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#0F2C59] sm:text-4xl">
              Professional real estate services, built for your next move.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              {company.name} is dedicated to helping clients secure the right
              property for their lifestyle, business, or long-term investment
              goals.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0F2C59] px-6 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]"
            >
              Learn More <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[#F8F9FA] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#0F2C59]">
              Contact the team
            </h3>
            <div className="mt-6 space-y-4 text-slate-700">
              <div className="flex items-center gap-3">
                <PhoneCall size={18} className="text-[#D4AF37]" />{" "}
                {company.phone}
              </div>
              <div className="flex items-center gap-3">
                <MessageCircleMore size={18} className="text-[#D4AF37]" />{" "}
                {company.whatsapp}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${company.email}`}
                  className="text-[#0F2C59] hover:text-[#D4AF37]"
                >
                  {company.email}
                </a>
              </div>
            </div>
            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-[#0F2C59] transition hover:bg-[#0F2C59] hover:text-white"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
