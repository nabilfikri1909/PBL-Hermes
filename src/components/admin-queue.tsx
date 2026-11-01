import { AppShell } from "@/components/app-shell";
import { ApplicationList, type ListRow } from "@/components/application-list";
import { requireStaffPage } from "@/lib/auth";
import { listApplications } from "@/lib/store";
import { SERVICE_META } from "@/lib/utils";
import type { ServiceKind } from "@/lib/types";

export async function AdminQueue({ service, nextPath }: { service: ServiceKind; nextPath: string }) {
  const user = await requireStaffPage(nextPath);
  const rows: ListRow[] = listApplications()
    .filter((a) => a.service === service)
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
  const pending = rows.filter((r) => r.status === "submitted" || r.status === "under_review").length;

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title={`Antrean ${SERVICE_META[service].label}`}
      subtitle={`${pending} berkas menunggu keputusan · ${rows.length} total berkas pada layanan ini.`}
    >
      <ApplicationList rows={rows} variant="staff" basePath="/admin/applications" />
    </AppShell>
  );
}