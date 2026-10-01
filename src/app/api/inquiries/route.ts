import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPropertyInquiryEmail } from "@/lib/resend";
import { inquirySchema } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid inquiry data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let propertyTitle = "General inquiry";
  if (parsed.data.propertyId) {
    const property = await prisma.property.findFirst({
      where: { id: parsed.data.propertyId, published: true },
      select: { id: true, title: true },
    });
    if (!property)
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    propertyTitle = property.title;
  }

  const inquiry = await prisma.inquiry.create({
    data: { ...parsed.data, propertyId: parsed.data.propertyId ?? null },
  });

  await sendPropertyInquiryEmail({
    propertyTitle,
    customerName: parsed.data.name,
    customerEmail: parsed.data.email,
    customerPhone: parsed.data.phone,
    message: parsed.data.message,
  });

  return NextResponse.json(
    { success: true, inquiryId: inquiry.id },
    { status: 201 },
  );
}
