import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Container } from "@/components/container";
import { SiteNavigation } from "@/components/site-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
        <Link aria-label="MyDevLab — página inicial" className="shrink-0" href="/">
          <BrandLogo />
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <SiteNavigation />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
