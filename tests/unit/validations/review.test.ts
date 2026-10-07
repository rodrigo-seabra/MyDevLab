import { describe, expect, it } from "vitest";
import { reviewActionSchema } from "@/validations/review";

describe("reviewActionSchema", () => {
  const contentId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const reviewerId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

  it("aceita aprovação sem justificativa", () => {
    const result = reviewActionSchema.safeParse({
      contentId,
      reviewerId,
      decision: "approved",
    });
    expect(result.success).toBe(true);
  });

  it("aceita aprovação com justificativa opcional", () => {
    const result = reviewActionSchema.safeParse({
      contentId,
      reviewerId,
      decision: "approved",
      reason: "Artigo excelente e pronto para publicação.",
    });
    expect(result.success).toBe(true);
  });

  it("aceita rejeição com justificativa detalhada com mais de 20 caracteres", () => {
    const result = reviewActionSchema.safeParse({
      contentId,
      reviewerId,
      decision: "rejected",
      reason: "O resumo técnico precisa de referências adicionais e correções no diagrama.",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita decisão de rejeição sem justificativa", () => {
    const result = reviewActionSchema.safeParse({
      contentId,
      reviewerId,
      decision: "rejected",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita decisão de rejeição com justificativa menor que 20 caracteres (RN-015)", () => {
    const result = reviewActionSchema.safeParse({
      contentId,
      reviewerId,
      decision: "rejected",
      reason: "Muito curto",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain(
        "no mínimo 20 caracteres"
      );
    }
  });
});
