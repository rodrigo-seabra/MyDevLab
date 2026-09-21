export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <section className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Projects</p>
      <h1 className="text-4xl font-bold text-white">Projetos</h1>
      <p className="max-w-2xl text-lg leading-8 text-slate-300">
        Esta área receberá projetos e estudos de caso com contexto, arquitetura, implementação,
        desafios e lições aprendidas.
      </p>
    </section>
  );
}
