import type { Metadata } from "next";
import { ApplyPage } from "@/components/apply-page";

export const metadata: Metadata = { title: "Formulir Pengajuan Outbound" };
export const dynamic = "force-dynamic";

export default function ApplyOutboundPage() {
  return <ApplyPage service="outbound" />;
}