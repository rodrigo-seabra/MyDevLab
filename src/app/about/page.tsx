export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="max-w-3xl space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-tech-blue">About</p>
      <h1 className="text-4xl font-bold text-white">Um espaço para construir e pensar.</h1>
      <p className="text-lg leading-8 text-state-gray">
        O MyDevLab reúne trabalho técnico, escrita e experimentação em um ambiente pequeno,
        reproduzível e aberto a evolução incremental.
      </p>
      <p className="leading-8 text-state-gray">
        O foco está em problemas reais de software: integrações, APIs, bancos de dados,
        confiabilidade, sistemas legados e decisões arquiteturais.
      </p>
    </section>
  );
}
