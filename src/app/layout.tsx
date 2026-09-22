import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Container } from "@/components/container";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const themeScript = `(() => {
  try {
    const storedTheme = window.localStorage.getItem("mydevlab-theme");
    const theme = storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
      ? storedTheme
      : "system";
    const resolvedTheme = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.dataset.theme = theme;
    root.style.colorScheme = resolvedTheme;
  } catch {}
})();`;

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:18080"),
  title: {
    default: "MyDevLab",
    template: "%s | MyDevLab",
  },
  description:
    "MyDevLab é um laboratório de engenharia de software focado em desenvolvimento, experimentação, APIs, integrações, arquitetura e aprendizado contínuo.",
  icons: {
    icon: [
      { url: "/images/ico-16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/images/ico-32.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: [{ url: "/images/apple-touch-icon-white.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    title: "MyDevLab",
    description:
      "Laboratório pessoal de engenharia de software, com projetos, artigos, APIs, integrações e experimentos.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1734,
        height: 907,
        alt: "MyDevLab — laboratório pessoal de engenharia de software",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className={`${inter.variable} min-h-screen bg-background text-foreground`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 py-section">
            <Container>{children}</Container>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
