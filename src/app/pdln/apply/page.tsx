import type { Metadata } from "next";
import { ApplyPage } from "@/components/apply-page";

export const metadata: Metadata = { title: "Formulir Izin PDLN" };
export const dynamic = "force-dynamic";

export default async function ApplyPdlnPage({
  searchParams
}: {
  searchParams: Promise<{ baru?: string }>;
}) {
  const params = await searchParams;
  return <ApplyPage service="pdln" startNew={params.baru === "1"} />;
}