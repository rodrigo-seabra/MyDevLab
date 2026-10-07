import { z } from "zod";

export const relationTypeSchema = z
  .string()
  .trim()
  .min(2, "Tipo de relação deve ter no mínimo 2 caracteres")
  .max(50, "Tipo de relação deve ter no máximo 50 caracteres");

export const contentRelationSchema = z
  .object({
    sourceId: z.string().uuid("ID de origem inválido"),
    targetId: z.string().uuid("ID de destino inválido"),
    relationType: relationTypeSchema.default("related"),
  })
  .superRefine((data, ctx) => {
    if (data.sourceId === data.targetId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Não é permitido relacionar um conteúdo consigo mesmo.",
        path: ["targetId"],
      });
    }
  });

export type ContentRelationInput = z.infer<typeof contentRelationSchema>;
