import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DVLA HR SMS Messaging & Staff Communication System",
  description: "Official Driver and Vehicle Licensing Authority internal HR staff SMS messaging platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}
