import { describe, expect, it } from "vitest";
import { contentRelationSchema } from "@/validations/relations";

describe("contentRelationSchema", () => {
  const sourceId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const targetId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

  it("aceita relação entre dois conteúdos distintos", () => {
    const result = contentRelationSchema.safeParse({
      sourceId,
      targetId,
      relationType: "related",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita auto-relação onde sourceId e targetId são iguais", () => {
    const result = contentRelationSchema.safeParse({
      sourceId,
      targetId: sourceId,
      relationType: "related",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain(
        "Não é permitido relacionar um conteúdo consigo mesmo"
      );
    }
  });
});
