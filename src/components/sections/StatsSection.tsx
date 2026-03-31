"use client"

import { motion } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

const stats = [
  { value: 500, suffix: "+", label: "Utilizadores ativos", desc: "e a crescer todos os dias" },
  { value: 99, suffix: ".8%", label: "Uptime", desc: "disponibilidade garantida" },
  { value: 47, suffix: " FPS", label: "Ganho médio*", desc: "em jogos, hardware típico" },
  { value: 3, suffix: " min", label: "Setup completo", desc: "do zero a funcionar" },
]

const scenarioTags = [
  "Jogos competitivos",
  "Streaming / OBS",
  "Adobe & criação",
  "Multitarefa",
  "Dev & builds",
  "Windows 11",
  "Valorant · CS2",
  "Edição de vídeo",
]

const reviews = [
  { name: "GodKing_BR", tag: "CS2", text: "Saí de 80fps para 144fps estáveis. Absurdo o resultado.", stars: 5 },
  { name: "NxSniper", tag: "Valorant", text: "Menos picos de latência na ranked. Recomendo 100%.", stars: 5 },
  { name: "Marina L.", tag: "Design & Premiere", text: "Notebook parava de responder com 2 apps abertas. Hoje aguenta o dia inteiro.", stars: 5 },
  { name: "ProPlayer777", tag: "Apex", text: "Setup em menos de 5 minutos. Diferença imediata no jogo.", stars: 5 },
  { name: "Ricardo M.", tag: "Home office", text: "Reuniões e browser pesado sem travar. Finalmente.", stars: 5 },
  { name: "DarkMatter_9", tag: "Fortnite", text: "Quedas de frame muito menos frequentes. Consistência nas partidas.", stars: 5 },
  { name: "NebulaFPS", tag: "Warzone", text: "Consigo jogar ranked sem engasgar o PC.", stars: 5 },
  { name: "Paula V.", tag: "Stream Twitch", text: "OBS + jogo ao mesmo tempo ficou estável. Foi o que precisava.", stars: 5 },
]

const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => (
  <div className="relative mx-3 w-72 rounded-xl bg-[#0c1528]/80 border border-slate-800/60 hover:border-amber-600/20 p-5 backdrop-blur-sm flex-shrink-0 transition-colors duration-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1e3a5f] to-amber-600 flex items-center justify-center text-white text-sm font-bold">
        {review.name[0]}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-100">{review.name}</div>
        <div className="text-xs text-amber-500/90">{review.tag}</div>
      </div>
    </div>
    <p className="text-sm text-slate-500 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
    <div className="flex gap-0.5 mt-3">
      {Array.from({ length: review.stars }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
)

export function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-600/35 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-600/35 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => (
            <BlurFade key={stat.label} delay={0.1 + i * 0.1} inView>
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-[#0a1020]/60 border border-slate-800/70 backdrop-blur-sm overflow-hidden group hover:border-amber-500/20 transition-colors duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)" }} />
                <div className="flex items-end justify-center gap-0.5 mb-2">
                  <NumberTicker
                    value={stat.value}
                    className="text-[2.75rem] font-black text-white tabular-nums leading-none"
                    decimalPlaces={0}
                  />
                  <span className={cn("text-xl font-black mb-1", i === 0 || i === 2 ? "text-amber-400" : "text-amber-400")}>{stat.suffix}</span>
                </div>
                <div className="text-sm font-bold text-slate-200 mb-0.5">{stat.label}</div>
                <div className="text-xs text-slate-600">{stat.desc}</div>
              </motion.div>
            </BlurFade>
          ))}
        </div>

        {/* Social proof header */}
        <BlurFade inView>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-950/30 border border-yellow-700/30 text-yellow-400 text-xs font-semibold mb-4">
              ★ DEPOIMENTOS REAIS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
              Quem usa, nota a diferença
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-lg mx-auto">
              * Indicador médio em cenários de jogo; noutras cargas o ganho mede-se em fluidez e tempo de resposta.
            </p>
          </div>
        </BlurFade>
      </div>

      {/* Reviews marquee */}
      <div className="relative">
        <Marquee pauseOnHover className="[--duration:30s] py-2">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:35s] py-2">
          {[...reviews].reverse().map((review) => (
            <ReviewCard key={`rev-${review.name}`} review={review} />
          ))}
        </Marquee>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050a14] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050a14] to-transparent" />
      </div>

      {/* Cenários */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <BlurFade inView>
          <p className="text-center text-xs text-slate-600 mb-6 uppercase tracking-widest">
            Jogos, trabalho e criação — onde o Loading Nexus entra
          </p>
        </BlurFade>
        <div className="flex flex-wrap justify-center gap-3">
          {scenarioTags.map((label, i) => (
            <BlurFade key={label} delay={0.05 * i} inView>
              <motion.div
                whileHover={{ scale: 1.08, borderColor: "rgba(212, 175, 55, 0.45)" }}
                className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500 text-xs font-medium transition-colors hover:text-slate-300"
              >
                {label}
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
