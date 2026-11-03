import type { Metadata } from "next";
import { ApplyPage } from "@/components/apply-page";

export const metadata: Metadata = { title: "Inbound Application" };
export const dynamic = "force-dynamic";

export default async function ApplyInboundPage({
  searchParams
}: {
  searchParams: Promise<{ baru?: string }>;
}) {
  const params = await searchParams;
  return <ApplyPage service="inbound" startNew={params.baru === "1"} />;
}