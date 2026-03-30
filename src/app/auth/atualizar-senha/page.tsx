"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { supabase, validatePasswordStrong, isSupabaseConfigured } from "@/lib/supabase"

export default function AtualizarSenhaPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setChecking(false)
      return
    }

    let cancelled = false

    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!cancelled) {
        setHasSession(Boolean(session))
        setChecking(false)
      }
    }

    void syncSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(Boolean(session))
        setChecking(false)
      }
    })

    const t = window.setTimeout(() => {
      void syncSession()
    }, 800)

    return () => {
      cancelled = true
      window.clearTimeout(t)
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    const pw = validatePasswordStrong(password)
    if (!pw.ok) errs.password = pw.message
    if (password !== confirm) errs.confirm = "As senhas não coincidem"
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setGlobalError("")

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      await supabase.auth.signOut()
      window.setTimeout(() => router.push("/"), 2000)
    } catch {
      setGlobalError("Não foi possível atualizar a senha. O link pode ter expirado — solicite um novo.")
    } finally {
      setLoading(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-6">
        <p className="text-slate-400 text-sm text-center">Supabase não configurado neste ambiente.</p>
      </div>
    )
  }

  if (checking) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center gap-4 p-6">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-400 text-sm">Validando link…</p>
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Loading Nexus" width={48} height={48} className="object-contain" style={{ mixBlendMode: "screen" }} />
          </div>
          <h1 className="text-xl font-bold text-white">Link inválido ou expirado</h1>
          <p className="text-slate-400 text-sm">
            Peça um novo e-mail de recuperação na tela de login do site.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-black"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
          <h1 className="text-xl font-bold text-white">Senha atualizada</h1>
          <p className="text-slate-400 text-sm">Redirecionando para a página inicial…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-5">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Loading Nexus" width={56} height={56} className="object-contain" style={{ mixBlendMode: "screen" }} />
          </div>
          <h1 className="text-2xl font-bold text-white">Nova senha</h1>
          <p className="text-slate-400 text-sm">Defina uma senha forte para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Nova senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((x) => ({ ...x, password: "" }))
                }}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmar senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  if (errors.confirm) setErrors((x) => ({ ...x, confirm: "" }))
                }}
                placeholder="Repita a senha"
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.confirm}
              </p>
            )}
          </div>

          {globalError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {globalError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          <Link href="/" className="text-amber-400 hover:text-amber-300 font-semibold">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}
