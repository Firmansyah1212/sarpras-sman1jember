import type { Metadata } from "next";
import "./globals.css";

import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Sistem Peminjaman Sarpras SMAN 1 Jember",
  description: "Sistem Peminjaman Sarana dan Prasarana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}