import { describe, expect, it } from "vitest";
import {
  createUserInputSchema,
  loginInputSchema,
  recoverySecretSchema,
} from "@/validations/auth";

describe("auth validations", () => {
  describe("loginInputSchema", () => {
    it("valida login com email e senha válidos", () => {
      const result = loginInputSchema.safeParse({
        email: "founder@mydevlab.local",
        password: "supersecretpassword123",
      });
      expect(result.success).toBe(true);
    });

    it("rejeita senha com menos de 8 caracteres", () => {
      const result = loginInputSchema.safeParse({
        email: "founder@mydevlab.local",
        password: "short",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createUserInputSchema", () => {
    it("valida criação de usuário com role e dados válidos", () => {
      const result = createUserInputSchema.safeParse({
        email: "admin@mydevlab.local",
        password: "strongpassword123",
        name: "Admin User",
        role: "admin",
      });
      expect(result.success).toBe(true);
    });

    it("rejeita role inexistente", () => {
      const result = createUserInputSchema.safeParse({
        email: "admin@mydevlab.local",
        password: "strongpassword123",
        name: "Admin User",
        role: "superadmin_invalid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("recoverySecretSchema", () => {
    it("aceita segredo de recuperação com tamanho suficiente", () => {
      const result = recoverySecretSchema.safeParse({
        recoverySecret: "sec-recovery-secret-mydevlab-v1-token",
      });
      expect(result.success).toBe(true);
    });

    it("rejeita segredo de recuperação muito curto", () => {
      const result = recoverySecretSchema.safeParse({
        recoverySecret: "too-short",
      });
      expect(result.success).toBe(false);
    });
  });
});
