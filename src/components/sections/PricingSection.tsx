"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Check, Zap, CalendarRange, Sparkles } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { cn } from "@/lib/utils"
import { useAuthModal } from "@/components/AuthModalProvider"
import { STRIPE_CHECKOUT_LINKS } from "@/lib/stripe-links"

function isStripeLinkReady(url: string): boolean {
  return Boolean(url && url !== "#" && /^https?:\/\//i.test(url))
}

const plans = [
  {
    id: "monthly",
    name: "Nexus Start",
    badge: null,
    Icon: Zap,
    price: 27.9,
    period: "/mês",
    billing: "Cobrança mensal — Loading Nexus",
    savings: null,
    features: [
      "Agente de IA ZED integrado",
      "Dashboard completo de métricas",
      "Otimização em tempo real",
      "Menos latência e micro-travamentos",
      "1 máquina ativa por vez",
      "Suporte",
    ],
    cta: "Começar agora",
    highlighted: false,
    stripeKey: "monthly" as const,
  },
  {
    id: "semiannual",
    name: "Nexus Plus",
    badge: "ECONOMIA",
    Icon: CalendarRange,
    price: 137.4,
    period: " / 6 meses",
    billing: "R$ 137,40 a cada 6 meses",
    savings: null,
    features: [
      "Tudo do Nexus Start",
      "Agente ZED com diagnóstico avançado",
      "Recomendações por perfil de uso",
      "Menor custo que 6x mensal",
      "Renovação automática semestral",
    ],
    cta: "Assinar semestral",
    highlighted: false,
    stripeKey: "semiannual" as const,
  },
  {
    id: "annual",
    name: "Nexus Pro",
    badge: "MELHOR CUSTO",
    Icon: Sparkles,
    price: 226.8,
    period: "/ano",
    billing: "R$ 226,80 por ano — 1 dia de teste no primeiro ciclo",
    savings: "Trial 1 dia",
    features: [
      "Agente ZED completo — diagnóstico + ação",
      "Motor de performance completo",
      "Dashboard com histórico e antes/depois",
      "Recomendações inteligentes por sessão",
      "Suporte prioritário",
      "1 dia de teste ao assinar",
    ],
    cta: "Assinar anual",
    highlighted: true,
    stripeKey: "annual" as const,
  },
] as const

export function PricingSection() {
  const [hovered, setHovered] = useState<string | null>(null)
  const { open } = useAuthModal()

  function handleSubscribe(plan: (typeof plans)[number]) {
    const url = STRIPE_CHECKOUT_LINKS[plan.stripeKey]
    if (isStripeLinkReady(url)) {
      window.location.href = url
    } else {
      open("signup")
    }
  }

  return (
    <section id="pricing" className="relative py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1020]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />

      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(30,58,95,0.08) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto">
        <BlurFade inView>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Planos e Preços
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4">
              Inclui{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                agente de IA
              </span>{" "}
              em todos os planos
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-base">
              Motor de performance + dashboard + agente ZED. Sem taxas ocultas. Acesso após confirmação do pagamento. Cancele quando quiser.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:items-stretch md:auto-rows-fr">
          {plans.map((plan, i) => (
            <BlurFade key={plan.id} delay={0.1 + i * 0.1} inView className="h-full min-h-0">
              <motion.div
                onHoverStart={() => setHovered(plan.id)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: plan.highlighted ? -6 : -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={cn(
                  "relative h-full min-h-0 rounded-2xl flex flex-col overflow-hidden transition-shadow duration-300",
                  plan.highlighted
                    ? "bg-gradient-to-b from-[#0d1e3a] to-[#091629] border border-amber-500/40 shadow-[0_0_48px_rgba(212,175,55,0.12)]"
                    : "bg-[#0c1528]/80 border border-slate-800/70 hover:border-slate-700/80",
                  hovered === plan.id && !plan.highlighted && "shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                )}
              >
                {plan.highlighted && (
                  <BorderBeam size={200} duration={6} colorFrom="#1e3a5f" colorTo="#d4af37" />
                )}

                {plan.highlighted && (
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-600/0 via-amber-500 to-amber-600/0" />
                )}

                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                        plan.highlighted ? "bg-amber-500/15 border border-amber-500/25" : "bg-slate-800/60 border border-slate-700/50"
                      )}>
                        <plan.Icon className={cn("w-5 h-5", plan.highlighted ? "text-amber-400" : "text-slate-400")} />
                      </div>
                      {plan.badge && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                          ⚡ {plan.badge}
                        </span>
                      )}
                    </div>
                    {plan.savings && (
                      <span className={cn(
                        "text-[11px] font-bold px-2.5 py-1 rounded-full",
                        plan.highlighted
                          ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      )}>
                        {plan.savings}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className={cn("text-sm font-semibold mb-2", plan.highlighted ? "text-amber-300/80" : "text-slate-400")}>
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 leading-none flex-wrap">
                      <span className="text-base text-slate-500 mb-1">R$</span>
                      <span
                        className={cn(
                          "text-5xl font-black",
                          plan.highlighted ? "text-white" : "text-slate-100"
                        )}
                      >
                        {plan.price.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{plan.billing}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-sm">
                        <span className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                          plan.highlighted ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/15 text-emerald-400"
                        )}>
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </span>
                        <span className={plan.highlighted ? "text-slate-200" : "text-slate-400"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleSubscribe(plan)}
                    className={cn(
                      "w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200",
                      plan.highlighted
                        ? "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-[0_4px_24px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_32px_rgba(212,175,55,0.45)] active:scale-[0.98]"
                        : "bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600/50 text-slate-200"
                    )}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.5} inView>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-600">
            {[
              "Pagamento seguro via Stripe",
              "Acesso após confirmação do pagamento",
              "1 máquina ativa por vez",
              "Cancele a qualquer momento",
            ].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
