"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Download, Loader2, Monitor, Lock } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { useSession } from "@/components/SessionProvider"
import { useAuthModal } from "@/components/AuthModalProvider"
import { supabase, fetchMyProfile, type ProfileRow } from "@/lib/supabase"
import { requestDesktopInstallerUrl } from "@/lib/desktop-download"
import { cn } from "@/lib/utils"

export function DownloadSection() {
  const { user, loading: sessionLoading } = useSession()
  const { open } = useAuthModal()
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    let cancelled = false
    setProfileLoading(true)
    void fetchMyProfile().then((p) => {
      if (!cancelled) {
        setProfile(p)
        setProfileLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [user])

  const sub = (profile?.subscription_status ?? "none").toLowerCase()
  const canDownload = Boolean(profile && (sub === "trialing" || sub === "active"))

  async function handleDownload() {
    setDownloadError(null)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setDownloadError("Entre novamente para baixar o instalador.")
      return
    }
    setDownloadLoading(true)
    try {
      const r = await requestDesktopInstallerUrl(session.access_token)
      if (!r.ok) {
        setDownloadError(r.error)
        return
      }
      window.open(r.url, "_blank", "noopener,noreferrer")
    } catch {
      setDownloadError("Erro de rede. Tente de novo.")
    } finally {
      setDownloadLoading(false)
    }
  }

  const showGate = !sessionLoading && !user
  const showNeedSub = !sessionLoading && user && !profileLoading && profile && !canDownload
  const showNoProfile = !sessionLoading && user && !profileLoading && !profile

  return (
    <section id="download" className="relative py-24 sm:py-28 px-4 sm:px-6 scroll-mt-[72px]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a14] via-slate-950/40 to-[#050a14] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <BlurFade inView>
          <div className="relative rounded-2xl overflow-hidden border border-amber-600/20 bg-slate-950/50 backdrop-blur-sm p-8 sm:p-10">
            <BorderBeam size={200} duration={7} colorFrom="#1e3a5f" colorTo="#d4af37" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                <Monitor className="w-7 h-7 text-amber-400" />
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500/90 mb-2"
                  >
                    Aplicativo Windows
                  </motion.span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight">
                    Baixe o Loading Nexus
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xl">
                    Instalador para Windows. O download está disponível para contas com assinatura ativa ou em período de teste.
                  </p>
                </div>

                {sessionLoading || (user && profileLoading) ? (
                  <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    A carregar…
                  </div>
                ) : null}

                {showGate ? (
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => open("login")}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-slate-600/60 text-slate-200 hover:bg-slate-800/60 transition-colors"
                    >
                      Entrar para baixar
                    </button>
                    <button
                      type="button"
                      onClick={() => open("signup")}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:from-amber-500 hover:to-amber-400 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                    >
                      Criar conta e assinar
                    </button>
                    <p className="w-full text-xs text-slate-600 flex items-start gap-2">
                      <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
                      O ficheiro .exe é servido pelo próprio site; só utilizadores autorizados recebem o link de download.
                    </p>
                  </div>
                ) : null}

                {showNoProfile ? (
                  <div className="space-y-3 pt-1">
                    <p className="text-sm text-slate-400">
                      Não foi possível carregar o perfil. Abra a conta ou tente iniciar sessão de novo.
                    </p>
                    <button
                      type="button"
                      onClick={() => open("account")}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-colors"
                    >
                      Minha conta
                    </button>
                  </div>
                ) : null}

                {showNeedSub ? (
                  <div className="space-y-3 pt-1">
                    <p className="text-sm text-slate-400">
                      A sua conta ainda não tem assinatura ativa. Assine um plano para desbloquear o instalador.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="#pricing"
                        className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                      >
                        Ver planos
                      </a>
                      <button
                        type="button"
                        onClick={() => open("account")}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold border border-slate-600/60 text-slate-300 hover:bg-slate-800/50 transition-colors"
                      >
                        Minha conta
                      </button>
                    </div>
                  </div>
                ) : null}

                {canDownload && !profileLoading ? (
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      disabled={downloadLoading}
                      onClick={() => void handleDownload()}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold w-full sm:w-auto",
                        "bg-slate-800/90 border border-amber-500/35 text-amber-300 hover:bg-slate-800 hover:border-amber-400/50",
                        "disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                      )}
                    >
                      {downloadLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Baixar instalador (Windows)
                    </button>
                    {downloadError ? (
                      <p className="text-xs text-red-400">{downloadError}</p>
                    ) : (
                      <p className="text-xs text-slate-600">
                        Versão atual do pacote no site. Após instalar, inicie sessão na app com o mesmo e-mail.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
