"use client";

import { useTransition } from "react";
import { logoutAction } from "./actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? "Saindo..." : "Encerrar Sessão"}
    </Button>
  );
}

