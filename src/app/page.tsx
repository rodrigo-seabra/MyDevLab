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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-tech-blue">MyDevLab</p>
        <h1 className="text-4xl font-bold tracking-tight text-off-white sm:text-6xl">
          Engenharia de software, documentada na prática.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-state-gray">
          Um portfolio técnico e laboratório pessoal para compartilhar projetos, pesquisas,
          experimentos e o raciocínio por trás das decisões.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link className="rounded-full bg-tech-blue px-5 py-3 font-semibold text-off-white hover:bg-blue-500" href="/projects">
            Ver projetos
          </Link>
          <Link className="rounded-full border border-charcoal px-5 py-3 font-semibold text-off-white hover:border-tech-blue" href="/about">
            Sobre o laboratório
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {highlights.map(([title, description]) => (
          <article className="rounded-2xl border border-charcoal bg-charcoal/60 p-6" key={title}>
            <h2 className="text-xl font-semibold text-off-white">{title}</h2>
            <p className="mt-3 leading-7 text-state-gray">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
