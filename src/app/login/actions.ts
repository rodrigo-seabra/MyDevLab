"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { loginInputSchema } from "@/validations/auth";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export interface LoginActionState {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = loginInputSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Verifique os campos preenchidos.",
    };
  }

  const { email, password } = parsed.data;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.isActive) {
      return {
        success: false,
        message: "E-mail ou senha incorretos.",
      };
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return {
        success: false,
        message: "E-mail ou senha incorretos.",
      };
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Erro durante autenticação:", error);
    return {
      success: false,
      message: "Erro no servidor ao processar o login. Tente novamente.",
    };
  }

  redirect("/admin");
}

