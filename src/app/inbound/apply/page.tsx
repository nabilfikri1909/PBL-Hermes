import type { Metadata } from "next";
import { ApplyPage } from "@/components/apply-page";

export const metadata: Metadata = { title: "Inbound Application" };
export const dynamic = "force-dynamic";

export default function ApplyInboundPage() {
  return <ApplyPage service="inbound" />;
}