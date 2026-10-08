import { eq } from "drizzle-orm";
import { db, pool } from "./index";
import { users, adminCapabilities, adminCapabilityEnum } from "./schema/auth";
import { hashPassword } from "@/lib/password";

const FOUNDER_EMAIL = process.env.MYDEVLAB_FOUNDER_EMAIL?.trim();
const FOUNDER_PASSWORD = process.env.MYDEVLAB_FOUNDER_PASSWORD;
const FOUNDER_NAME = process.env.MYDEVLAB_FOUNDER_NAME?.trim() || "Founder";

const RECOVERY_EMAIL =
  process.env.MYDEVLAB_RECOVERY_EMAIL?.trim() || "recovery@mydevlab.local";
const RECOVERY_SECRET = process.env.MYDEVLAB_RECOVERY_SECRET?.trim();
const RECOVERY_NAME =
  process.env.MYDEVLAB_RECOVERY_NAME?.trim() || "Conta Recovery Operacional";

export interface SeedResult {
  founder: {
    id: string;
    email: string;
    name: string;
    isNew: boolean;
  };
  recovery: {
    id: string;
    email: string;
    name: string;
    recoverySecret: string;
    isNew: boolean;
  };
}

export async function runSeed(): Promise<SeedResult> {
  console.log("🌱 [MyDevLab Bootstrap] Iniciando seed de contas essenciais...");

  if (!FOUNDER_EMAIL || !FOUNDER_PASSWORD) {
    throw new Error(
      "❌ [Bootstrap] Variáveis obrigatórias da conta Founder ausentes. Configure MYDEVLAB_FOUNDER_EMAIL e MYDEVLAB_FOUNDER_PASSWORD no .env."
    );
  }

  if (!RECOVERY_SECRET) {
    throw new Error(
      "❌ [Bootstrap] Variável obrigatória da conta Recovery ausente. Configure MYDEVLAB_RECOVERY_SECRET no .env."
    );
  }

  // 1. Provisionar / Atualizar Conta Founder Principal (RN-006 / UC-01)
  const [existingFounder] = await db
    .select()
    .from(users)
    .where(eq(users.role, "founder"))
    .limit(1);

  let founderId: string;
  let isFounderNew = false;
  const founderHash = hashPassword(FOUNDER_PASSWORD);

  if (existingFounder) {
    founderId = existingFounder.id;
    await db
      .update(users)
      .set({
        email: FOUNDER_EMAIL,
        name: FOUNDER_NAME,
        passwordHash: founderHash,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingFounder.id));
    console.log(
      `ℹ️  [Founder] Conta Founder existente atualizada para: ${FOUNDER_EMAIL}`
    );
  } else {
    const [created] = await db
      .insert(users)
      .values({
        email: FOUNDER_EMAIL,
        name: FOUNDER_NAME,
        passwordHash: founderHash,
        role: "founder",
        isActive: true,
      })
      .returning({ id: users.id });
    founderId = created.id;
    isFounderNew = true;
    console.log(
      `✅ [Founder] Conta Founder principal criada com sucesso: ${FOUNDER_EMAIL}`
    );
  }

  // Atribuir todas as capacidades administrativas ao Founder
  const allCapabilities = adminCapabilityEnum.enumValues;
  for (const capability of allCapabilities) {
    await db
      .insert(adminCapabilities)
      .values({
        userId: founderId,
        capability,
      })
      .onConflictDoNothing();
  }
  console.log("✅ [Founder] Capacidades administrativas atribuídas.");

  // 2. Provisionar Conta Recovery (RN-006, RN-008, RN-009 / UC-01, UC-03)
  const [existingRecovery] = await db
    .select()
    .from(users)
    .where(eq(users.role, "recovery"))
    .limit(1);

  let recoveryId: string;
  let isRecoveryNew = false;
  const recoverySecretHash = hashPassword(RECOVERY_SECRET);
  const recoveryPlaceholderHash = hashPassword("unusable-recovery-placeholder-pwd");

  if (existingRecovery) {
    recoveryId = existingRecovery.id;
    await db
      .update(users)
      .set({
        email: RECOVERY_EMAIL,
        name: RECOVERY_NAME,
        recoverySecretHash,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingRecovery.id));
    console.log(
      `ℹ️  [Recovery] Conta Recovery existente atualizada: ${RECOVERY_EMAIL}`
    );
  } else {
    const [created] = await db
      .insert(users)
      .values({
        email: RECOVERY_EMAIL,
        name: RECOVERY_NAME,
        passwordHash: recoveryPlaceholderHash,
        recoverySecretHash,
        role: "recovery",
        isActive: true,
      })
      .returning({ id: users.id });
    recoveryId = created.id;
    isRecoveryNew = true;
    console.log(
      `✅ [Recovery] Conta Recovery provisionada com sucesso: ${RECOVERY_EMAIL}`
    );
  }

  console.log("\n=======================================================");
  console.log("🎉 Bootstrap concluído com sucesso!");
  console.log("-------------------------------------------------------");
  console.log(`👤 Founder Principal:`);
  console.log(`   E-mail:   ${FOUNDER_EMAIL}`);
  console.log(`   Role:     founder`);
  console.log(`   Status:   Ativo`);
  console.log(`🛡️  Conta Recovery (RN-006/RN-008):`);
  console.log(`   E-mail:   ${RECOVERY_EMAIL}`);
  console.log(`   Segredo:  ${RECOVERY_SECRET}`);
  console.log(`   Rota:     /auth/recovery`);
  console.log("=======================================================\n");

  return {
    founder: {
      id: founderId,
      email: FOUNDER_EMAIL,
      name: FOUNDER_NAME,
      isNew: isFounderNew,
    },
    recovery: {
      id: recoveryId,
      email: RECOVERY_EMAIL,
      name: RECOVERY_NAME,
      recoverySecret: RECOVERY_SECRET,
      isNew: isRecoveryNew,
    },
  };
}

// Execução direta CLI via `npm run db:seed` ou `npx tsx src/db/seed.ts`
if (process.argv[1]?.includes("seed")) {
  runSeed()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Falha crítica ao executar bootstrap/seed:", err);
      await pool.end();
      process.exit(1);
    });
}
