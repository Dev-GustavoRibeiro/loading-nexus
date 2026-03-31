import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/** Cliente browser — use apenas no cliente (modais, hooks). */
export const supabase = createClient(
  supabaseUrl || "https://invalid.supabase.co",
  supabaseAnonKey || "invalid"
)

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

/**
 * `redirect_to` no e-mail de recuperação.
 * Usar só a **origem** (ex. `https://seudominio.com`) evita o erro JSON em `*.supabase.co`:
 * `{"error":"requested path is invalid"}` quando `/auth/atualizar-senha` não está em Redirect URLs.
 * O fragmento da sessão (`#...type=recovery`) cai na raiz; `RecoveryAuthRedirect` envia para `/auth/atualizar-senha`.
 * A **Site URL** no painel Supabase deve ser essa mesma origem (com/sem www igual ao site).
 */
/** Garante URL absoluta: sem `https://`, o GoTrue pode tratar `host.tld` como path em `*.supabase.co`. */
function normalizePublicSiteUrl(raw: string): string {
  const t = raw.trim()
  if (!t) return t
  if (/^https?:\/\//i.test(t)) return t
  // host[:porta] sem path — prefixar https (evita redirect relativo no servidor Supabase)
  if (/^[\w.-]+(?::\d+)?$/i.test(t)) return `https://${t}`
  return t
}

export function getPasswordResetRedirectUrl(): string {
  if (typeof window === "undefined") return ""
  const raw = normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "")
  const fallback = window.location.origin
  if (!raw) {
    try {
      return new URL(fallback).origin
    } catch {
      return fallback
    }
  }
  try {
    return new URL(raw).origin
  } catch {
    return fallback
  }
}

export type ProfileRow = {
  id: string
  full_name: string
  cpf: string | null
  email: string | null
  created_at: string
  updated_at: string
  postal_code: string | null
  street: string | null
  address_number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  country: string | null
  stripe_customer_id: string | null
  subscription_status: string | null
  subscription_plan_label: string | null
  current_period_end: string | null
  payment_method_brand: string | null
  payment_method_last4: string | null
}

export type ProfileAddressInput = {
  postal_code: string
  street: string
  address_number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  country: string
}

const PROFILE_SELECT =
  "id, full_name, cpf, email, created_at, updated_at, postal_code, street, address_number, complement, neighborhood, city, state, country, stripe_customer_id, subscription_status, subscription_plan_label, current_period_end, payment_method_brand, payment_method_last4"

/** Valida CPF brasileiro */
export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "")
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false

  const calc = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += parseInt(clean[i], 10) * (len + 1 - i)
    const rem = (sum * 10) % 11
    return rem === 10 || rem === 11 ? 0 : rem
  }

  return calc(9) === parseInt(clean[9], 10) && calc(10) === parseInt(clean[10], 10)
}

/** Formata CPF enquanto o usuário digita */
export function formatCPF(value: string): string {
  const clean = value.replace(/\D/g, "").slice(0, 11)
  if (clean.length <= 3) return clean
  if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`
  if (clean.length <= 9) return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`
}

/** CEP só dígitos (8) */
export function cepDigits(cep: string): string {
  return cep.replace(/\D/g, "").slice(0, 8)
}

/** Formata CEP 00000-000 */
export function formatCEP(value: string): string {
  const d = cepDigits(value)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

const BRAZIL_UF = new Set([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SE", "SP", "TO",
])

/** Valida endereço completo (cadastro) */
export function validateAddressForSignup(a: ProfileAddressInput): Record<string, string> {
  const errs: Record<string, string> = {}
  const cep = cepDigits(a.postal_code)
  if (cep.length !== 8) errs.postal_code = "CEP deve ter 8 dígitos"
  if (!a.street?.trim()) errs.street = "Logradouro é obrigatório"
  if (!a.address_number?.trim()) errs.address_number = "Número é obrigatório"
  if (!a.neighborhood?.trim()) errs.neighborhood = "Bairro é obrigatório"
  if (!a.city?.trim()) errs.city = "Cidade é obrigatória"
  const uf = (a.state ?? "").trim().toUpperCase()
  if (uf.length !== 2 || !BRAZIL_UF.has(uf)) errs.state = "UF inválida (ex.: SP)"
  return errs
}

const SPECIAL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/

/** Senha: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 caractere especial */
export function validatePasswordStrong(password: string): { ok: true } | { ok: false; message: string } {
  if (password.length < 8) {
    return { ok: false, message: "A senha deve ter no mínimo 8 caracteres" }
  }
  if (!/[A-ZÀ-Ü]/.test(password)) {
    return { ok: false, message: "Inclua ao menos uma letra maiúscula" }
  }
  if (!/[a-zà-ü]/.test(password)) {
    return { ok: false, message: "Inclua ao menos uma letra minúscula" }
  }
  if (!SPECIAL_RE.test(password)) {
    return { ok: false, message: "Inclua ao menos um caractere especial (!@#$%…)" }
  }
  return { ok: true }
}

/** Apenas dígitos do CPF (11) para o banco */
export function cpfDigits(cpf: string): string {
  return cpf.replace(/\D/g, "").slice(0, 11)
}

/** Perfil do usuário logado (RLS: só a própria linha) */
export async function fetchMyProfile(): Promise<ProfileRow | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", user.id)
    .maybeSingle()
  if (error || !data) return null
  return data as ProfileRow
}

/** Atualiza endereço (usuário autenticado) */
export async function updateMyProfileAddress(
  patch: ProfileAddressInput
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: "Sessão expirada. Entre novamente." }
  const errs = validateAddressForSignup(patch)
  if (Object.keys(errs).length) return { ok: false, message: Object.values(errs)[0] ?? "Dados inválidos" }

  const { error } = await supabase
    .from("profiles")
    .update({
      postal_code: cepDigits(patch.postal_code),
      street: patch.street.trim(),
      address_number: patch.address_number.trim(),
      complement: patch.complement.trim() || null,
      neighborhood: patch.neighborhood.trim(),
      city: patch.city.trim(),
      state: patch.state.trim().toUpperCase(),
      country: (patch.country || "BR").trim().toUpperCase() || "BR",
    })
    .eq("id", user.id)

  if (error) return { ok: false, message: error.message }
  return { ok: true }
}

/** Rótulos em PT para status de assinatura (Stripe-like) */
export const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
  none: "Sem assinatura ativa",
  active: "Ativa",
  past_due: "Pagamento em atraso",
  canceled: "Cancelada",
  unpaid: "Não paga",
  trialing: "Período de teste",
  incomplete: "Incompleta",
  incomplete_expired: "Expirada",
  paused: "Pausada",
}

export function formatDisplayCEP(digits: string | null | undefined): string {
  if (!digits || digits.length !== 8) return "—"
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}
