---
name: nextjs-clean-fullstack
description: >-
  Padrões arquiteturais para Next.js 16 App Router: Server Components por padrão, Server Actions em actions.ts com Zod e React 19 useActionState, Tailwind CSS 4, HTML semântico e acessibilidade. Use ao criar ou modificar componentes, páginas, rotas e mutações.
---

# Next.js Clean Fullstack — MyDevLab

Este documento orienta o desenvolvimento frontend e fullstack no Next.js 16 App Router, mantendo o código enxuto, acessível e aderente aos padrões do projeto.

---

## 1. Princípios de Arquitetura

1. **Server Components por Padrão**: Toda página e componente deve ser um Server Component a menos que precise expressamente de interatividade no cliente (hooks como `useState`, `useActionState`, eventos de clique dinâmicos no navegador).
2. **Sem Abstrações Artificiais**: O App Router e o Drizzle eliminam a necessidade de repositórios genéricos ou serviços ocos que apenas repassam chamadas. Escreva lógica de banco direto no Server Component ou em Server Actions/funções de serviço concretas.
3. **Validação Estrita no Servidor**: O navegador e o cliente nunca são confiáveis. Todos os dados submetidos passam obrigatoriamente por schemas Zod antes de qualquer processamento ou gravação.

---

## 2. Server Actions e Mutações com React 19

### Padrão de Arquitetura de Mutações
- Server Actions devem residir em arquivos dedicados `actions.ts` (ex: `src/app/contact/actions.ts` ou `src/app/(admin)/contents/actions.ts`).
- Cada action deve:
  1. Declarar `'use server'` no topo do arquivo.
  2. Receber o estado anterior e o `FormData` (compatível com React 19 `useActionState`).
  3. Validar a entrada usando o schema Zod correspondente em `src/validations/`.
  4. Executar verificações de autenticação e autorização server-side.
  5. Realizar a mutação no PostgreSQL via Drizzle.
  6. Retornar um objeto de estado previsível (ex: `{ success: boolean, errors?: Record<string, string[]>, message?: string }`).

### Exemplo de Estrutura de Server Action:

```typescript
"use server";

import { contactMessageSchema } from "@/validations/contact-message";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitContactAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = contactMessageSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Por favor, corrija os erros no formulário.",
    };
  }

  try {
    await db.insert(contactMessages).values(parsed.data);
    return {
      success: true,
      message: "Mensagem enviada com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Ocorreu um erro ao salvar sua mensagem. Tente novamente.",
    };
  }
}
```

### Componentes de Formulário no Cliente (`'use client'`):
- Utilize o hook `useActionState` do React 19:
  ```tsx
  "use client";

  import { useActionState } from "react";
  import { submitContactAction, type ActionState } from "./actions";

  const initialState: ActionState = { success: false };

  export function ContactForm() {
    const [state, formAction, isPending] = useActionState(submitContactAction, initialState);

    return (
      <form action={formAction}>
        {/* Campos de formulário acessíveis */}
      </form>
    );
  }
  ```

---

## 3. Estilização com Tailwind CSS 4

- **Utilitário `cn()`**: Sempre use a função `cn()` (`src/lib/cn.ts`) para concatenar classes condicionais e mesclar utilitários Tailwind.
- **Componentes Base**: Reutilize e estenda os componentes em `src/components/ui/` (`Button`, `Input`, `Textarea`, `Card`, `Badge`, `Container`, etc.).
- **Responsividade**: Desenvolva mobile-first (classes padrão para telas pequenas, seguidas de prefixos como `sm:`, `md:`, `lg:`).
- **Consistência de Cores e Tema**: Preserve suporte a temas e garanta contraste visual adequado entre planos de fundo e textos.

---

## 4. Acessibilidade Obrigatória (a11y)

1. **HTML Semântico**: Use `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<footer>` e a hierarquia correta de títulos (`<h1>` a `<h6>`).
2. **Formulários Acessíveis**:
   - Todo campo deve ter `<label>` associado explicitamente via `htmlFor` e `id`.
   - Mensagens de erro de validação devem ter `id` e ser conectadas ao campo via `aria-describedby`.
   - Campos com erro devem incluir `aria-invalid="true"`.
3. **Navegação por Teclado e Foco**:
   - Elementos focáveis interativos (`<button>`, `<a>`, `<input>`) devem ter indicador visível de foco (`focus-visible:ring-2 focus-visible:outline-none`).
   - Não desative o outline de foco sem fornecer substituto visual equivalente.
4. **Links e Imagens**:
   - Links devem descrever seu destino (evite "clique aqui" sem contexto).
   - Toda imagem informativa deve conter `alt` descritivo. Imagens puramente decorativas devem usar `alt=""`.

