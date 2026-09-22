import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
      <body className={`${inter.variable} min-h-screen bg-deep-navy text-off-white`}>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
          <SiteHeader />
          <main className="flex-1 py-16">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
