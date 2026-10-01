import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendViewingRequestEmail } from "@/lib/resend";
import { viewingSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = viewingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid viewing request" },
      { status: 400 },
    );
  }

  let propertyTitle = "Property viewing";
  if (parsed.data.propertyId) {
    const property = await prisma.property.findFirst({
      where: { id: parsed.data.propertyId, published: true },
      select: { id: true, title: true },
    });
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }
    propertyTitle = property.title;
  }

  const viewingRequest = await prisma.viewingRequest.create({
    data: {
      ...parsed.data,
      propertyId: parsed.data.propertyId ?? null,
    },
  });

  await sendViewingRequestEmail({
    propertyTitle,
    customerName: parsed.data.name,
    preferredDate: parsed.data.preferredDate,
    preferredTime: parsed.data.preferredTime,
  });

  return NextResponse.json(
    { success: true, viewingRequestId: viewingRequest.id },
    { status: 201 },
  );
}
