"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  ["Home", "/"],
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Articles", "/articles"],
  ["Contact", "/contact"],
] as const;

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {navigation.map(([label, href]) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "font-semibold text-primary" : "hover:text-primary"}
                href={href}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
