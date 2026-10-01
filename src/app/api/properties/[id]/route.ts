import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { OR: [{ id }, { slug: id }], published: true },
    include: { images: { orderBy: { sortOrder: "asc" } }, features: true },
  });

  if (!property)
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing)
    return NextResponse.json({ error: "Property not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = propertySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid property data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { features, images, published, ...propertyData } = parsed.data;
  const property = await prisma.property.update({
    where: { id },
    data: {
      ...propertyData,
      ...(published === undefined
        ? {}
        : {
            published,
            publishedAt: published
              ? (existing.publishedAt ?? new Date())
              : null,
          }),
      ...(features === undefined
        ? {}
        : {
            features: {
              deleteMany: {},
              create: features.map((name) => ({ name })),
            },
          }),
      ...(images === undefined
        ? {}
        : {
            images: {
              deleteMany: {},
              create: images.map((image, sortOrder) => ({
                ...image,
                sortOrder,
              })),
            },
          }),
      updatedById: admin.id,
    },
    include: { images: { orderBy: { sortOrder: "asc" } }, features: true },
  });

  const action =
    existing.status !== property.status
      ? "PROPERTY_STATUS_CHANGED"
      : "PROPERTY_UPDATED";
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action,
      entity: "Property",
      entityId: property.id,
      metadata: { title: property.title, status: property.status },
    },
  });

  return NextResponse.json({ property });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property)
    return NextResponse.json({ error: "Property not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "PROPERTY_DELETED",
        entity: "Property",
        entityId: property.id,
        metadata: { title: property.title, slug: property.slug },
      },
    }),
    prisma.property.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
