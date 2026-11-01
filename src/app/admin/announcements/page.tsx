import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { AnnouncementManager } from "@/components/admin-forms";
import { requireStaffPage } from "@/lib/auth";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "CMS Pengumuman" };
export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const user = await requireStaffPage("/admin/announcements");
  const rows = getStore().announcements;

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Pengelolaan pengumuman"
      subtitle="Pengumuman tampil pada landing page dan dashboard mahasiswa. Sematkan untuk menaruhnya di urutan teratas."
    >
      <AnnouncementManager rows={rows} />
    </AppShell>
  );
}