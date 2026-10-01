import { PropertyCategory, PropertyStatus } from "@prisma/client";
import { PropertyCard } from "@/components/property-card";
import { getPublishedProperties } from "@/lib/property-listings";

export default async function RentPropertiesPage() {
  const rentProperties = await getPublishedProperties(PropertyStatus.AVAILABLE);
  const properties = rentProperties.filter(
    (property) => property.category === PropertyCategory.RENT,
  );

  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-[#0F2C59]">
          Rent Properties
        </h1>
        {properties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            No rental properties are available right now.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
