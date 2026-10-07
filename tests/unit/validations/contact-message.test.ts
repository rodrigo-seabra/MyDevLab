import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "@/validations/contact-message";

describe("contactMessageSchema", () => {
  it("aceita uma mensagem de contato válida", () => {
    const result = contactMessageSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Gostaria de conversar sobre este projeto.",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita email inválido e mensagem muito curta", () => {
    const result = contactMessageSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "curto",
    });

    expect(result.success).toBe(false);
  });
});
