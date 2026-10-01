import { PropertyStatus } from "@prisma/client";
import { PropertyCard } from "@/components/property-card";
import { getPublishedProperties } from "@/lib/property-listings";

export default async function TakenPropertiesPage() {
  const takenProperties = await getPublishedProperties(PropertyStatus.TAKEN);

  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Status
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#0F2C59]">
            Taken Properties
          </h1>
        </div>

        {takenProperties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            There are no taken properties at the moment.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {takenProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
