"use client"

import { motion } from "motion/react"
import { Download, Brain, Rocket } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    step: "01",
    icon: Download,
    title: "Instale o Nexus",
    desc: "Baixe o instalador para Windows, faça login com sua conta e o sistema fica ativo em menos de 3 minutos.",
    detail: "Windows 10 / 11 · Setup guiado · Sem configuração técnica",
    color: "from-amber-500/20 to-amber-700/5",
    border: "border-amber-500/25",
    iconColor: "text-amber-400",
    connector: true,
  },
  {
    step: "02",
    icon: Brain,
    title: "Deixe o ZED analisar",
    desc: "O agente de IA monitora CPU, RAM, GPU, latência e processos em segundo plano, identificando gargalos em tempo real.",
    detail: "Monitoramento contínuo · Diagnóstico automático · Sem ação necessária",
    color: "from-blue-500/20 to-blue-700/5",
    border: "border-blue-500/25",
    iconColor: "text-blue-400",
    connector: true,
  },
  {
    step: "03",
    icon: Rocket,
    title: "Receba e aplique melhorias",
    desc: "O ZED explica o problema em linguagem simples e sugere a ação ideal. Você revisa e decide — nunca sem a sua aprovação.",
    detail: "Recomendações claras · Antes e depois visível · Controle total",
    color: "from-emerald-500/20 to-emerald-700/5",
    border: "border-emerald-500/25",
    iconColor: "text-emerald-400",
    connector: false,
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(30,58,95,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto">
        <BlurFade inView>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Como funciona
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4">
              De zero a{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                performance máxima
              </span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Em 3 passos simples. Sem configuração técnica, sem adivinhação.
            </p>
          </div>
        </BlurFade>

        <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-0 items-stretch">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative flex-1 flex flex-col lg:flex-row items-stretch">
              <BlurFade inView delay={0.1 + i * 0.12} className="flex-1">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "relative h-full rounded-2xl p-7 border bg-gradient-to-br",
                    step.color,
                    step.border,
                    "bg-[#080f1e]/70"
                  )}
                >
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[11px] font-black text-slate-600 tracking-widest">{step.step}</span>
                    <div className={cn("w-10 h-10 rounded-xl bg-slate-900/60 border flex items-center justify-center", step.border)}>
                      <step.icon className={cn("w-5 h-5", step.iconColor)} />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-100 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{step.desc}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {step.detail.split(" · ").map((d) => (
                      <span key={d} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800/60 text-slate-600">
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </BlurFade>

              {/* Connector arrow between steps */}
              {step.connector && (
                <div className="hidden lg:flex items-center justify-center w-8 shrink-0 self-center">
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
              {/* Mobile connector */}
              {step.connector && (
                <div className="flex lg:hidden justify-center my-2">
                  <svg className="w-5 h-5 text-slate-700 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <BlurFade inView delay={0.5}>
          <p className="text-center text-xs text-slate-600 mt-10">
            Tempo médio do setup completo: <span className="text-slate-400 font-semibold">3 minutos</span> · Compatível com Windows 10 e 11
          </p>
        </BlurFade>
      </div>
    </section>
  )
}
