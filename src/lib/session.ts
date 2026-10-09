import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "mydevlab_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias
const DEFAULT_DEV_SESSION_SECRET =
  "mydevlab-insecure-dev-session-secret-change-in-production-min-32-chars";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "founder" | "recovery" | "admin" | "author";
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: "founder" | "recovery" | "admin" | "author";
  iat: number;
  exp: number;
}

/**
 * Obtém a chave de assinatura de sessão. Lança erro em ambiente de produção se ausente.
 */
export function getSessionSecret(): string {
  const secret = process.env.MYDEVLAB_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "MYDEVLAB_SESSION_SECRET must be configured in production environment."
      );
    }
    return DEFAULT_DEV_SESSION_SECRET;
  }
  return secret;
}

/**
 * Assina um payload arbitrário usando HMAC-SHA256.
 */
export function signPayload(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("hex");
}

/**
 * Gera um token assinado no formato payloadBase64.assinaturaHex.
 */
export function createSessionToken(
  user: SessionUser,
  customExpiresInMs?: number
): string {
  const now = Date.now();
  const maxAgeMs = customExpiresInMs ?? SESSION_MAX_AGE_SECONDS * 1000;
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + maxAgeMs,
  };

  const serialized = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(serialized, getSessionSecret());
  return `${serialized}.${signature}`;
}

/**
 * Valida a integridade, expiração e assinatura de um token de sessão.
 * Retorna o payload decodificado se válido, ou null se corrompido/adulterado/expirado.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) {
      return null;
    }

    const [payloadBase64, providedSignature] = parts;
    if (!payloadBase64 || !providedSignature) {
      return null;
    }

    const secret = getSessionSecret();
    const expectedSignature = signPayload(payloadBase64, secret);

    const providedBuf = Buffer.from(providedSignature, "hex");
    const expectedBuf = Buffer.from(expectedSignature, "hex");

    if (
      providedBuf.length !== expectedBuf.length ||
      !timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return null;
    }

    const raw = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(raw) as SessionPayload;

    if (!payload.sub || !payload.email || !payload.role || !payload.exp) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Cria ou atualiza o cookie de sessão httpOnly do usuário autenticado.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken(user);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Recupera o usuário da sessão ativa ou null se não autenticado.
 * Valida tanto a integridade da assinatura criptográfica quanto o status ativo do usuário no banco.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!cookie?.value) {
    return null;
  }

  const payload = verifySessionToken(cookie.value);
  if (!payload) {
    return null;
  }

  try {
    const { db } = await import("@/db");
    const { users } = await import("@/db/schema/auth");
    const { eq } = await import("drizzle-orm");

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user || !user.isActive || user.role !== payload.role) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("Erro ao validar sessão contra o banco de dados:", error);
    return null;
  }
}

/**
 * Encerra a sessão removendo o cookie httpOnly.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
