import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const roleColors: Record<string, string> = {
    founder: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    recovery: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    admin: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    author: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  };

  const roleLabel: Record<string, string> = {
    founder: "Founder Principal",
    recovery: "Conta Recovery",
    admin: "Administrador",
    author: "Autor",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <BrandLogo className="w-[140px]" />
            </Link>
            <span className="text-small font-semibold text-muted-foreground hidden sm:inline-block">
              / Painel Administrativo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-small font-medium text-foreground">
                {session.name}
              </span>
              <span className="text-xs text-muted-foreground">{session.email}</span>
            </div>

            <Badge
              className={`capitalize px-2.5 py-0.5 font-medium ${
                roleColors[session.role] ?? ""
              }`}
            >
              {roleLabel[session.role] ?? session.role}
            </Badge>

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        MyDevLab V1 — Painel Administrativo Autenticado
      </footer>
    </div>
  );
}

