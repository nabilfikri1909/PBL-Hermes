import type { Metadata } from "next";
import { ApplyPage } from "@/components/apply-page";

export const metadata: Metadata = { title: "Formulir Izin PDLN" };
export const dynamic = "force-dynamic";

export default function ApplyPdlnPage() {
  return <ApplyPage service="pdln" />;
}