"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { Zap, Shield, Monitor, TrendingUp } from "lucide-react"
import Image from "next/image"
import { WordRotate } from "@/components/ui/word-rotate"
import { BorderBeam } from "@/components/ui/border-beam"
import { DarkVeilBackground } from "@/components/DarkVeilBackground"
import { useAuthModal } from "@/components/AuthModalProvider"

const STATS = [
  { value: "+40%", label: "Ganho típico*", icon: TrendingUp },
  { value: "<1ms", label: "Resposta", icon: Zap },
  { value: "500+", label: "Utilizadores", icon: Monitor },
  { value: "24/7", label: "Suporte", icon: Shield },
]

const TRUST = [
  "Pagamento seguro via Stripe",
  "Acesso imediato após pagamento",
  "1 máquina ativa por vez",
  "Cancele quando quiser",
]

export function HeroSection() {
  const { open } = useAuthModal()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  /* Parallax suave para o dashboard de fundo */
  const dashY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const dashOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#050a14]">
      {/* Dark Veil WebGL background */}
      <DarkVeilBackground className="z-0 opacity-[0.88]" />

      {/* Atmospheric gradient overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(30,58,95,0.55) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 40% at 80% 30%, rgba(212,175,55,0.04) 0%, transparent 55%), " +
            "linear-gradient(to bottom, rgba(5,10,20,0.3) 0%, transparent 30%, rgba(5,10,20,0.85) 100%)",
        }}
      />

      {/* Subtle gold grid */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            /* Evita linha horizontal exactamente em y=0 (visível através da navbar transparente). */
            backgroundPosition: "0 4px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Dashboard como imagem de fundo atmosférica ───────────────── */}
      <motion.div
        className="absolute inset-0 z-[2] flex items-end justify-center pointer-events-none"
        style={{ y: dashY, opacity: dashOpacity }}
      >
        {/* Container que posiciona a imagem na metade inferior */}
        <div className="w-full max-w-5xl mx-auto px-4 pb-0 relative">
          <Image
            src="/dashboard-preview.PNG"
            alt=""
            width={1600}
            height={1200}
            aria-hidden
            priority
            className="w-full h-auto rounded-t-2xl select-none object-cover"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.12) 22%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.80) 68%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.12) 22%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.80) 68%, black 100%)",
              filter: "brightness(0.55) saturate(0.7)",
            }}
          />
        </div>

        {/* Fade final para não cortar abruptamente embaixo */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, #050a14 0%, transparent 100%)" }}
        />
      </motion.div>

      {/* ── Hero copy ──────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <div className="min-h-[min(86vh,800px)] flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center w-full">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-xs font-semibold text-amber-300/90 tracking-wide uppercase">
                Windows mais rápido — jogos, trabalho, criação
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-5"
            >
              <h1 className="font-black leading-[0.92] tracking-tight">
                <span className="block text-4xl sm:text-6xl lg:text-7xl text-slate-200 mb-2">
                  O DESEMPENHO QUE
                </span>
                <span className="block text-5xl sm:text-7xl lg:text-[5.5rem] bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  O SEU PC MERECE
                </span>
              </h1>
            </motion.div>

            {/* Subline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2 text-lg sm:text-xl text-slate-500 mb-5"
            >
              <span>Diagnóstico</span>
              <span className="text-slate-700">·</span>
              <WordRotate
                className="font-bold text-amber-400"
                words={[
                  "Otimização Automática",
                  "Mais FPS nos jogos",
                  "Menos travamentos",
                  "Multitarefa fluida",
                  "Tweaks cirúrgicos",
                ]}
                duration={2800}
              />
              <span className="text-slate-700">·</span>
              <span>Resultados reais</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-xl mx-auto text-base text-slate-500 mb-10 leading-relaxed"
            >
              O <span className="text-slate-200 font-semibold">Loading Nexus</span> analisa,
              limpa e ajusta o seu Windows em tempo real — para jogos exigentes, trabalho pesado,
              streaming ou criação — com painel claro e sem complicação.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
            >
              <button
                onClick={() => open("signup")}
                className="group relative px-8 py-4 rounded-xl font-bold text-base text-slate-950 overflow-hidden min-w-[220px] shadow-[0_0_32px_rgba(212,175,55,0.3)]"
                style={{ background: "linear-gradient(135deg, #f0c040, #d4af37, #b8952a)" }}
              >
                <span className="relative z-10">Começar agora — a partir de R$27,90/mês</span>
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
              </button>
              <button
                onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm text-slate-400 border border-slate-800/80 hover:border-slate-700 hover:text-slate-200 bg-slate-950/40 backdrop-blur-sm transition-all duration-200"
              >
                Ver recursos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                  className="relative p-4 rounded-2xl bg-slate-950/70 border border-slate-800/70 backdrop-blur-sm overflow-hidden group hover:border-amber-500/20 transition-colors duration-300"
                >
                  <BorderBeam size={55} duration={4 + i} colorFrom="#0f1c32" colorTo="#d4af37" delay={i * 0.6} />
                  <s.icon className="w-4 h-4 text-amber-500/60 mb-2" />
                  <div className="text-2xl font-black text-white leading-none">{s.value}</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <p className="text-center text-[10px] text-slate-600 -mt-4 mb-6 max-w-md mx-auto leading-relaxed">
              * Ganho médio referente a cenários exigentes (ex.: jogos e aplicações gráficas); o resultado varia com hardware e utilização.
            </p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            >
              {TRUST.map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t}
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
