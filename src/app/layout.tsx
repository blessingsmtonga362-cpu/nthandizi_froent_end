// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- THIS LINE IS CRITICAL

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UNIMA Student Support System",
  description: "Official Student Support Profiling System for the University of Malawi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}