import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export type SessionAdmin = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || Buffer.byteLength(value, "utf8") < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 bytes.");
  }
  return new TextEncoder().encode(value);
}

export async function signInAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.isActive) return null;

  const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!isValidPassword) return null;

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  } satisfies SessionAdmin;
}

export async function createSessionToken(admin: SessionAdmin) {
  return new SignJWT({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function getCurrentAdmin(): Promise<SessionAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.email || !payload.role) return null;

    const admin = await prisma.adminUser.findUnique({
      where: { id: String(payload.sub) },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    if (!admin?.isActive || admin.email !== payload.email) return null;

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  } catch {
    return null;
  }
}

export async function setAdminSession(admin: SessionAdmin) {
  const cookieStore = await cookies();
  const token = await createSessionToken(admin);

  cookieStore.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export async function requireSuperAdmin() {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  return admin;
}
