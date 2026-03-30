"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  User,
  Mail,
  LogOut,
  MapPin,
  Wallet,
  Building2,
  Pencil,
  ExternalLink,
  Download,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import { useAuthModal } from "./AuthModalProvider"
import { useSession } from "./SessionProvider"
import { cn } from "@/lib/utils"
import {
  supabase,
  formatCEP,
  cepDigits,
  validatePasswordStrong,
  validateAddressForSignup,
  isSupabaseConfigured,
  getPasswordResetRedirectUrl,
  fetchMyProfile,
  updateMyProfileAddress,
  SUBSCRIPTION_STATUS_LABEL,
  formatDisplayCEP,
  type ProfileRow,
  type ProfileAddressInput,
} from "@/lib/supabase"
import { STRIPE_CHECKOUT_LINKS } from "@/lib/stripe-links"
import { requestDesktopInstallerUrl } from "@/lib/desktop-download"
import { SUPPORT_WHATSAPP_LABEL, SUPPORT_WHATSAPP_URL } from "@/lib/support"

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [ref, cb])
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  hint,
  maxLength,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: React.ElementType
  error?: string
  hint?: string
  maxLength?: number
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        )}
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600
            focus:outline-none focus:ring-2 transition-all duration-200
            ${Icon ? "pl-10" : ""}
            ${isPassword ? "pr-10" : ""}
            ${error
              ? "border-red-500/60 focus:ring-red-500/30"
              : "border-slate-700/60 focus:ring-amber-500/30 focus:border-amber-500/50"
            }
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-600">{hint}</p>
      )}
    </div>
  )
}

function PanelSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800/80 bg-slate-900/30">
        <Icon className="w-4 h-4 text-amber-500/80 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</span>
      </div>
      <div className="p-3 text-sm space-y-2">{children}</div>
    </div>
  )
}

function rowLabel(label: string, value: string | null | undefined) {
  return (
    <div className="grid grid-cols-[minmax(0,38%)_1fr] gap-x-2 gap-y-0.5 text-xs sm:text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-200 break-words">{value && String(value).trim() ? value : "—"}</span>
    </div>
  )
}

function maskStripeCustomerId(id: string | null | undefined): string {
  if (!id) return "—"
  if (id.length <= 8) return id
  return `cus••••${id.slice(-4)}`
}

function formatCardBrand(brand: string | null | undefined): string {
  if (!brand) return ""
  const b = brand.toLowerCase()
  const map: Record<string, string> = {
    visa: "Visa", mastercard: "Mastercard", amex: "Amex", elo: "Elo", hipercard: "Hipercard",
  }
  return map[b] ?? brand.charAt(0).toUpperCase() + brand.slice(1)
}

