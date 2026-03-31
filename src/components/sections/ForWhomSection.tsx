"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Gamepad2, Radio, Video, Code2, Briefcase } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

const PROFILES = [
  {
    id: "gamer",
    icon: Gamepad2,
    label: "Gamer",
    headline: "Mais FPS. Menos drops. Jogue no limite.",
    desc: "O ZED monitora CPU, GPU e RAM durante a sessão, identifica o que está causando queda de frame e sugere o perfil ideal para jogos competitivos.",
    tags: ["CS2", "Valorant", "Apex Legends", "Fortnite", "Warzone"],
    benefits: [
      "Perfil automático de performance para jogos",
      "Redução de picos de latência e micro-travamentos",
      "Diagnóstico em tempo real durante a sessão",
      "FPS mais estável nas partidas ranked",
    ],
    color: "from-amber-500/15 to-transparent",
    border: "border-amber-500/30",
    accent: "text-amber-400",
    bg: "bg-amber-500/8",
  },
  {
    id: "streamer",
    icon: Radio,
    label: "Streamer",
    headline: "OBS + jogo ao mesmo tempo. Sem engasgar.",
    desc: "Streaming exige muito do sistema. O ZED equilibra os recursos entre o jogo e o OBS para você transmitir sem quedas de qualidade.",
    tags: ["OBS Studio", "Twitch", "YouTube Live", "Kick"],
    benefits: [
      "Balanceamento inteligente OBS + gameplay",
      "Menos dropped frames na transmissão",
      "Diagnóstico de gargalos de encoder",
      "Perfil otimizado para multitarefa pesada",
    ],
    color: "from-red-500/15 to-transparent",
    border: "border-red-500/30",
    accent: "text-red-400",
    bg: "bg-red-500/8",
  },
  {
    id: "criador",
    icon: Video,
    label: "Criador",
    headline: "Renders mais rápidos. Fluidez na edição.",
    desc: "Suites criativas são pesadas. O ZED libera recursos desnecessários, prioriza o processo ativo e acompanha temperaturas para evitar throttling.",
    tags: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Blender"],
    benefits: [
      "Prioridade de recursos para o app ativo",
      "Monitoramento de temperatura durante renders",
      "Redução de stutters na timeline",
      "Diagnóstico de lentidão em exportações",
    ],
    color: "from-violet-500/15 to-transparent",
    border: "border-violet-500/30",
    accent: "text-violet-400",
    bg: "bg-violet-500/8",
  },
  {
    id: "dev",
    icon: Code2,
    label: "Dev",
    headline: "Builds mais rápidas. Multitarefa estável.",
    desc: "Múltiplos terminais, builds longas, IDEs pesadas. O ZED mantém o sistema fluido e avisa antes de a RAM saturar.",
    tags: ["VS Code", "Docker", "Node.js", "WebPack"],
    benefits: [
      "Monitoramento de RAM durante builds",
      "Alertas de saturação antes de travar",
      "Perfil equilibrado para multitarefa pesada",
      "Menor latência de I/O em operações de disco",
    ],
    color: "from-emerald-500/15 to-transparent",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/8",
  },
  {
    id: "homeoffice",
    icon: Briefcase,
    label: "Home Office",
    headline: "Reuniões fluidas. Browser sem travar.",
    desc: "PC pesado em reunião com câmera ligada, planilhas e browser abertos. O ZED mantém o sistema responsivo mesmo com carga alta.",
    tags: ["Teams", "Zoom", "Chrome", "Excel"],
    benefits: [
      "Sistema responsivo durante videochamadas",
      "Menos lentidão com muitas abas abertas",
      "Diagnóstico de apps que consomem em segundo plano",
      "Perfil de trabalho focado em estabilidade",
    ],
    color: "from-blue-500/15 to-transparent",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    bg: "bg-blue-500/8",
  },
]

export function ForWhomSection() {
  const [active, setActive] = useState(0)
  const profile = PROFILES[active]

  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <BlurFade inView>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Para quem é
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4">
              Cada uso tem{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                seu diagnóstico
              </span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              O ZED adapta as recomendações ao seu perfil real — não é uma solução genérica.
            </p>
          </div>
        </BlurFade>

        {/* Profile tabs */}
        <BlurFade inView delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PROFILES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200",
                  active === i
                    ? cn("border-transparent text-slate-950 shadow-lg", p.bg.replace("bg-", "bg-").replace("/8", ""), "bg-amber-400 text-slate-950")
                    : "border-slate-800/60 text-slate-500 hover:border-slate-700 hover:text-slate-300 bg-slate-950/30"
                )}
              >
                <p.icon className="w-4 h-4" />
                {p.label}
              </button>
            ))}
          </div>
        </BlurFade>

        {/* Profile content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "rounded-2xl border bg-gradient-to-br p-8 sm:p-10",
              profile.color,
              profile.border,
              "bg-[#080f1e]/70"
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left side */}
              <div>
                <div className={cn("w-12 h-12 rounded-xl bg-slate-900/60 border flex items-center justify-center mb-5", profile.border)}>
                  <profile.icon className={cn("w-6 h-6", profile.accent)} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-100 mb-3 leading-tight">
                  {profile.headline}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">{profile.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <span key={tag} className={cn("text-xs px-3 py-1.5 rounded-full border font-medium", profile.border, profile.accent, "bg-slate-900/50")}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right side — benefits */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">
                  O que o ZED faz pelo seu perfil
                </p>
                {profile.benefits.map((b, i) => (
                  <motion.div
                    key={b}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/50"
                  >
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border", profile.border, profile.bg)}>
                      <svg className={cn("w-3 h-3", profile.accent)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-400">{b}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
