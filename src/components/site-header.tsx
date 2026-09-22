import Link from "next/link";

const navigation = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Articles", "/articles"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="flex flex-col gap-5 border-b border-charcoal py-6 sm:flex-row sm:items-center sm:justify-between">
      <Link className="text-lg font-bold tracking-tight text-off-white" href="/">MyDevLab</Link>
      <nav aria-label="Navegação principal">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-state-gray">
          {navigation.map(([label, href]) => (
            <li key={href}>
              <Link className="hover:text-tech-blue" href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
