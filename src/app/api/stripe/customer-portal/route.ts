import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
  }

  const token = authHeader.slice(7).trim()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const stripeSecret = process.env.STRIPE_SECRET_KEY

  if (!supabaseUrl || !supabaseAnonKey || !stripeSecret) {
    return NextResponse.json({ error: "Servidor não configurado (Supabase ou Stripe)." }, { status: 500 })
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
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle()

  if (profileErr) {
    return NextResponse.json({ error: "Não foi possível ler o perfil." }, { status: 500 })
  }

  const customerId = profile?.stripe_customer_id?.trim()
  if (!customerId) {
    return NextResponse.json(
      {
        error:
          "Nenhum cliente Stripe vinculado à conta. Conclua uma assinatura pelo checkout ou aguarde a sincronização.",
      },
      { status: 400 }
    )
  }

  const stripe = new Stripe(stripeSecret)
  const origin = new URL(request.url).origin
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || origin).replace(/\/$/, "")
  const portalConfig = process.env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID?.trim()

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/`,
      ...(portalConfig ? { configuration: portalConfig } : {}),
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao abrir o portal."
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
