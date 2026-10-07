import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Gera um hash seguro da senha com salt aleatório usando scrypt.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Compara uma senha em texto puro contra o hash no formato salt:key.
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, key] = hash.split(":");
    if (!salt || !key) {
      return false;
    }

    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = scryptSync(password, salt, 64);

    return timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
