import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login — MyDevLab",
  description: "Acesso administrativo à plataforma MyDevLab",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  );
}
