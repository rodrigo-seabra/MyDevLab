import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password utilities", () => {
  it("gera hashes diferentes para a mesma senha devido ao salt aleatório", () => {
    const password = "mysecurepassword123";
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);

    expect(hash1).not.toBe(hash2);
    expect(hash1).toContain(":");
  });

  it("verifica com sucesso a senha correta", () => {
    const password = "mysecurepassword123";
    const hash = hashPassword(password);

    expect(verifyPassword(password, hash)).toBe(true);
  });

  it("rejeita senha incorreta", () => {
    const password = "mysecurepassword123";
    const hash = hashPassword(password);

    expect(verifyPassword("wrongpassword", hash)).toBe(false);
  });

  it("rejeita hashes malformados sem lançar exceção", () => {
    expect(verifyPassword("password", "invalidhashformat")).toBe(false);
    expect(verifyPassword("password", "")).toBe(false);
  });
});
