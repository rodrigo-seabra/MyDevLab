import { z } from "zod";

export const reviewDecisionSchema = z.enum(["approved", "rejected"]);

export const reviewActionSchema = z
  .object({
    contentId: z.string().uuid("ID de conteúdo inválido"),
    reviewerId: z.string().uuid("ID de revisor inválido"),
    decision: reviewDecisionSchema,
    reason: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.decision === "rejected") {
      if (!data.reason || data.reason.trim().length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A rejeição exige justificativa obrigatória com no mínimo 20 caracteres.",
          path: ["reason"],
        });
      }
    }
  });

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;
