import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  getSessionSecret,
  type SessionUser,
} from "@/lib/session";

describe("session cryptographic utilities", () => {
  const originalEnv = { ...process.env };

  const testUser: SessionUser = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    email: "founder@mydevlab.local",
    name: "Founder Teste",
    role: "founder",
  };

  beforeEach(() => {
    process.env.MYDEVLAB_SESSION_SECRET =
      "test-session-secret-key-with-at-least-32-characters-for-hmac";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("cria um token assinado no formato payload.assinatura", () => {
    const token = createSessionToken(testUser);
    const parts = token.split(".");

    expect(parts.length).toBe(2);
    expect(parts[0]?.length).toBeGreaterThan(10);
    expect(parts[1]?.length).toBe(64); // SHA-256 hex digest tem 64 caracteres
  });

  it("valida com sucesso um token legítimo recém-gerado", () => {
    const token = createSessionToken(testUser);
    const payload = verifySessionToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe(testUser.id);
    expect(payload?.email).toBe(testUser.email);
    expect(payload?.name).toBe(testUser.name);
    expect(payload?.role).toBe(testUser.role);
    expect(payload?.exp).toBeGreaterThan(Date.now());
  });

  it("rejeita e retorna null para token com payload adulterado (privilege escalation prevention)", () => {
    const regularUser: SessionUser = {
      id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      email: "author@mydevlab.local",
      name: "Author User",
      role: "author",
    };

    const token = createSessionToken(regularUser);
    const [payloadBase64, signature] = token.split(".");

    // Invasor decodifica e tenta forjar role para 'founder'
    const raw = Buffer.from(payloadBase64!, "base64url").toString("utf-8");
    const tampered = JSON.parse(raw);
    tampered.role = "founder";
    const forgedPayloadBase64 = Buffer.from(JSON.stringify(tampered)).toString("base64url");

    // Envia payload forjado com a assinatura antiga
    const forgedToken = `${forgedPayloadBase64}.${signature}`;
    const result = verifySessionToken(forgedToken);

    expect(result).toBeNull();
  });

  it("rejeita e retorna null para token com assinatura adulterada", () => {
    const token = createSessionToken(testUser);
    const [payloadBase64, signature] = token.split(".");

    // Adulterar o último caractere da assinatura
    const lastChar = signature!.slice(-1);
    const corruptedLastChar = lastChar === "0" ? "1" : "0";
    const tamperedSignature = signature!.slice(0, -1) + corruptedLastChar;

    const tamperedToken = `${payloadBase64}.${tamperedSignature}`;
    const result = verifySessionToken(tamperedToken);

    expect(result).toBeNull();
  });

  it("rejeita e retorna null para tokens com formato inválido", () => {
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("invalid-token-without-dot")).toBeNull();
    expect(verifySessionToken("a.b.c")).toBeNull();
    expect(verifySessionToken(".")).toBeNull();
    expect(verifySessionToken("invalid-base64.not-hex-sig")).toBeNull();
  });

  it("rejeita e retorna null para token expirado", () => {
    // Cria token que já expirou há 1 segundo
    const expiredToken = createSessionToken(testUser, -1000);
    const result = verifySessionToken(expiredToken);

    expect(result).toBeNull();
  });

  it("rejeita token assinado com chave secreta divergente", () => {
    const token = createSessionToken(testUser);

    // Troca o segredo no ambiente
    process.env.MYDEVLAB_SESSION_SECRET =
      "different-secret-key-which-should-fail-verification-hmac-32";

    const result = verifySessionToken(token);
    expect(result).toBeNull();
  });

  it("getSessionSecret respeita a variável de ambiente configurada", () => {
    process.env.MYDEVLAB_SESSION_SECRET = "custom-key-secret-1234567890-test";
    expect(getSessionSecret()).toBe("custom-key-secret-1234567890-test");
  });

  it("getSessionSecret lança erro em ambiente de produção se ausente", () => {
    delete process.env.MYDEVLAB_SESSION_SECRET;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    expect(() => getSessionSecret()).toThrow(
      "MYDEVLAB_SESSION_SECRET must be configured in production environment."
    );
  });
});
