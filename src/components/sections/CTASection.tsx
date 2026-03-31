"use client"

import { motion } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Particles } from "@/components/ui/particles"
import { PulsatingButton } from "@/components/ui/pulsating-button"
import { BorderBeam } from "@/components/ui/border-beam"
import { SparklesText } from "@/components/ui/sparkles-text"
import { useAuthModal } from "@/components/AuthModalProvider"

function CTAButtons() {
  const { open } = useAuthModal()
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <PulsatingButton
        className="px-10 py-4 text-base font-bold rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 min-w-[240px] shadow-[0_0_24px_rgba(212,175,55,0.2)]"
        pulseColor="rgba(212, 175, 55, 0.5)"
        duration="1.5s"
        onClick={() => open("signup")}
      >
        Testar agora — A partir de R$27,90/mês
      </PulsatingButton>
      <div className="text-xs text-slate-600 flex flex-col items-center gap-1">
        <span>✓ Agente ZED incluído</span>
        <span>✓ Acesso em 3 minutos</span>
      </div>
    </div>
  )
}

export function CTASection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-[#050a14]" />

      <Particles
        className="absolute inset-0"
        quantity={60}
        color="#d4af37"
        ease={100}
        size={0.35}
      />

      <div className="relative max-w-4xl mx-auto">
        <BlurFade inView>
          <div className="relative rounded-3xl overflow-hidden border border-amber-700/25 bg-gradient-to-br from-[#0c1528]/90 to-[#050a14]/90 backdrop-blur-xl p-10 sm:p-16 text-center">
            <BorderBeam
              size={250}
              duration={6}
              colorFrom="#1e3a5f"
              colorTo="#d4af37"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-2"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-600/35 text-amber-300 text-xs font-semibold mb-6">
                  Agente ZED incluído — comece hoje
                </span>
              </motion.div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 mb-4 leading-tight">
                Seu PC com um{" "}
                <br className="hidden sm:block" />
                <SparklesText
                  className="text-3xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-slate-200 bg-clip-text text-transparent"
                  sparklesCount={6}
                  colors={{ first: "#d4af37", second: "#e2e8f0" }}
                >
                  copiloto de IA
                </SparklesText>
              </h2>

              <p className="text-slate-500 text-base sm:text-lg mb-10 max-w-xl mx-auto">
                Diagnóstico inteligente, otimização em tempo real e o agente ZED orientando cada decisão.
                Junte-se a mais de 500 utilizadores. A partir de{" "}
                <strong className="text-slate-200">R$27,90/mês</strong> — agente de IA incluído em todos os planos.
              </p>

              <CTAButtons />
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

