import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ApplicationForm } from "@/components/application-form";
import { getSessionUser, isStaff } from "@/lib/auth";
import { getApplicationById } from "@/lib/store";
import { SERVICE_META } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit Pengajuan" };
export const dynamic = "force-dynamic";

export default async function EditApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/dashboard/applications/${id}/edit`);

  const app = getApplicationById(id);
  if (!app) notFound();
  if (app.ownerId !== user.id && !isStaff(user.role)) redirect("/dashboard/applications");
  if (app.status !== "draft" && app.status !== "revision_required") {
    redirect(`/dashboard/applications/${app.id}`);
  }

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="student"
      title="Perbaiki berkas pengajuan"
      subtitle={`${app.registerNo || "nomor belum terbit"} · ${SERVICE_META[app.service].label}`}
    >
      <Link href={`/dashboard/applications/${app.id}`} className="mb-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-ink-mute transition-colors hover:text-forest-800">
        <ArrowLeft className="size-3.5" />
        Kembali ke detail pengajuan
      </Link>
      <ApplicationForm
        service={app.service}
        existing={app}
        user={{
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          nim: user.nim,
          department: user.department,
          phone: user.phone,
          nationality: user.nationality
        }}
      />
    </AppShell>
  );
}