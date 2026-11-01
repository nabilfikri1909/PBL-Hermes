import type { Metadata } from "next";
import { AdminQueue } from "@/components/admin-queue";

export const metadata: Metadata = { title: "Antrean PDLN" };
export const dynamic = "force-dynamic";

export default function AdminPdlnPage() {
  return <AdminQueue service="pdln" nextPath="/admin/pdln" />;
}