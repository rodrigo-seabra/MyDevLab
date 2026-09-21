import { contactMessageSchema } from "@/validations/contact-message";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Contact</p>
        <h1 className="text-4xl font-bold text-white">Contato</h1>
        <p className="leading-8 text-slate-300">
          O formulário já define a base de validação para uma futura integração de mensagens.
        </p>
      </div>

      <form className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6" action="#" method="post">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="name">Nome</label>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white" id="name" name="name" required minLength={2} maxLength={120} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">Email</label>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white" id="email" name="email" type="email" required maxLength={254} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="message">Mensagem</label>
          <textarea className="min-h-36 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white" id="message" name="message" required minLength={10} maxLength={5000} />
        </div>
        <button className="rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-200" type="submit">
          Enviar mensagem
        </button>
        <p className="text-sm text-slate-500">Validação preparada: {contactMessageSchema.description ?? "Zod"}.</p>
      </form>
    </section>
  );
}
