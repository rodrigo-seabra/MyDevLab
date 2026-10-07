"use client";

import { useActionState } from "react";
import Link from "next/link";
import { recoveryAction, type RecoveryActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

const initialState: RecoveryActionState = {
  success: false,
};

export function RecoveryForm() {
  const [state, formAction, isPending] = useActionState(recoveryAction, initialState);

  return (
    <Card className="w-full max-w-md shadow-sm border border-border bg-surface p-8">
      <div className="mb-6 text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Recuperação do Founder
        </h1>
        <p className="text-small text-muted-foreground">
          Valide o segredo operacional para redefinir o acesso principal
        </p>
      </div>

      {state.message ? (
        <div
          role="alert"
          aria-live="polite"
          className={`mb-5 rounded-md border p-3 text-small ${
            state.success
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-error/20 bg-error/10 text-error"
          }`}
        >
          <p>{state.message}</p>
          {state.success ? (
            <Link
              href="/login"
              className="mt-2 inline-block font-medium underline text-primary"
            >
              Ir para tela de Login →
            </Link>
          ) : null}
        </div>
      ) : null}

      <form action={formAction} className="space-y-5" noValidate>
        <FormField
          label="Segredo de Recuperação"
          id="recoverySecret"
          hint="Segredo de provisionamento gerado no bootstrap"
          error={state.errors?.recoverySecret?.[0]}
        >
          <Input
            name="recoverySecret"
            type="password"
            autoComplete="off"
            placeholder="••••••••••••••••"
            required
            disabled={isPending || state.success}
          />
        </FormField>

        <FormField
          label="Nova Senha"
          id="newPassword"
          error={state.errors?.newPassword?.[0]}
        >
          <Input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            required
            disabled={isPending || state.success}
          />
        </FormField>

        <FormField
          label="Confirmar Nova Senha"
          id="confirmPassword"
          error={state.errors?.confirmPassword?.[0]}
        >
          <Input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repita a nova senha"
            required
            disabled={isPending || state.success}
          />
        </FormField>

        <Button
          type="submit"
          className="w-full font-medium"
          disabled={isPending || state.success}
        >
          {isPending ? "Validando e Redefinindo..." : "Redefinir Senha do Founder"}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-border text-center text-small">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar para o Login
        </Link>
      </div>
    </Card>
  );
}

