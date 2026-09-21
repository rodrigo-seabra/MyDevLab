import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "@/validations/contact-message";

describe("contactMessageSchema", () => {
  it("accepts a valid contact message", () => {
    const result = contactMessageSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Gostaria de conversar sobre este projeto.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email and a short message", () => {
    const result = contactMessageSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "curto",
    });

    expect(result.success).toBe(false);
  });
});
