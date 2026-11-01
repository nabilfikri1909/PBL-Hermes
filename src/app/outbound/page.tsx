import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";

export const metadata: Metadata = { title: "Outbound Mobility" };
export const dynamic = "force-dynamic";

export default function OutboundPage() {
  return <ServicePage service="outbound" />;
}