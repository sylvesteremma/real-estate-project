import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@bennyhomes.com";
  const password = process.env.DEV_ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error(
      "Set DEV_ADMIN_PASSWORD to a unique password of at least 12 characters before seeding.",
    );
  }

  const passwordHash = await hash(password, 12);

  const superAdmin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      name: "Super Admin",
      email,
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("Seed complete. Admin email: admin@bennyhomes.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
