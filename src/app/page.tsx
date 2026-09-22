import Link from "next/link";

const highlights = [
  ["Projects", "Projetos e estudos de caso com contexto, decisões e aprendizados."],
  ["Articles", "Textos técnicos sobre software, integrações, dados e confiabilidade."],
  ["Labs", "Experimentos reproduzíveis para investigar ideias de engenharia."],
] as const;

export default function HomePage() {
  return (
    <section className="space-y-16">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-caps text-primary">MyDevLab</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Engenharia de software, documentada na prática.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Um portfolio técnico e laboratório pessoal para compartilhar projetos, pesquisas,
          experimentos e o raciocínio por trás das decisões.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover" href="/projects">
            Ver projetos
          </Link>
          <Link className="rounded-full border border-border px-5 py-3 font-semibold text-foreground hover:border-primary" href="/about">
            Sobre o laboratório
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {highlights.map(([title, description]) => (
          <article className="rounded-xl border border-border bg-surface-muted p-6" key={title}>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
