import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "MIETech — 3D-Printed Tabletop Miniatures",
  description:
    "Browse the MIETech catalog of high-quality 3D-printed miniatures for D&D and tabletop gaming.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-neutral/15 bg-white py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-xs text-neutral">
              MIETechnologies &mdash; Making It Easier
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
