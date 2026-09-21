export const metadata = { title: "Articles" };

export default function ArticlesPage() {
  return (
    <section className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Articles</p>
      <h1 className="text-4xl font-bold text-white">Artigos</h1>
      <p className="max-w-2xl text-lg leading-8 text-slate-300">
        Textos técnicos sobre backend, APIs, dados, integrações, arquitetura e engenharia de
        software serão publicados aqui.
      </p>
    </section>
  );
}
