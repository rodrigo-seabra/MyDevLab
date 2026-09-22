export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <section className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-caps text-primary">Projects</p>
      <h1 className="text-4xl font-bold text-foreground">Projetos</h1>
      <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
        Esta área receberá projetos e estudos de caso com contexto, arquitetura, implementação,
        desafios e lições aprendidas.
      </p>
    </section>
  );
}
