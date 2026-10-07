import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "mydevlab_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "founder" | "recovery" | "admin" | "author";
}

/**
 * Cria ou atualiza o cookie de sessão httpOnly do usuário autenticado.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const serialized = Buffer.from(JSON.stringify(user)).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

/**
 * Recupera o usuário da sessão ativa ou null se não autenticado.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!cookie?.value) {
    return null;
  }

  try {
    const raw = Buffer.from(cookie.value, "base64").toString("utf-8");
    const parsed = JSON.parse(raw) as SessionUser;

    if (!parsed.id || !parsed.email || !parsed.role) {
      return null;
    }

    return parsed;
  } catch {
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
