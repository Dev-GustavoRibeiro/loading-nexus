"use client"

import { motion } from "motion/react"
import { Zap, Target, Shield, Fingerprint, Monitor, BarChart3 } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { cn } from "@/lib/utils"

const features = [
  {
    Icon: Zap,
    title: "Otimização em tempo real",
    description:
      "Ajustes contínuos ao Windows e ao hardware para mais fluidez — em jogos, edição, streaming ou quando o PC está no limite. Menos quedas bruscas de desempenho.",
    size: "large",
    accent: "amber",
    gradient: "from-amber-950/20 via-[#0c1528] to-[#0c1528]",
    border: "border-amber-700/25 hover:border-amber-600/40",
  },
  {
    Icon: Target,
    title: "Resposta e latência",
    description:
      "Reduz picos que travam a experiência — do clique ao áudio e à rede. Sensação de sistema mais “no ponto”, em jogo ou no trabalho.",
    size: "small",
    accent: "blue",
    gradient: "from-blue-950/20 via-[#0c1528] to-[#0c1528]",
    border: "border-slate-700/30 hover:border-blue-700/40",
  },
  {
    Icon: Shield,
    title: "Ajustes estáveis",
    description:
      "Mudanças pensadas para conviver com o antivírus e as atualizações do Windows. Controlo e visibilidade no painel — sem “truques” opacos.",
    size: "small",
    accent: "emerald",
    gradient: "from-emerald-950/25 via-[#0c1528] to-[#0c1528]",
    border: "border-slate-700/30 hover:border-emerald-700/40",
  },
  {
    Icon: Fingerprint,
    title: "Licença por conta",
    description:
      "Sua assinatura fica vinculada à sua conta (e-mail). Ative em uma máquina por vez e troque de dispositivo quando precisar, pelo painel.",
    size: "small",
    accent: "orange",
    gradient: "from-orange-950/20 via-[#0c1528] to-[#0c1528]",
    border: "border-slate-700/30 hover:border-orange-700/40",
  },
  {
    Icon: Monitor,
    title: "Uma Máquina, Todo Poder",
    description:
      "Uso em uma máquina por vez. Troca de dispositivo facilitada — 1 clique no painel.",
    size: "small",
    accent: "pink",
    gradient: "from-pink-950/20 via-[#0c1528] to-[#0c1528]",
    border: "border-slate-700/30 hover:border-pink-700/40",
  },
  {
    Icon: BarChart3,
    title: "Dashboard de performance",
    description:
      "Métricas em tempo real: FPS (quando aplicável), temperaturas, latência, CPU/GPU e saúde do sistema. Uma vista única para jogar, criar ou trabalhar.",
    size: "large",
    accent: "blue",
    gradient: "from-blue-950/20 via-[#0c1528] to-[#0c1528]",
    border: "border-amber-700/20 hover:border-amber-600/35",
  },
]

const ACCENT_COLORS: Record<string, { icon: string; glow: string; beam: string }> = {
  amber: { icon: "text-amber-400", glow: "bg-amber-500/10 border-amber-500/20", beam: "#d4af37" },
  blue:  { icon: "text-blue-400",  glow: "bg-blue-500/10 border-blue-500/20",   beam: "#3b82f6" },
  emerald: { icon: "text-emerald-400", glow: "bg-emerald-500/10 border-emerald-500/20", beam: "#10b981" },
  orange: { icon: "text-orange-400", glow: "bg-orange-500/10 border-orange-500/20", beam: "#f97316" },
  pink:  { icon: "text-pink-400",  glow: "bg-pink-500/10 border-pink-500/20",   beam: "#ec4899" },
}

function FeatureCard({
  feature,
  index,
  className,
  rootClassName,
}: {
  feature: typeof features[0]
  index: number
  className?: string
  /** Para esticar dentro de grelha/flex (ex.: flex-1 min-h-0) */
  rootClassName?: string
}) {
  const color = ACCENT_COLORS[feature.accent]
  return (
    <BlurFade
      delay={0.1 + index * 0.07}
      inView
      className={cn("h-full min-h-0 flex flex-col", rootClassName)}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className={cn(
          "group relative min-h-0 flex flex-1 flex-col rounded-2xl p-6 overflow-hidden border transition-all duration-300",
          "bg-gradient-to-br",
          feature.gradient,
          feature.border,
          className
        )}
      >
        <BorderBeam
          size={90}
          duration={5 + index}
          colorFrom="#0f1c32"
          colorTo={color.beam}
          delay={index * 0.4}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4 border", color.glow)}>
          <feature.Icon className={cn("w-5 h-5", color.icon)} />
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-2 leading-snug">{feature.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed flex-1 min-h-0">{feature.description}</p>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full rounded-full bg-current" style={{ background: `radial-gradient(circle at 100% 0%, ${color.beam} 0%, transparent 70%)` }} />
        </div>
      </motion.div>
    </BlurFade>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/25 to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,58,95,0.06) 0%, transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto">
        <BlurFade inView>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Recursos
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-100 mb-4">
              Tudo o que o seu{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                PC precisa
              </span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Do gamer ao criador de conteúdo, do dev ao utilizador de ferramentas pesadas — recursos pensados para o Windows responder quando mais precisa.
            </p>
          </div>
        </BlurFade>

        {/* Bento: linha de cima = 2 cards à mesma altura; linha do meio = 3 cards à mesma altura */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
            <div className="lg:col-span-2 min-h-0 h-full flex flex-col">
              <FeatureCard feature={features[0]} index={0} rootClassName="min-h-0 flex-1" className="w-full" />
            </div>
            <div className="min-h-0 h-full flex flex-col">
              <FeatureCard feature={features[1]} index={1} rootClassName="min-h-0 flex-1" className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:items-stretch lg:items-stretch">
            <div className="min-h-0 h-full flex flex-col sm:col-span-1">
              <FeatureCard feature={features[2]} index={2} rootClassName="min-h-0 flex-1" className="w-full" />
            </div>
            <div className="min-h-0 h-full flex flex-col">
              <FeatureCard feature={features[3]} index={3} rootClassName="min-h-0 flex-1" className="w-full" />
            </div>
            <div className="min-h-0 h-full flex flex-col sm:col-span-2 lg:col-span-1">
              <FeatureCard feature={features[4]} index={4} rootClassName="min-h-0 flex-1" className="w-full" />
            </div>
          </div>

          <div className="min-h-0">
            <FeatureCard feature={features[5]} index={5} />
          </div>
        </div>
      </div>
    </section>
  )
}
