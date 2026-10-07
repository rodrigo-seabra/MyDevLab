"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

const initialState: LoginActionState = {
  success: false,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <Card className="w-full max-w-md shadow-sm border border-border bg-surface p-8">
      <div className="mb-6 text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Acesso à Plataforma
        </h1>
        <p className="text-small text-muted-foreground">
          Painel de administração e publicação do MyDevLab
        </p>
      </div>

      {state.message ? (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 rounded-md border border-error/20 bg-error/10 p-3 text-small text-error"
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-5" noValidate>
        <FormField
          label="E-mail"
          id="email"
          error={state.errors?.email?.[0]}
        >
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="founder@mydevlab.local"
            required
            disabled={isPending}
          />
        </FormField>

        <FormField
          label="Senha"
          id="password"
          error={state.errors?.password?.[0]}
        >
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            disabled={isPending}
          />
        </FormField>

        <div className="flex items-center justify-end text-small">
          <Link
            href="/auth/recovery"
            className="text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Recuperação de acesso
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full font-medium"
          disabled={isPending}
        >
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-border text-center text-small">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar para a página inicial
        </Link>
      </div>
    </Card>
  );
}
