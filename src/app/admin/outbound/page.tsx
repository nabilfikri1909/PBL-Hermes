import type { Metadata } from "next";
import { AdminQueue } from "@/components/admin-queue";

export const metadata: Metadata = { title: "Antrean Outbound" };
export const dynamic = "force-dynamic";

export default function AdminOutboundPage() {
  return <AdminQueue service="outbound" nextPath="/admin/outbound" />;
}