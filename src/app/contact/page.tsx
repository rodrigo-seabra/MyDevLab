import { contactMessageSchema } from "@/validations/contact-message";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="max-w-2xl space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-caps text-primary">Contact</p>
        <h1 className="text-4xl font-bold text-foreground">Contato</h1>
        <p className="leading-8 text-muted-foreground">
          O formulário já define a base de validação para uma futura integração de mensagens.
        </p>
      </div>

        <form className="space-y-5 rounded-xl border border-border bg-surface-muted p-6" action="#" method="post">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="name">Nome</label>
          <input className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground" id="name" name="name" required minLength={2} maxLength={120} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="email">Email</label>
          <input className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground" id="email" name="email" type="email" required maxLength={254} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="message">Mensagem</label>
          <textarea className="min-h-36 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground" id="message" name="message" required minLength={10} maxLength={5000} />
        </div>
        <button className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover" type="submit">
          Enviar mensagem
        </button>
        <p className="text-sm text-muted-foreground">Validação preparada: {contactMessageSchema.description ?? "Zod"}.</p>
      </form>
    </section>
  );
}
