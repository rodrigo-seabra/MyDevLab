import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyDevLab",
    template: "%s | MyDevLab",
  },
  description: "Portfolio e laboratorio pessoal de engenharia de software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
          <SiteHeader />
          <main className="flex-1 py-16">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
