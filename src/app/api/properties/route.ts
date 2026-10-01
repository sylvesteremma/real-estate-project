import { NextResponse } from "next/server";
import { PropertyStatus } from "@prisma/client";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const category = params.get("category");
  const categories = ["RENT", "BUY_PROPERTY", "BUY_LAND"] as const;
  const location = params.get("location");
  const search = params.get("q");
  const minPrice = Number(params.get("minPrice"));
  const maxPrice = Number(params.get("maxPrice"));
  const price = {
    ...(Number.isFinite(minPrice) && params.has("minPrice")
      ? { gte: minPrice }
      : {}),
    ...(Number.isFinite(maxPrice) && params.has("maxPrice")
      ? { lte: maxPrice }
      : {}),
  };

  const properties = await prisma.property.findMany({
    where: {
      published: true,
      status: { not: PropertyStatus.TAKEN },
      ...(category &&
      categories.includes(category as (typeof categories)[number])
        ? { category: category as (typeof categories)[number] }
        : {}),
      ...(location
        ? { location: { contains: location, mode: "insensitive" as const } }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { location: { contains: search, mode: "insensitive" as const } },
              { address: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(Object.keys(price).length ? { price } : {}),
    },
    include: { images: { orderBy: { sortOrder: "asc" } }, features: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return NextResponse.json({ properties });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = propertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid property data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const slugBase = parsed.data.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

  const { features, images, ...propertyData } = parsed.data;
  const property = await prisma.property.create({
    data: {
      ...propertyData,
      slug,
      publishedAt: propertyData.published ? new Date() : null,
      createdById: admin.id,
      updatedById: admin.id,
      features: { create: features.map((name) => ({ name })) },
      images: {
        create: images.map((image, sortOrder) => ({ ...image, sortOrder })),
      },
    },
    include: { images: true, features: true },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "PROPERTY_CREATED",
      entity: "Property",
      entityId: property.id,
      metadata: { title: property.title, slug: property.slug },
    },
  });

  return NextResponse.json({ property }, { status: 201 });
}
