import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const ALLOWED_SUBSCRIPTION = new Set(["trialing", "active"])

/** Caminho público (ex. /installers/setup.exe) → URL absoluta com segmentos codificados. */
function absoluteUrlForPublicPath(request: Request, publicPath: string): string | null {
  const trimmed = publicPath.trim()
  if (!trimmed.startsWith("/")) return null
  const origin = new URL(request.url).origin
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? origin).replace(/\/$/, "")
  const segments = trimmed.split("/").filter(Boolean).map((s) => encodeURIComponent(s))
  return `${base}/${segments.join("/")}`
}

function resolveInstallerUrl(request: Request): string | null {
  const override = process.env.DESKTOP_INSTALLER_DOWNLOAD_URL?.trim()
  if (override) {
    if (!URL.canParse(override)) return null
    return override
  }

  const publicPath = process.env.DESKTOP_INSTALLER_PUBLIC_PATH?.trim()
  if (!publicPath) return null
  return absoluteUrlForPublicPath(request, publicPath)
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
  }

  const token = authHeader.slice(7).trim()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Servidor não configurado (Supabase)." }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 })
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle()

  if (profileErr) {
    return NextResponse.json({ error: "Não foi possível ler o perfil." }, { status: 500 })
  }

  const status = (profile?.subscription_status ?? "none").toLowerCase()
  if (!ALLOWED_SUBSCRIPTION.has(status)) {
    return NextResponse.json(
      { error: "Download disponível apenas com assinatura ativa ou em período de teste." },
      { status: 403 }
    )
  }

  const url = resolveInstallerUrl(request)
  if (!url) {
    return NextResponse.json(
      {
        error:
          "Instalador não configurado. Coloque o .exe em public/installers/ e defina DESKTOP_INSTALLER_PUBLIC_PATH (ex.: /installers/Loading-Nexus-Setup-0.1.5.exe), ou use DESKTOP_INSTALLER_DOWNLOAD_URL.",
      },
      { status: 503 }
    )
  }

  return NextResponse.json({ url })
}
