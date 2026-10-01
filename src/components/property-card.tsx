import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Ruler, ArrowRight } from "lucide-react";
import type { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No photos yet
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F2C59]">
          {property.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F2C59]">
          {property.status}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#0F2C59]">
              {property.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={14} className="text-[#D4AF37]" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From
            </p>
            <p className="text-xl font-bold text-[#0F2C59]">
              {property.currency} {property.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          {property.bedrooms ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
              <BedDouble size={14} /> {property.bedrooms} Beds
            </span>
          ) : null}
          {property.bathrooms ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
              <Bath size={14} /> {property.bathrooms} Baths
            </span>
          ) : null}
          {property.propertySize ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
              <Ruler size={14} /> {property.propertySize}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-sm text-slate-500">
            {property.propertyType}
          </span>
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F2C59] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#0F2C59]"
          >
            View Details <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
