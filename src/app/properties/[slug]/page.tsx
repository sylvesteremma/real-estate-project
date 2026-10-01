import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  MapPin,
  PhoneCall,
  MessageCircleMore,
  Ruler,
  Check,
} from "lucide-react";
import { PropertyStatus } from "@prisma/client";
import {
  getPublishedProperties,
  getPublishedPropertyBySlug,
} from "@/lib/property-listings";
import { company } from "@/lib/company";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPublishedPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const relatedProperties = (
    await getPublishedProperties(PropertyStatus.AVAILABLE)
  )
    .filter(
      (item) =>
        item.slug !== property.slug && item.category === property.category,
    )
    .slice(0, 3);

  return (
    <main className="bg-[#F8F9FA] pb-16 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-[#0F2C59]">
            Home
          </Link>
          <span>/</span>
          <Link href="/properties" className="transition hover:text-[#0F2C59]">
            Properties
          </Link>
          <span>/</span>
          <span className="text-[#0F2C59]">{property.title}</span>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="relative h-[430px] w-full">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 60vw"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {property.gallery.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative h-32 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <Image
                    src={image}
                    alt={`${property.title} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              {property.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#0F2C59]">
              {property.title}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-slate-500">
              <MapPin size={16} className="text-[#D4AF37]" />
              {property.location}
            </div>

            <div className="mt-6 text-3xl font-bold text-[#0F2C59]">
              {property.currency} {property.price.toLocaleString()}
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3 py-2">
                <span>Property type</span>
                <span className="font-semibold text-[#0F2C59]">
                  {property.propertyType}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3 py-2">
                <span>Status</span>
                <span className="font-semibold text-[#0F2C59]">
                  {property.status}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3 py-2">
                <span>Location</span>
                <span className="font-semibold text-[#0F2C59]">
                  {property.location}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={company.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F2C59] px-4 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]"
              >
                <MessageCircleMore size={18} /> WhatsApp
              </a>
              <a
                href={company.phoneUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0F2C59] px-4 py-3 font-semibold text-[#0F2C59] transition hover:bg-[#0F2C59] hover:text-white"
              >
                <PhoneCall size={18} /> Call
              </a>
            </div>
          </aside>
        </div>

        <section className="mt-12 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-[#0F2C59]">
            Property Overview
          </h2>
          <p className="mt-4 leading-8 text-slate-700">
            {property.description}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {property.bedrooms ? (
              <div className="rounded-2xl bg-[#F8F9FA] p-4">
                <BedDouble size={18} className="text-[#D4AF37]" />
                <div className="mt-3 text-sm text-slate-500">Bedrooms</div>
                <div className="mt-1 text-lg font-bold text-[#0F2C59]">
                  {property.bedrooms}
                </div>
              </div>
            ) : null}
            {property.bathrooms ? (
              <div className="rounded-2xl bg-[#F8F9FA] p-4">
                <Bath size={18} className="text-[#D4AF37]" />
                <div className="mt-3 text-sm text-slate-500">Bathrooms</div>
                <div className="mt-1 text-lg font-bold text-[#0F2C59]">
                  {property.bathrooms}
                </div>
              </div>
            ) : null}
            {property.propertySize ? (
              <div className="rounded-2xl bg-[#F8F9FA] p-4">
                <Ruler size={18} className="text-[#D4AF37]" />
                <div className="mt-3 text-sm text-slate-500">Property size</div>
                <div className="mt-1 text-lg font-bold text-[#0F2C59]">
                  {property.propertySize}
                </div>
              </div>
            ) : null}
            {property.landSize ? (
              <div className="rounded-2xl bg-[#F8F9FA] p-4">
                <Ruler size={18} className="text-[#D4AF37]" />
                <div className="mt-3 text-sm text-slate-500">Land size</div>
                <div className="mt-1 text-lg font-bold text-[#0F2C59]">
                  {property.landSize}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-8 rounded-2xl bg-[#F8F9FA] p-6">
            <h3 className="text-xl font-bold text-[#0F2C59]">Features</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {property.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  <Check size={14} className="text-[#D4AF37]" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold text-[#0F2C59]">
              Send an inquiry
            </h2>
            <form className="mt-6 grid gap-5 md:grid-cols-2">
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Name"
              />
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Email"
              />
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Phone"
              />
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Preferred contact"
              />
              <textarea
                rows={5}
                className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Tell us what you would like to know"
              />
              <button
                type="submit"
                className="md:col-span-2 rounded-full bg-[#0F2C59] px-6 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]"
              >
                Send Inquiry
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-[#0F2C59] p-8 text-white shadow-sm">
            <h2 className="text-2xl font-bold">Schedule a viewing</h2>
            <div className="mt-6 space-y-4 text-slate-200">
              <label className="block text-sm">
                Preferred date
                <input
                  type="date"
                  className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </label>
              <label className="block text-sm">
                Preferred time
                <input
                  type="time"
                  className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </label>
              <button
                type="button"
                className="mt-3 inline-flex rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-[#0F2C59] transition hover:bg-white"
              >
                Request Viewing
              </button>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0F2C59]">
              Related properties
            </h2>
            <Link
              href="/properties"
              className="text-sm font-semibold text-[#0F2C59] hover:text-[#D4AF37]"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProperties.map((item) => (
              <Link
                key={item.slug}
                href={`/properties/${item.slug}`}
                className="block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="text-lg font-bold text-[#0F2C59]">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {item.location}
                  </div>
                  <div className="mt-4 text-lg font-bold text-[#0F2C59]">
                    {item.currency} {item.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
