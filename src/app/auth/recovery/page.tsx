import type { Metadata } from "next";
import { RecoveryForm } from "./recovery-form";

export const metadata: Metadata = {
  title: "Recuperação do Founder — MyDevLab",
  description: "Redefinição de acesso emergencial da conta Founder",
};

export default function RecoveryPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <RecoveryForm />
    </main>
  );
}

