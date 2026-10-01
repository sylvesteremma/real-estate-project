import { PropertyStatus } from "@prisma/client";
import { PropertyCard } from "@/components/property-card";
import { getPublishedProperties } from "@/lib/property-listings";

export default async function BuyPropertiesPage() {
  const availableProperties = await getPublishedProperties(
    PropertyStatus.AVAILABLE,
  );
  const buyProperties = availableProperties.filter(
    (property) => property.category === "BUY PROPERTY",
  );

  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-[#0F2C59]">
          Buy Properties
        </h1>
        {buyProperties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            No purchase properties are available right now.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {buyProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
