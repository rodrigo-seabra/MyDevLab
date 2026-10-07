"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";

const recoveryActionSchema = z
  .object({
    recoverySecret: z
      .string()
      .trim()
      .min(16, "O segredo de recuperação deve ter pelo menos 16 caracteres"),
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter no mínimo 8 caracteres")
      .max(100),
    confirmPassword: z.string().min(8, "Confirmação de senha obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas digitadas não coincidem.",
    path: ["confirmPassword"],
  });

export interface RecoveryActionState {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
}

export async function recoveryAction(
  _prevState: RecoveryActionState,
  formData: FormData
): Promise<RecoveryActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = recoveryActionSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Verifique os dados preenchidos.",
    };
  }

  const { recoverySecret, newPassword } = parsed.data;

  try {
    const [recoveryAccount] = await db
      .select()
      .from(users)
      .where(eq(users.role, "recovery"))
      .limit(1);

    if (!recoveryAccount || !recoveryAccount.recoverySecretHash) {
      return {
        success: false,
        message: "Conta de contingência/recuperação não provisionada no sistema.",
      };
    }

    const isValidSecret = verifyPassword(
      recoverySecret,
      recoveryAccount.recoverySecretHash
    );

    if (!isValidSecret) {
      return {
        success: false,
        message: "Segredo de recuperação incorreto ou inválido.",
      };
    }

    const [founder] = await db
      .select()
      .from(users)
      .where(eq(users.role, "founder"))
      .limit(1);

    if (!founder) {
      return {
        success: false,
        message: "Conta Founder principal não encontrada no banco.",
      };
    }

    const newHash = hashPassword(newPassword);
    await db
      .update(users)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, founder.id));

    return {
      success: true,
      message: "Senha do Founder redefinida com sucesso! Redirecionando para o login...",
    };
  } catch (error) {
    console.error("Erro na recuperação do Founder:", error);
    return {
      success: false,
      message: "Erro interno no servidor ao validar a recuperação.",
    };
  }
}
