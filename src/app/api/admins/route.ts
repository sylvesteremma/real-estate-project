import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminCreateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let actor;
  try {
    actor = await requireSuperAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = adminCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid administrator details",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An administrator with that email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const admin = await prisma.$transaction(async (transaction) => {
    const created = await transaction.adminUser.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: "ADMIN",
        isActive: true,
        createdById: actor.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await transaction.auditLog.create({
      data: {
        adminId: actor.id,
        action: "ADMIN_CREATED",
        entity: "AdminUser",
        entityId: created.id,
        metadata: { name: created.name, email: created.email },
      },
    });

    return created;
  });

  return NextResponse.json({ admin }, { status: 201 });
}
