import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, adminCapabilities } from "@/db/schema/auth";
import { verifyPassword } from "@/lib/password";
import { runSeed } from "@/db/seed";

const testFounderEmail =
  process.env.MYDEVLAB_FOUNDER_EMAIL ?? "founder.test@mydevlab.local";
const testFounderPassword =
  process.env.MYDEVLAB_FOUNDER_PASSWORD ?? "senha-segura-teste-123456";
const testFounderName =
  process.env.MYDEVLAB_FOUNDER_NAME ?? "Founder Teste";
const testRecoveryEmail =
  process.env.MYDEVLAB_RECOVERY_EMAIL ?? "recovery@mydevlab.local";
const testRecoverySecret =
  process.env.MYDEVLAB_RECOVERY_SECRET ?? "emergency-recovery-key-test-2026";

describe("database seed & bootstrap integration", () => {
  it("provisiona e valida as contas Founder e Recovery com sucesso (RN-006, RN-008)", async () => {
    // Garantir que as variáveis estejam no escopo de execução
    process.env.MYDEVLAB_FOUNDER_EMAIL = testFounderEmail;
    process.env.MYDEVLAB_FOUNDER_PASSWORD = testFounderPassword;
    process.env.MYDEVLAB_FOUNDER_NAME = testFounderName;
    process.env.MYDEVLAB_RECOVERY_EMAIL = testRecoveryEmail;
    process.env.MYDEVLAB_RECOVERY_SECRET = testRecoverySecret;

    const result = await runSeed();

    expect(result.founder.email).toBe(testFounderEmail);
    expect(result.recovery.email).toBe(testRecoveryEmail);
    expect(result.recovery.recoverySecret.length).toBeGreaterThanOrEqual(16);

    // Consulta direta no banco para validar integridade
    const [founderDb] = await db
      .select()
      .from(users)
      .where(eq(users.role, "founder"))
      .limit(1);

    expect(founderDb).toBeDefined();
    expect(founderDb.email).toBe(testFounderEmail);
    expect(founderDb.name).toBe(testFounderName);
    expect(founderDb.isActive).toBe(true);
    expect(verifyPassword(testFounderPassword, founderDb.passwordHash)).toBe(true);

    const [recoveryDb] = await db
      .select()
      .from(users)
      .where(eq(users.role, "recovery"))
      .limit(1);

    expect(recoveryDb).toBeDefined();
    expect(recoveryDb.email).toBe(testRecoveryEmail);
    expect(recoveryDb.recoverySecretHash).not.toBeNull();
    expect(
      verifyPassword(
        result.recovery.recoverySecret,
        recoveryDb.recoverySecretHash!
      )
    ).toBe(true);

    // Validar capacidades do Founder
    const capabilities = await db
      .select()
      .from(adminCapabilities)
      .where(eq(adminCapabilities.userId, founderDb.id));

    expect(capabilities.length).toBe(7);
  });

  it("mantém idempotência sem duplicar registros ao executar novamente", async () => {
    const secondRun = await runSeed();

    expect(secondRun.founder.isNew).toBe(false);
    expect(secondRun.recovery.isNew).toBe(false);

    const allFounders = await db
      .select()
      .from(users)
      .where(eq(users.role, "founder"));

    const allRecoveries = await db
      .select()
      .from(users)
      .where(eq(users.role, "recovery"));

    expect(allFounders.length).toBe(1);
    expect(allRecoveries.length).toBe(1);
  });
});
