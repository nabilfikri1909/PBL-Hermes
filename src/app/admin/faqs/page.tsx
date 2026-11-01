import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { FaqManager } from "@/components/admin-forms";
import { requireStaffPage } from "@/lib/auth";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "FAQ Manager" };
export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const user = await requireStaffPage("/admin/faqs");
  const rows = getStore().faqs;

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Pengelolaan FAQ"
      subtitle="FAQ tampil pada landing page dan halaman pusat bantuan publik, dikelompokkan menurut topik."
    >
      <FaqManager rows={rows} />
    </AppShell>
  );
}