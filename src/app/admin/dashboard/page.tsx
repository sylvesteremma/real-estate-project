import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { AdminPropertyManager } from "@/components/admin-property-manager";
import { AdminUserManager } from "@/components/admin-user-manager";
import { getManagedProperties } from "@/lib/property-listings";

export default async function AdminDashboardPage() {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const [
    totalProperties,
    availableProperties,
    reservedProperties,
    takenProperties,
    featuredProperties,
    totalInquiries,
    newInquiries,
    viewingRequests,
    totalAdministrators,
    properties,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "AVAILABLE" } }),
    prisma.property.count({ where: { status: "RESERVED" } }),
    prisma.property.count({ where: { status: "TAKEN" } }),
    prisma.property.count({ where: { featured: true } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.viewingRequest.count(),
    prisma.adminUser.count(),
    getManagedProperties(),
  ]);

  const stats = [
    { label: "Total Properties", value: totalProperties },
    { label: "Available Properties", value: availableProperties },
    { label: "Reserved Properties", value: reservedProperties },
    { label: "Taken Properties", value: takenProperties },
    { label: "Featured Properties", value: featuredProperties },
    { label: "Total Inquiries", value: totalInquiries },
    { label: "New Inquiries", value: newInquiries },
    { label: "Viewing Requests", value: viewingRequests },
    { label: "Total Administrators", value: totalAdministrators },
  ];

  return (
    <main className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold text-[#0F2C59]">Overview</h1>
            <p className="mt-2 text-slate-600">
              Welcome back, {admin?.name ?? "Admin"}.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                {stat.label}
              </p>
              <div className="mt-4 text-3xl font-bold text-[#0F2C59]">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <AdminPropertyManager initialProperties={properties} />
        {admin?.role === "SUPER_ADMIN" ? <AdminUserManager /> : null}
      </div>
    </main>
  );
}
