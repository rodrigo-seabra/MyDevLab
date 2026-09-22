import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Container } from "@/components/container";

const footerLinks = [
  ["Projects", "/projects"],
  ["Articles", "/articles"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="py-6 sm:py-8">
        <div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16">
          <div>
            <Link aria-label="MyDevLab — página inicial" href="/">
              <BrandLogo />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Software engineering through experimentation.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">Explore</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {footerLinks.map(([label, href]) => (
                <li key={href}>
                  <Link className="text-foreground hover:text-primary" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MyDevLab</p>
          <span>Software Engineering Lab</span>
        </div>
      </Container>
    </footer>
  );
}
