import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactMessageEmail } from "@/lib/resend";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact form payload" },
      { status: 400 },
    );
  }

  const message = await prisma.contactMessage.create({
    data: {
      ...parsed.data,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? "General inquiry",
    },
  });

  await sendContactMessageEmail({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject ?? "General Inquiry",
    message: parsed.data.message,
  });

  return NextResponse.json(
    { success: true, messageId: message.id },
    { status: 201 },
  );
}
