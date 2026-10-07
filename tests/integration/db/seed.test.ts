import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, adminCapabilities } from "@/db/schema/auth";
import { verifyPassword } from "@/lib/password";
import { runSeed } from "@/db/seed";

describe("database seed & bootstrap integration", () => {
  it("provisiona e valida as contas Founder e Recovery com sucesso (RN-006, RN-008)", async () => {
    const result = await runSeed();

    expect(result.founder.email).toBe("rodrigo.seabra01@outlook.com");
    expect(result.recovery.email).toBe("recovery@mydevlab.local");
    expect(result.recovery.recoverySecret.length).toBeGreaterThanOrEqual(16);

    // Consulta direta no banco para validar integridade
    const [founderDb] = await db
      .select()
      .from(users)
      .where(eq(users.role, "founder"))
      .limit(1);

    expect(founderDb).toBeDefined();
    expect(founderDb.email).toBe("rodrigo.seabra01@outlook.com");
    expect(founderDb.name).toBe("Rodrigo Seabra");
    expect(founderDb.isActive).toBe(true);
    expect(verifyPassword("senha123456", founderDb.passwordHash)).toBe(true);

    const [recoveryDb] = await db
      .select()
      .from(users)
      .where(eq(users.role, "recovery"))
      .limit(1);

    expect(recoveryDb).toBeDefined();
    expect(recoveryDb.email).toBe("recovery@mydevlab.local");
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
