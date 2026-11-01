import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ApplicationList, type ListRow } from "@/components/application-list";
import { getSessionUser, isStaff } from "@/lib/auth";
import { listApplications } from "@/lib/store";

export const metadata: Metadata = { title: "Pengajuan Saya" };
export const dynamic = "force-dynamic";

export default async function MyApplicationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/applications");
  if (isStaff(user.role)) redirect("/admin/applications");

  const rows: ListRow[] = listApplications()
    .filter((a) => a.ownerId === user.id)
    .map((a) => ({
      id: a.id,
      registerNo: a.registerNo,
      title: a.title,
      service: a.service,
      country: a.country,
      city: a.city,
      status: a.status,
      partnerInstitution: a.partnerInstitution,
      ownerName: a.ownerName,
      updatedAt: a.updatedAt,
      submittedAt: a.submittedAt,
      participants: a.participants.length
    }));

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="student"
      title="Pengajuan saya"
      subtitle="Seluruh berkas lintas layanan dalam satu tabel — klik judul untuk membuka linimasa dan catatan revisi."
    >
      <ApplicationList rows={rows} />
    </AppShell>
  );
}