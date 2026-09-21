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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">MyDevLab</p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Engenharia de software, documentada na prática.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-300">
          Um portfolio técnico e laboratório pessoal para compartilhar projetos, pesquisas,
          experimentos e o raciocínio por trás das decisões.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link className="rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-200" href="/projects">
            Ver projetos
          </Link>
          <Link className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-slate-100 hover:border-cyan-300" href="/about">
            Sobre o laboratório
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {highlights.map(([title, description]) => (
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6" key={title}>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-3 leading-7 text-slate-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
