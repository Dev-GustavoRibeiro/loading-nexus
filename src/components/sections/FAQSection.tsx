"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"
import { SUPPORT_WHATSAPP_LABEL, SUPPORT_WHATSAPP_URL } from "@/lib/support"

const faqs = [
  {
    q: "Como funciona a licença?",
    a: "A licença é vinculada à sua conta (e-mail) após a assinatura. Você pode usar o app em uma máquina Windows por vez e trocar de dispositivo pelo painel quando quiser. O plano anual inclui 1 dia de teste no primeiro ciclo (mensal e semestral não). O acesso ao software depende de plano ativo após o checkout.",
  },
  {
    q: "Posso usar em mais de uma máquina?",
    a: "Você pode usar em apenas uma máquina Windows por vez. Porém, trocar de dispositivo é simples e rápido — basta desativar a máquina atual no painel e ativar a nova. O processo leva menos de 1 minuto e pode ser feito quantas vezes quiser.",
  },
  {
    q: "O Loading Nexus é seguro?",
    a: "O foco é otimização legítima do Windows e do hardware (limpeza, ajustes e métricas). Não promovemos batota em jogos nem violação de termos de serviço de terceiros. Use sempre de acordo com as regras das plataformas e jogos que utiliza. Temos milhares de utilizadores ativos; em caso de dúvida jurídica ou de produto, contacte-nos pelo WhatsApp antes de usar em ambientes corporativos restritivos.",
  },
  {
    q: "Quando tenho acesso após contratar?",
    a: "O acesso é imediato após a confirmação do pagamento. Você receberá as credenciais por e-mail em minutos. O processo de instalação e configuração leva em média 3 minutos.",
  },
  {
    q: "Funciona no Mac ou no Linux?",
    a: "Por enquanto, não. O aplicativo desktop do Loading Nexus roda apenas no Microsoft Windows (idealmente Windows 10 ou 11). Você pode usar o site e gerir a conta em qualquer dispositivo com navegador; já o instalador e o painel local são só no Windows. Outras plataformas podem ser consideradas no futuro.",
  },
  {
    q: "Serve só para jogos?",
    a: "Não. Muita gente usa para ganhar FPS e estabilidade em jogos competitivos, mas o Loading Nexus também ajuda em multitarefa pesada, streaming (ex.: OBS), suites criativas, desenvolvimento e qualquer fluxo em que o Windows precise responder rápido e de forma previsível. Funciona no Windows moderno; jogos específicos beneficiam quando o gargalo é sistema ou configuração.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, absolutamente. Não há fidelidade nem taxa de cancelamento. Você pode cancelar sua assinatura a qualquer momento diretamente pelo painel do usuário. O acesso permanece ativo até o fim do período já pago.",
  },
  {
    q: "Qual forma de pagamento é aceita?",
    a: "Aceitamos cartão de crédito (parcelamento disponível), PIX e boleto bancário. Os pagamentos são processados com segurança pela Stripe, líder mundial em processamento de pagamentos.",
  },
  {
    q: "E se eu tiver problemas técnicos?",
    a: `O suporte é feito apenas pelo WhatsApp (${SUPPORT_WHATSAPP_LABEL}). Respondemos o mais rápido possível; o plano anual inclui prioridade na fila de atendimento.`,
  },
]

const FAQItem = ({ faq, index }: { faq: (typeof faqs)[0]; index: number }) => {
  const [open, setOpen] = useState(false)

  return (
    <BlurFade delay={0.05 * index} inView>
      <motion.div
        className={cn(
          "rounded-xl border overflow-hidden transition-all duration-300",
          open
            ? "bg-slate-900/50 border-amber-700/30"
            : "bg-white/[0.02] border-white/[0.06] hover:border-slate-700/50"
        )}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-5 text-left gap-4 group"
        >
          <span className={cn(
            "text-sm font-semibold transition-colors",
            open ? "text-slate-100" : "text-slate-400 group-hover:text-slate-100"
          )}>
            {faq.q}
          </span>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
              open
                ? "border-amber-500 bg-amber-950/40 text-amber-400"
                : "border-white/10 text-slate-600 group-hover:border-amber-700/40 group-hover:text-amber-400"
            )}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5">
                <div className="h-px bg-slate-800/80 mb-4" />
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </BlurFade>
  )
}

export function FAQSection() {
  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <BlurFade inView>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/70 border border-amber-700/35 text-amber-400 text-xs font-semibold mb-4">
              PERGUNTAS FREQUENTES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 mb-4">
              Ainda tem{" "}
              <span className="bg-gradient-to-r from-amber-300 to-slate-300 bg-clip-text text-transparent">
                dúvidas?
              </span>
            </h2>
            <p className="text-slate-500 text-sm">
              Respondemos as principais perguntas. Se não encontrar o que procura,
              fale connosco no WhatsApp.
            </p>
          </div>
        </BlurFade>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>

        {/* Support CTA */}
        <BlurFade delay={0.5} inView>
          <div className="mt-10 text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <p className="text-slate-500 text-sm mb-3">
              Não encontrou sua resposta? Fale connosco no WhatsApp.
            </p>
            <a
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp {SUPPORT_WHATSAPP_LABEL}
            </a>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