function AccountModal({ onClose }: { onClose: () => void }) {
  const { user } = useSession()
  const [email, setEmail] = useState<string | null>(user?.email ?? null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [saveAddrLoading, setSaveAddrLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [addrMsg, setAddrMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [addrForm, setAddrForm] = useState<ProfileAddressInput>({
    postal_code: "",
    street: "",
    address_number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "BR",
  })

  async function reloadProfile() {
    setLoading(true)
    const p = await fetchMyProfile()
    setProfile(p)
    setLoading(false)
    if (p) {
      setAddrForm({
        postal_code: p.postal_code ? formatCEP(p.postal_code) : "",
        street: p.street ?? "",
        address_number: p.address_number ?? "",
        complement: p.complement ?? "",
        neighborhood: p.neighborhood ?? "",
        city: p.city ?? "",
        state: (p.state ?? "").toUpperCase(),
        country: p.country ?? "BR",
      })
    }
  }

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!cancelled && u?.email) setEmail(u.email)
    })
    fetchMyProfile().then((p) => {
      if (!cancelled) {
        setProfile(p)
        setLoading(false)
        if (p) {
          setAddrForm({
            postal_code: p.postal_code ? formatCEP(p.postal_code) : "",
            street: p.street ?? "",
            address_number: p.address_number ?? "",
            complement: p.complement ?? "",
            neighborhood: p.neighborhood ?? "",
            city: p.city ?? "",
            state: (p.state ?? "").toUpperCase(),
            country: p.country ?? "BR",
          })
        }
      }
    })
    return () => { cancelled = true }
  }, [user?.id])

  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    setSigningOut(false)
    onClose()
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault()
    setAddrMsg(null)
    setSaveAddrLoading(true)
    const r = await updateMyProfileAddress(addrForm)
    setSaveAddrLoading(false)
    if (!r.ok) {
      setAddrMsg({ type: "err", text: r.message })
      return
    }
    setAddrMsg({ type: "ok", text: "Endereço atualizado." })
    setEditingAddress(false)
    await reloadProfile()
  }

  async function handleOpenCustomerPortal() {
    setPortalError(null)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setPortalError("Entre novamente para abrir o portal.")
      return
    }
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/customer-portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const body = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !body.url) {
        setPortalError(body.error ?? "Não foi possível abrir o portal.")
        return
      }
      window.location.href = body.url
    } catch {
      setPortalError("Erro de rede. Tente de novo.")
    } finally {
      setPortalLoading(false)
    }
  }

  const canDownloadDesktop =
    !loading &&
    profile &&
    (() => {
      const s = (profile.subscription_status ?? "none").toLowerCase()
      return s === "trialing" || s === "active"
    })()

  async function handleDownloadDesktop() {
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

  const subStatus = (profile?.subscription_status ?? "none").toLowerCase()
  const subLabel = SUBSCRIPTION_STATUS_LABEL[subStatus] ?? profile?.subscription_status ?? "—"
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })
    : null
  const payLine =
    profile?.payment_method_last4
      ? `${formatCardBrand(profile.payment_method_brand) || "Cartão"} terminado em ${profile.payment_method_last4}`
      : null

  return (
    <div className="flex flex-col max-h-[min(640px,82vh)]">
      <div className="shrink-0 text-center mb-4 pr-6">
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt="Loading Nexus" width={48} height={48} className="object-contain" style={{ mixBlendMode: "screen" }} />
        </div>
        <h2 className="text-xl font-bold text-white">Minha conta</h2>
        <p className="text-slate-500 text-xs mt-0.5">Dados cadastrais, endereço e pagamento</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-3 pr-1 -mr-0.5 pb-2">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-500 py-10">
            <Loader2 className="w-5 h-5 animate-spin" />
            Carregando dados…
          </div>
        ) : (
          <>
            <PanelSection title="Identificação" icon={User}>
              {rowLabel("E-mail", email ?? user?.email ?? undefined)}
              {rowLabel("Nome completo", profile?.full_name)}
              <p className="text-[10px] text-slate-600 pt-1 leading-relaxed">
                O login é feito com o e-mail cadastrado. O acesso ao app exige assinatura ativa.
              </p>
            </PanelSection>

            <PanelSection title="Endereço cadastrado" icon={MapPin}>
              {!editingAddress ? (
                <>
                  {rowLabel("CEP", profile?.postal_code ? formatDisplayCEP(profile.postal_code) : undefined)}
                  {rowLabel("Logradouro", profile?.street)}
                  {rowLabel("Número", profile?.address_number)}
                  {rowLabel("Complemento", profile?.complement ?? undefined)}
                  {rowLabel("Bairro", profile?.neighborhood)}
                  {rowLabel("Cidade / UF", profile?.city && profile?.state ? `${profile.city} — ${profile.state}` : undefined)}
                  {rowLabel("País", profile?.country ?? "BR")}
                  <button
                    type="button"
                    onClick={() => { setAddrMsg(null); setEditingAddress(true) }}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border border-amber-500/25 text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar endereço
                  </button>
                </>
              ) : (
                <form onSubmit={handleSaveAddress} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">CEP</label>
                      <input
                        value={addrForm.postal_code}
                        onChange={(e) => setAddrForm((f) => ({ ...f, postal_code: formatCEP(e.target.value) }))}
                        className="mt-0.5 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">UF</label>
                      <input
                        value={addrForm.state}
                        onChange={(e) => setAddrForm((f) => ({ ...f, state: e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2) }))}
                        className="mt-0.5 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Logradouro</label>
                    <input
                      value={addrForm.street}
                      onChange={(e) => setAddrForm((f) => ({ ...f, street: e.target.value }))}
                      className="mt-0.5 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Número</label>
                      <input
                        value={addrForm.address_number}
                        onChange={(e) => setAddrForm((f) => ({ ...f, address_number: e.target.value }))}
                        className="mt-0.5 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Complemento</label>
                      <input
                        value={addrForm.complement}
                        onChange={(e) => setAddrForm((f) => ({ ...f, complement: e.target.value }))}
                        className="mt-0.5 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Bairro</label>
                    <input
                      value={addrForm.neighborhood}
                      onChange={(e) => setAddrForm((f) => ({ ...f, neighborhood: e.target.value }))}
                      className="mt-0.5 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Cidade</label>
                    <input
                      value={addrForm.city}
                      onChange={(e) => setAddrForm((f) => ({ ...f, city: e.target.value }))}
                      className="mt-0.5 w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                    />
                  </div>
                  {addrMsg && (
                    <p className={cn("text-xs", addrMsg.type === "ok" ? "text-emerald-400" : "text-red-400")}>
                      {addrMsg.text}
                    </p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => { setEditingAddress(false); setAddrMsg(null); if (profile) void reloadProfile() }}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-700 text-slate-400 hover:bg-slate-800/50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saveAddrLoading}
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {saveAddrLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Salvar
                    </button>
                  </div>
                </form>
              )}
            </PanelSection>

            <PanelSection title="Pagamento e assinatura" icon={Wallet}>
              {rowLabel("Status da assinatura", subLabel)}
              {rowLabel("Plano", profile?.subscription_plan_label ?? undefined)}
              {periodEnd ? rowLabel("Próxima renovação / fim do período", periodEnd) : rowLabel("Próxima renovação / fim do período", "—")}
              {rowLabel("Forma de pagamento", payLine ?? undefined)}
              {rowLabel("Cliente Stripe", maskStripeCustomerId(profile?.stripe_customer_id))}
              <button
                type="button"
                disabled={portalLoading || !profile?.stripe_customer_id}
                onClick={() => void handleOpenCustomerPortal()}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-800/80 border border-slate-600/50 text-amber-400 hover:bg-slate-800 hover:border-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                Faturas e gerenciar assinatura
              </button>
              {portalError ? (
                <p className="text-xs text-red-400 mt-2">{portalError}</p>
              ) : null}
              {!loading && !profile?.stripe_customer_id ? (
                <p className="text-[10px] text-slate-500 mt-2">
                  O portal do Stripe abre após existir um cliente vinculado ao seu perfil (normalmente após o primeiro checkout pago).
                </p>
              ) : null}
              <p className="text-[10px] text-slate-600 leading-relaxed pt-3 border-t border-slate-800/60 mt-3">
                Por segurança (PCI-DSS), não armazenamos o número completo do cartão. No portal você vê faturas, método de pagamento e pode cancelar a renovação.
              </p>
            </PanelSection>

            <PanelSection title="Acesso ao software" icon={Building2}>
              <p className="text-xs text-slate-400 leading-relaxed">
                O painel desktop requer assinatura ativa ou período de teste. Se já pagou e o status ainda não aparece aqui,
                aguarde alguns minutos ou{" "}
                <a
                  href={SUPPORT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400/90 hover:text-amber-300 underline-offset-2 hover:underline"
                >
                  fale connosco no WhatsApp ({SUPPORT_WHATSAPP_LABEL})
                </a>
                .
              </p>
              {canDownloadDesktop ? (
                <>
                  <button
                    type="button"
                    disabled={downloadLoading}
                    onClick={() => void handleDownloadDesktop()}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-800/80 border border-slate-600/50 text-amber-400 hover:bg-slate-800 hover:border-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Baixar para Windows
                  </button>
                  {downloadError ? (
                    <p className="text-xs text-red-400 mt-2">{downloadError}</p>
                  ) : (
                    <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
                      O instalador é servido pelo mesmo site. Execute o ficheiro e inicie sessão na app com esta conta.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
                  Com assinatura ativa ou em teste, o botão de download aparece aqui.
                </p>
              )}
            </PanelSection>
          </>
        )}
      </div>

      <div className="shrink-0 pt-3 border-t border-slate-800/80 mt-1">
        <button
          type="button"
          disabled={signingOut}
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl font-semibold text-sm border border-slate-600/60 text-slate-300 hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-2"
        >
          {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          Sair da conta
        </button>
      </div>
    </div>
  )
}

function LoginModal({
  onSwitch,
  onLoginSuccess,
}: {
  onSwitch: () => void
  onLoginSuccess: () => void
}) {
  const [mode, setMode] = useState<"login" | "forgot">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [success, setSuccess] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  function validateEmailOnly() {
    const errs: Record<string, string> = {}
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) errs.email = "E-mail é obrigatório"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) errs.email = "E-mail inválido"
    return errs
  }

  function validate() {
    const errs = validateEmailOnly()
    if (!password) errs.password = "Senha é obrigatória"
    return errs
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateEmailOnly()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    if (!isSupabaseConfigured()) {
      setGlobalError("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    setForgotLoading(true)
    setGlobalError("")

    try {
      const redirectTo = getPasswordResetRedirectUrl()
      if (!redirectTo) throw new Error("redirect")
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      })
      if (error) throw error
      setForgotSent(true)
    } catch {
      setGlobalError("Não foi possível enviar o e-mail. Tente novamente.")
    } finally {
      setForgotLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (!isSupabaseConfigured()) {
      setGlobalError("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    setLoading(true)
    setGlobalError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => onLoginSuccess(), 700)
    } catch {
      setGlobalError("E-mail ou senha incorretos. Verifique e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (mode === "forgot") {
    return (
      <form onSubmit={handleForgotSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="Loading Nexus" width={56} height={56} className="object-contain" style={{ mixBlendMode: "screen" }} />
          </div>
          <h2 className="text-2xl font-bold text-white">Recuperar senha</h2>
          <p className="text-slate-400 text-sm mt-1">Enviaremos um link para redefinir a senha neste e-mail</p>
        </div>

        <InputField
          label="E-mail"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v)
            if (errors.email) setErrors((e) => ({ ...e, email: "" }))
          }}
          placeholder="voce@email.com"
          icon={Mail}
          error={errors.email}
        />

        {globalError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {globalError}
          </div>
        )}

        {forgotSent && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Se existir uma conta com este e-mail, você receberá instruções em instantes. Verifique a caixa de spam.
          </div>
        )}

        <button
          type="submit"
          disabled={forgotLoading || forgotSent}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(212,175,55,0.25)]"
        >
          {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {forgotLoading ? "Enviando..." : "Enviar link"}
        </button>

        <p className="text-center text-sm text-slate-500">
          <button
            type="button"
            onClick={() => {
              setMode("login")
              setForgotSent(false)
              setGlobalError("")
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            Voltar ao login
          </button>
        </p>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="Loading Nexus" width={56} height={56} className="object-contain" style={{ mixBlendMode: "screen" }} />
        </div>
        <h2 className="text-2xl font-bold text-white">Entrar na conta</h2>
        <p className="text-slate-400 text-sm mt-1">Entre com o e-mail e a senha da sua conta</p>
      </div>

      <InputField
        label="E-mail"
        type="email"
        value={email}
        onChange={(v) => {
          setEmail(v)
          if (errors.email) setErrors((e) => ({ ...e, email: "" }))
        }}
        placeholder="voce@email.com"
        icon={Mail}
        error={errors.email}
      />
      <div className="space-y-1">
        <InputField
          label="Senha"
          type="password"
          value={password}
          onChange={(v) => {
            setPassword(v)
            if (errors.password) setErrors((e) => ({ ...e, password: "" }))
          }}
          placeholder="••••••••"
          icon={Lock}
          error={errors.password}
        />
        <div className="flex justify-end -mt-0.5">
          <button
            type="button"
            onClick={() => {
              setMode("forgot")
              setForgotSent(false)
              setGlobalError("")
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            Esqueceu a senha?
          </button>
        </div>
      </div>

      {globalError && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {globalError}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Login realizado! Abrindo sua conta…
        </div>
      )}

      <button
        type="submit"
        disabled={loading || success}
        className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(212,175,55,0.25)]"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Não tem conta?{" "}
        <button type="button" onClick={onSwitch} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
          Criar conta
        </button>
      </p>
    </form>
  )
}

const PLANS = [
  {
    id: "monthly",
    label: "Plano Mensal",
    badge: null,
    price: "R$27,90",
    period: "/mês",
    detail: "Cobrança mensal — Loading Nexus",
    url: STRIPE_CHECKOUT_LINKS.monthly,
  },
  {
    id: "semiannual",
    label: "Plano Semestral",
    badge: "ECONOMIA",
    price: "R$137,40",
    period: "/6 meses",
    detail: "R$ 137,40 a cada 6 meses",
    url: STRIPE_CHECKOUT_LINKS.semiannual,
  },
  {
    id: "annual",
    label: "Plano Anual",
    badge: "1 DIA TESTE",
    price: "R$226,80",
    period: "/ano",
    detail: "R$ 226,80 por ano — 1 dia de teste no primeiro ciclo",
    url: STRIPE_CHECKOUT_LINKS.annual,
  },
] as const

function SignupModal({ onSwitch }: { onSwitch: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [street, setStreet] = useState("")
  const [addressNumber, setAddressNumber] = useState("")
  const [complement, setComplement] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [city, setCity] = useState("")
  const [stateUf, setStateUf] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  function validateStep1() {
    const errs: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) errs.name = "Nome deve ter ao menos 2 caracteres"
    const em = email.trim().toLowerCase()
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errs.email = "E-mail inválido"
    const pw = validatePasswordStrong(password)
    if (!pw.ok) errs.password = pw.message
    if (password !== confirm) errs.confirm = "Senhas não coincidem"

    const addr: ProfileAddressInput = {
      postal_code: postalCode,
      street,
      address_number: addressNumber,
      complement,
      neighborhood,
      city,
      state: stateUf,
      country: "BR",
    }
    const addrErrs = validateAddressForSignup(addr)
    for (const [k, v] of Object.entries(addrErrs)) {
      errs[`addr_${k}`] = v
    }
    return errs
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateStep1()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(2)
  }

  function mapSignupError(message: string): string {
    const m = message.toLowerCase()
    if (m.includes("invalid_address_metadata")) {
      return "Endereço incompleto ou inválido. Confira CEP, UF e campos obrigatórios."
    }
    if (m.includes("invalid_cpf_metadata")) {
      return "O banco de dados ainda exige CPF no cadastro. Aplique a migração mais recente em database/supabase/migrations (fix_signup_trigger) no SQL Editor do Supabase."
    }
    if (m.includes("user already registered") || m.includes("already been registered")) {
      return "Já existe uma conta com este e-mail. Tente entrar."
    }
    if (m.includes("database error") || m.includes("unexpected_failure")) {
      return "Não foi possível concluir o cadastro. Verifique se as migrações do Supabase (trigger handle_new_user) estão aplicadas."
    }
    if (
      m.includes("rate limit") ||
      m.includes("email rate") ||
      m.includes("over_email_send") ||
      m.includes("too many requests") ||
      m.includes("429")
    ) {
      return "Limite de e-mails do Supabase atingido (confirmação de conta). Aguarde cerca de 1 hora, use outro e-mail de teste ou, em desenvolvimento, desative “Confirm email” em Authentication → Providers → Email no painel do projeto."
    }
    return message.trim() || "Erro ao criar conta. Tente novamente."
  }

  async function handleCheckout() {
    if (!selectedPlan) return
    const plan = PLANS.find((p) => p.id === selectedPlan)
    if (!plan) return

    if (!isSupabaseConfigured()) {
      setGlobalError("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    if (!plan.url || plan.url === "#" || !/^https?:\/\//i.test(plan.url)) {
      setGlobalError(
        "Link de pagamento não configurado. Defina NEXT_PUBLIC_STRIPE_LINK_MONTHLY, SEMIANNUAL e ANNUAL (ou as variáveis PRO_* legadas) no .env."
      )
      return
    }

    setLoading(true)
    setGlobalError("")

    try {
      const em = email.trim().toLowerCase()

      const { error } = await supabase.auth.signUp({
        email: em,
        password,
        options: {
          data: {
            full_name: name.trim(),
            postal_code: cepDigits(postalCode),
            street: street.trim(),
            address_number: addressNumber.trim(),
            complement: complement.trim(),
            neighborhood: neighborhood.trim(),
            city: city.trim(),
            state: stateUf.trim().toUpperCase(),
            country: "BR",
          },
        },
      })
      if (error) throw error

      window.location.href = plan.url
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setGlobalError(mapSignupError(msg))
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="Loading Nexus" width={56} height={56} className="object-contain" style={{ mixBlendMode: "screen" }} />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {step === 1 ? "Criar conta" : "Escolha seu plano"}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {step === 1
            ? "E-mail e senha para login · endereço para faturamento"
            : "Após o pagamento, use o app com sua conta"}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
              style={{ width: step >= s ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleStep1}
            className="space-y-4 max-h-[min(560px,68vh)] overflow-y-auto overscroll-contain pr-1 -mr-0.5"
          >
            <InputField label="Nome completo" value={name} onChange={setName} placeholder="João Silva" icon={User} error={errors.name} />
            <InputField label="E-mail" type="email" value={email} onChange={setEmail} placeholder="joao@email.com" icon={Mail} error={errors.email} />
            <InputField
              label="Senha"
              type="password"
              value={password}
              onChange={(v) => {
                setPassword(v)
                if (errors.password) setErrors((e) => ({ ...e, password: "" }))
              }}
              placeholder="8+ caracteres, maiúscula, minúscula, especial"
              icon={Lock}
              error={errors.password}
              hint="Mín. 8 caracteres, 1 maiúscula, 1 minúscula e 1 caractere especial"
            />
            <InputField label="Confirmar senha" type="password" value={confirm} onChange={setConfirm} placeholder="Repita a senha" icon={Lock} error={errors.confirm} />

            <div className="pt-2 border-t border-slate-800/60">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500/80 mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Endereço de cadastro
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="CEP"
                    value={postalCode}
                    onChange={(v) => { setPostalCode(formatCEP(v)); if (errors.addr_postal_code) setErrors((e) => { const n = { ...e }; delete n.addr_postal_code; return n }) }}
                    placeholder="00000-000"
                    icon={MapPin}
                    error={errors.addr_postal_code}
                    maxLength={9}
                  />
                  <InputField
                    label="UF"
                    value={stateUf}
                    onChange={(v) => { setStateUf(v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2)); if (errors.addr_state) setErrors((e) => { const n = { ...e }; delete n.addr_state; return n }) }}
                    placeholder="SP"
                    error={errors.addr_state}
                    maxLength={2}
                  />
                </div>
                <InputField
                  label="Logradouro"
                  value={street}
                  onChange={(v) => { setStreet(v); if (errors.addr_street) setErrors((e) => { const n = { ...e }; delete n.addr_street; return n }) }}
                  placeholder="Rua, avenida…"
                  error={errors.addr_street}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Número"
                    value={addressNumber}
                    onChange={(v) => { setAddressNumber(v); if (errors.addr_address_number) setErrors((e) => { const n = { ...e }; delete n.addr_address_number; return n }) }}
                    placeholder="123"
                    error={errors.addr_address_number}
                  />
                  <InputField
                    label="Complemento"
                    value={complement}
                    onChange={setComplement}
                    placeholder="Apto, bloco (opcional)"
                  />
                </div>
                <InputField
                  label="Bairro"
                  value={neighborhood}
                  onChange={(v) => { setNeighborhood(v); if (errors.addr_neighborhood) setErrors((e) => { const n = { ...e }; delete n.addr_neighborhood; return n }) }}
                  placeholder="Centro"
                  error={errors.addr_neighborhood}
                />
                <InputField
                  label="Cidade"
                  value={city}
                  onChange={(v) => { setCity(v); if (errors.addr_city) setErrors((e) => { const n = { ...e }; delete n.addr_city; return n }) }}
                  placeholder="São Paulo"
                  error={errors.addr_city}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-all duration-200 shadow-[0_0_24px_rgba(212,175,55,0.25)]"
            >
              Continuar para planos →
            </button>

            <p className="text-center text-sm text-slate-500">
              Já tem conta?{" "}
              <button type="button" onClick={onSwitch} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Entrar
              </button>
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`
                  w-full text-left p-4 rounded-xl border transition-all duration-200
                  ${selectedPlan === plan.id
                    ? "border-amber-500/60 bg-amber-500/10"
                    : "border-slate-700/50 bg-slate-900/50 hover:border-amber-500/30"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{plan.label}</span>
                      {plan.badge && (
                        <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.detail}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-xl font-bold text-amber-400">{plan.price}</span>
                    <span className="text-xs text-slate-500">{plan.period}</span>
                  </div>
                </div>
              </button>
            ))}

            {globalError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {globalError}
              </div>
            )}

            <button
              type="button"
              disabled={!selectedPlan || loading}
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black disabled:opacity-40 transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(212,175,55,0.25)]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Processando..." : "Ir para o pagamento"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors py-1"
            >
              ← Voltar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AuthModals() {
  const { mode, close, open } = useAuthModal()
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, close)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && close()
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [close])

  useEffect(() => {
    document.body.style.overflow = mode ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mode])

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(5,10,20,0.85)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative w-full bg-[#0a1525] border border-amber-500/15 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-8",
              mode === "account" ? "max-w-xl max-h-[92vh] flex flex-col" : mode === "signup" ? "max-w-xl" : "max-w-md"
            )}
          >
            {/* Gold top border accent */}
            <div className="absolute inset-x-0 top-0 h-[1px] rounded-t-2xl bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            <button
              onClick={close}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {mode === "login" && (
              <LoginModal onSwitch={() => open("signup")} onLoginSuccess={() => open("account")} />
            )}
            {mode === "signup" && (
              <SignupModal onSwitch={() => open("login")} />
            )}
            {mode === "account" && (
              <AccountModal onClose={close} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
