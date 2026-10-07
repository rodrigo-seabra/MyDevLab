"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">Ocorreu um erro crítico</h2>
          <p className="text-neutral-400 text-sm">
            Não foi possível carregar a aplicação. Tente recarregar a página.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-white text-black font-semibold rounded-md hover:bg-neutral-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
