import { z } from "zod";

export const userRoleSchema = z.enum(["founder", "recovery", "admin", "author"]);

export const adminCapabilitySchema = z.enum([
  "review_queue.view",
  "content.approve",
  "content.edit_others",
  "tags.manage",
  "relations.manage",
  "media.manage",
  "content.archive",
]);

export const loginInputSchema = z.object({
  email: z.string().trim().email("Email inválido").max(254),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(100),
});

export const createUserInputSchema = z.object({
  email: z.string().trim().email("Email inválido").max(254),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(100),
  name: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(120),
  role: userRoleSchema,
});

export const grantCapabilitySchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
  capability: adminCapabilitySchema,
});

export const recoverySecretSchema = z.object({
  recoverySecret: z
    .string()
    .trim()
    .min(16, "O segredo de recuperação deve ter pelo menos 16 caracteres")
    .max(128),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type GrantCapabilityInput = z.infer<typeof grantCapabilitySchema>;
export type RecoverySecretInput = z.infer<typeof recoverySecretSchema>;
