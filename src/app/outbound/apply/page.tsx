import type { Metadata } from "next";
import { ApplyPage } from "@/components/apply-page";

export const metadata: Metadata = { title: "Formulir Pengajuan Outbound" };
export const dynamic = "force-dynamic";

export default async function ApplyOutboundPage({
  searchParams
}: {
  searchParams: Promise<{ baru?: string }>;
}) {
  const params = await searchParams;
  return <ApplyPage service="outbound" startNew={params.baru === "1"} />;
}