import Link from "next/link";

const navigation = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Articles", "/articles"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="flex flex-col gap-5 border-b border-slate-800 py-6 sm:flex-row sm:items-center sm:justify-between">
      <Link className="text-lg font-bold tracking-tight text-white" href="/">MyDevLab</Link>
      <nav aria-label="Navegação principal">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
          {navigation.map(([label, href]) => (
            <li key={href}>
              <Link className="hover:text-cyan-300" href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
