import { PropertyStatus } from "@prisma/client";
import { PropertyCard } from "@/components/property-card";
import { getPublishedProperties } from "@/lib/property-listings";

export default async function LandPropertiesPage() {
  const availableProperties = await getPublishedProperties(
    PropertyStatus.AVAILABLE,
  );
  const landProperties = availableProperties.filter(
    (property) => property.category === "BUY LAND",
  );

  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-[#0F2C59]">Buy Land</h1>
        {landProperties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            No land listings are available right now.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {landProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
