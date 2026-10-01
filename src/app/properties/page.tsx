import Link from "next/link";
import { PropertyStatus } from "@prisma/client";
import { PropertyCard } from "@/components/property-card";
import { getPublishedProperties } from "@/lib/property-listings";

export default async function PropertiesPage() {
  const availableProperties = await getPublishedProperties(
    PropertyStatus.AVAILABLE,
  );

  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Explore
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#0F2C59]">
              All Available Properties
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/properties/rent"
              className="rounded-full border border-[#0F2C59] px-4 py-2 text-sm font-semibold text-[#0F2C59] transition hover:bg-[#0F2C59] hover:text-white"
            >
              Rent
            </Link>
            <Link
              href="/properties/buy"
              className="rounded-full border border-[#0F2C59] px-4 py-2 text-sm font-semibold text-[#0F2C59] transition hover:bg-[#0F2C59] hover:text-white"
            >
              Buy
            </Link>
            <Link
              href="/properties/land"
              className="rounded-full border border-[#0F2C59] px-4 py-2 text-sm font-semibold text-[#0F2C59] transition hover:bg-[#0F2C59] hover:text-white"
            >
              Land
            </Link>
          </div>
        </div>

        <div className="mb-10 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-5">
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            placeholder="Location"
          />
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            placeholder="Keyword"
          />
          <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none">
            <option value="">Category</option>
            <option value="RENT">RENT</option>
            <option value="BUY PROPERTY">BUY PROPERTY</option>
            <option value="BUY LAND">BUY LAND</option>
          </select>
          <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none">
            <option value="">Min Price</option>
            <option value="5000000">₦5m</option>
            <option value="20000000">₦20m</option>
          </select>
          <button className="rounded-xl bg-[#0F2C59] px-4 py-3 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]">
            Search Properties
          </button>
        </div>

        {availableProperties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            No properties match your criteria yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {availableProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
