import type { Metadata } from "next";
import { AdminQueue } from "@/components/admin-queue";

export const metadata: Metadata = { title: "Antrean Inbound" };
export const dynamic = "force-dynamic";

export default function AdminInboundPage() {
  return <AdminQueue service="inbound" nextPath="/admin/inbound" />;
}