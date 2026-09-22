export const metadata = { title: "Articles" };

export default function ArticlesPage() {
  return (
    <section className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-caps text-primary">Articles</p>
      <h1 className="text-4xl font-bold text-foreground">Artigos</h1>
      <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
        Textos técnicos sobre backend, APIs, dados, integrações, arquitetura e engenharia de
        software serão publicados aqui.
      </p>
    </section>
  );
}
