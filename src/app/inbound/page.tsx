import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";

export const metadata: Metadata = { title: "Inbound International" };
export const dynamic = "force-dynamic";

export default function InboundPage() {
  return <ServicePage service="inbound" />;
}