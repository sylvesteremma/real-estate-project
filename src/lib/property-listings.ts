import {
  PropertyCategory as DatabaseCategory,
  PropertyStatus as DatabaseStatus,
  Prisma,
} from "@prisma/client";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Property } from "@/types/property";

const propertyInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  features: true,
} satisfies Prisma.PropertyInclude;

type DatabaseProperty = Prisma.PropertyGetPayload<{
  include: typeof propertyInclude;
}>;

export type ManagedProperty = Omit<Property, "image" | "gallery"> & {
  id: string;
  images: Array<{
    id: string;
    url: string;
    publicId: string | null;
    altText: string | null;
  }>;
};

const categoryLabels: Record<DatabaseCategory, Property["category"]> = {
  RENT: "RENT",
  BUY_PROPERTY: "BUY PROPERTY",
  BUY_LAND: "BUY LAND",
};

function toPropertyListing(property: DatabaseProperty): Property {
  const gallery = property.images.map((image) => image.url);

  return {
    slug: property.slug,
    title: property.title,
    category: categoryLabels[property.category],
    propertyType: property.propertyType,
    status: property.status,
    price: Number(property.price),
    currency: property.currency,
    location: property.location,
    address: property.address,
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined,
    toilets: property.toilets ?? undefined,
    propertySize: property.propertySize ?? undefined,
    landSize: property.landSize ?? undefined,
    featured: property.featured,
    published: property.published,
    image: gallery[0] ?? "",
    gallery,
    description: property.description,
    features: property.features.map((feature) => feature.name),
  };
}

export async function getPublishedProperties(status?: DatabaseStatus) {
  await connection();
  const properties = await prisma.property.findMany({
    where: {
      published: true,
      ...(status ? { status } : {}),
    },
    include: propertyInclude,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return properties.map(toPropertyListing);
}

export async function getPublishedPropertyBySlug(slug: string) {
  await connection();
  const property = await prisma.property.findFirst({
    where: { slug, published: true },
    include: propertyInclude,
  });

  return property ? toPropertyListing(property) : null;
}

function toManagedProperty(property: DatabaseProperty): ManagedProperty {
  return {
    ...toPropertyListing(property),
    id: property.id,
    images: property.images.map((image) => ({
      id: image.id,
      url: image.url,
      publicId: image.publicId,
      altText: image.altText,
    })),
  };
}

export async function getManagedProperties() {
  await connection();
  const properties = await prisma.property.findMany({
    include: propertyInclude,
    orderBy: [{ updatedAt: "desc" }],
  });

  return properties.map(toManagedProperty);
}
