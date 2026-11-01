import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";

export const metadata: Metadata = { title: "Perjalanan Dinas Luar Negeri" };
export const dynamic = "force-dynamic";

export default function PdlnPage() {
  return <ServicePage service="pdln" />;
}