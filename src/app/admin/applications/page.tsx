import type { Metadata } from "next";
import { Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ApplicationList, type ListRow } from "@/components/application-list";
import { requireStaffPage } from "@/lib/auth";
import { listApplications } from "@/lib/store";

export const metadata: Metadata = { title: "Semua Pengajuan" };
export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const user = await requireStaffPage("/admin/applications");
  const rows: ListRow[] = listApplications().map((a) => ({
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
      area="admin"
      title="Semua pengajuan"
      subtitle="Tabel master lintas layanan. Klik judul untuk membuka panel verifikasi."
      actions={
        <a href="/api/export" className="hidden items-center gap-1.5 rounded-full border border-hairline px-3.5 py-2 text-[0.75rem] font-semibold text-ink-soft transition-colors hover:border-forest-300 sm:inline-flex">
          <Download className="size-3.5" />
          Ekspor CSV
        </a>
      }
    >
      <ApplicationList rows={rows} variant="staff" basePath="/admin/applications" />
    </AppShell>
  );
}