import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Portal Program Internasional PNJ",
    template: "%s · Portal Internasional PNJ"
  },
  description:
    "Satu pintu layanan mobilitas internasional Politeknik Negeri Jakarta: Outbound, Inbound, dan Perjalanan Dinas Luar Negeri (PDLN)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-dvh bg-canvas antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "999px",
              border: "1px solid #e4ebe7",
              color: "#0d1a15",
              fontSize: "0.875rem"
            }
          }}
        />
      </body>
    </html>
  );
}