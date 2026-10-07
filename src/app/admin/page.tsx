import type { Metadata } from "next";
import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { contents, contactMessages, users } from "@/db/schema";
import { getSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard — MyDevLab Admin",
};

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Consultas de métricas no banco
  let totalPublished = 0;
  let totalPending = 0;
  let totalDraft = 0;
  let totalMessages = 0;
  let totalUsers = 0;

  try {
    const [pub] = await db
      .select({ val: count() })
      .from(contents)
      .where(eq(contents.editorialStatus, "published"));
    const [pen] = await db
      .select({ val: count() })
      .from(contents)
      .where(eq(contents.editorialStatus, "pending_review"));
    const [dra] = await db
      .select({ val: count() })
      .from(contents)
      .where(eq(contents.editorialStatus, "draft"));
    const [msg] = await db.select({ val: count() }).from(contactMessages);
    const [usr] = await db.select({ val: count() }).from(users);

    totalPublished = pub?.val ?? 0;
    totalPending = pen?.val ?? 0;
    totalDraft = dra?.val ?? 0;
    totalMessages = msg?.val ?? 0;
    totalUsers = usr?.val ?? 0;
  } catch (err) {
    console.error("Erro ao carregar métricas no dashboard:", err);
  }

  return (
    <div className="space-y-8">
      {/* Hero de Boas-Vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Visão Geral da Plataforma
          </h1>
          <p className="text-muted-foreground mt-1">
            Olá, <strong className="text-foreground">{session?.name}</strong>.
            Sua sessão está ativa com nível de acesso{" "}
            <span className="font-semibold text-primary capitalize">
              {session?.role}
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-small font-medium text-foreground hover:bg-muted/10 transition-colors"
          >
            Ver Site Público ↗
          </Link>
        </div>
      </div>

      {/* Grid de Métricas do Ciclo Editorial */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Ciclo Editorial & Conteúdo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex flex-col justify-between">
            <span className="text-small text-muted-foreground">Publicados</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-foreground">
                {totalPublished}
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                Público
              </Badge>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <span className="text-small text-muted-foreground">Em Revisão</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-foreground">
                {totalPending}
              </span>
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                Pendente
              </Badge>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <span className="text-small text-muted-foreground">Rascunhos</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-foreground">
                {totalDraft}
              </span>
              <Badge className="bg-neutral-500/10 text-muted-foreground border-border">
                Privado
              </Badge>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <span className="text-small text-muted-foreground">
              Mensagens de Contato
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-foreground">
                {totalMessages}
              </span>
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                Founder Only
              </Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Seção de Status do Domínio & Governança */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">
            Invariantes de Governança Ativos
          </h3>
          <ul className="space-y-2 text-small text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>
                <strong>RN-012:</strong> Nenhum conteúdo é publicado sem aprovação.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>
                <strong>RN-013:</strong> Segregação de aprovação (Admin não aprova o próprio item).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>
                <strong>RN-015:</strong> Justificativa de rejeição mínima de 20 caracteres.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>
                <strong>RN-016:</strong> Edição em item publicado reverte para <code>pending_review</code>.
              </span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">
            Estado da Infraestrutura
          </h3>
          <div className="space-y-3 text-small">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Banco de Dados</span>
              <span className="font-medium text-emerald-500 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                PostgreSQL 18 Conectado
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Total de Contas</span>
              <span className="font-medium text-foreground">{totalUsers} usuário(s)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Segurança da Sessão</span>
              <span className="font-medium text-foreground">Cookie httpOnly Lax</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
