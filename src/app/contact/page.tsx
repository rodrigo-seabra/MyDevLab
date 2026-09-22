import { contactMessageSchema } from "@/validations/contact-message";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-tech-blue">Contact</p>
        <h1 className="text-4xl font-bold text-white">Contato</h1>
        <p className="leading-8 text-state-gray">
          O formulário já define a base de validação para uma futura integração de mensagens.
        </p>
      </div>

      <form className="space-y-5 rounded-2xl border border-charcoal bg-charcoal/60 p-6" action="#" method="post">
        <div>
          <label className="mb-2 block text-sm font-medium text-off-white" htmlFor="name">Nome</label>
          <input className="w-full rounded-lg border border-charcoal bg-deep-navy px-4 py-3 text-off-white" id="name" name="name" required minLength={2} maxLength={120} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-off-white" htmlFor="email">Email</label>
          <input className="w-full rounded-lg border border-charcoal bg-deep-navy px-4 py-3 text-off-white" id="email" name="email" type="email" required maxLength={254} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-off-white" htmlFor="message">Mensagem</label>
          <textarea className="min-h-36 w-full rounded-lg border border-charcoal bg-deep-navy px-4 py-3 text-off-white" id="message" name="message" required minLength={10} maxLength={5000} />
        </div>
        <button className="rounded-full bg-tech-blue px-5 py-3 font-semibold text-off-white hover:bg-blue-500" type="submit">
          Enviar mensagem
        </button>
        <p className="text-sm text-state-gray">Validação preparada: {contactMessageSchema.description ?? "Zod"}.</p>
      </form>
    </section>
  );
}
