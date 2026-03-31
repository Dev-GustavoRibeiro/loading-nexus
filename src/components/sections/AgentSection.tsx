"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { Brain, CheckCircle2, Zap, Target, MessageSquare, Lightbulb, History } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { cn } from "@/lib/utils"

const AI_CAPABILITIES = [
  {
    icon: Brain,
    title: "Diagnostica gargalos",
    desc: "Lê sinais de CPU, RAM, GPU e rede para identificar o que realmente está pesando.",
    color: "text-amber-400",
    glow: "bg-amber-500/8 border-amber-500/20",
  },
  {
    icon: MessageSquare,
    title: "Explica em linguagem simples",
    desc: "Sem jargão técnico. O ZED traduz o problema para que você entenda e tome decisões.",
    color: "text-blue-400",
    glow: "bg-blue-500/8 border-blue-500/20",
  },
  {
    icon: Lightbulb,
    title: "Sugere ações personalizadas",
    desc: "Recomendações baseadas no seu uso real — jogo, trabalho, criação ou streaming.",
    color: "text-emerald-400",
    glow: "bg-emerald-500/8 border-emerald-500/20",
  },
  {
    icon: History,
    title: "Acompanha antes e depois",
    desc: "Registra métricas antes e após cada ação para você ver o impacto com clareza.",
    color: "text-violet-400",
    glow: "bg-violet-500/8 border-violet-500/20",
  },
  {
    icon: Target,
    title: "Recomenda perfil ideal",
    desc: "Identifica se você precisa de perfil gamer, criativo, dev ou home office e aplica o melhor ajuste.",
    color: "text-pink-400",
    glow: "bg-pink-500/8 border-pink-500/20",
  },
  {
    icon: Zap,
    title: "Age com você, não por você",
    desc: "Toda ação precisa da sua aprovação. Você vê o que vai mudar antes de aplicar.",
    color: "text-orange-400",
    glow: "bg-orange-500/8 border-orange-500/20",
  },
]

function ZedChatPreview() {
  return (
    <div className="relative flex h-full min-h-0 flex-col rounded-2xl bg-[#080f1e] border border-slate-800/70 overflow-hidden p-4 sm:p-5">
      <BorderBeam size={160} duration={6} colorFrom="#1e3a5f" colorTo="#d4af37" />

      <div className="relative z-10 mb-3 shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-500/90">
          Interface no app
        </p>
        <p className="text-xs text-slate-600 mt-0.5">
          ZED AI — captura de tela, diagnóstico e ações com confirmação.
        </p>
      </div>

      <div className="relative z-10 flex-1 min-h-[280px] sm:min-h-[320px] rounded-xl border border-slate-800/60 bg-[#0a0f18] overflow-hidden">
        <Image
          src="/chat-zed.png"
          alt="Interface do ZED AI no Loading Nexus: chat com o agente, ações rápidas e campo de mensagem."
          width={800}
          height={900}
          className="h-full w-full object-contain object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}

export function AgentSection() {
  return (
    <section id="agent" className="relative py-28 px-4 sm:px-6 overflow-hidden scroll-mt-[72px]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <BlurFade inView>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-5 uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" />
              Agente de IA
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4">
              Conheça o{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                ZED
              </span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
              O verdadeiro diferencial do Nexus. Um agente que lê métricas, interpreta gargalos,
              orienta decisões e mostra o que realmente está afetando sua máquina.
            </p>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              Não é um botão de otimização. É um agente que <em className="text-slate-400 not-italic font-semibold">entende</em> o seu PC.
            </p>
          </div>
        </BlurFade>

        {/* Chat preview + capabilities — linha com mesma altura em lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 lg:items-stretch">
          <BlurFade inView delay={0.1} className="min-h-0 flex flex-col h-full">
            <ZedChatPreview />
          </BlurFade>

          {/* Capability cards: mesma altura em cada linha + grid auto-rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr min-h-0">
            {AI_CAPABILITIES.map((cap, i) => (
              <BlurFade
                key={cap.title}
                inView
                delay={0.1 + i * 0.07}
                className="h-full min-h-0 flex flex-col"
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className={cn(
                    "group relative flex h-full min-h-[12.75rem] flex-col rounded-xl bg-[#080f1e]/80 border border-slate-800/60 hover:border-slate-700/80 p-4 transition-all duration-300"
                  )}
                >
                  <div className={cn("w-9 h-9 shrink-0 rounded-lg flex items-center justify-center mb-3 border", cap.glow)}>
                    <cap.icon className={cn("w-4 h-4", cap.color)} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1.5 shrink-0">{cap.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1 min-h-0">{cap.desc}</p>
                </motion.div>
              </BlurFade>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <BlurFade inView delay={0.4}>
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-r from-[#0c1528]/80 to-[#080f1e]/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <BorderBeam size={120} duration={7} colorFrom="#1e3a5f" colorTo="#d4af37" />
            <div className="relative z-10 text-center sm:text-left">
              <p className="text-slate-300 font-semibold text-base">
                A IA não é um extra. É o cérebro do Nexus.
              </p>
              <p className="text-slate-600 text-sm mt-1">
                A otimização é o motor. O ZED é quem conduz.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-2 text-xs text-slate-500 shrink-0">
              {["Diagnóstico em tempo real", "Aprovação antes de agir", "Sem surpresas"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
