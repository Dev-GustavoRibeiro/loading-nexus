"use client"

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X, Mail } from "lucide-react"
import { BrandLogo } from "@/components/BrandLogo"
import { SUPPORT_WHATSAPP_LABEL, SUPPORT_WHATSAPP_URL } from "@/lib/support"
import { cn } from "@/lib/utils"

type FooterModalId =
  | "recursos"
  | "precos"
  | "compat"
  | "changelog"
  | "termos"
  | "privacidade"
  | "cookies"
  | "lgpd"

const MODAL_TITLES: Record<FooterModalId, string> = {
  recursos: "Recursos",
  precos: "Preços",
  compat: "Compatibilidade",
  changelog: "Changelog",
  termos: "Termos de uso",
  privacidade: "Política de privacidade",
  cookies: "Cookies",
  lgpd: "LGPD e os seus direitos",
}

function ModalShell({
  title,
  open,
  onClose,
  children,
}: {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!isClient || !open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="footer-modal-title"
        className={cn(
          "relative z-10 w-full sm:max-w-lg md:max-w-xl max-h-[88vh] sm:max-h-[85vh] overflow-hidden flex flex-col",
          "rounded-t-2xl sm:rounded-2xl border border-slate-700/80 bg-[#0a1020] shadow-2xl shadow-black/50"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-800/80 shrink-0">
          <h2 id="footer-modal-title" className="text-base font-bold text-slate-100 pr-2">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 py-4 text-sm text-slate-400 leading-relaxed space-y-4">
          {children}
        </div>
        <div className="px-5 py-3 border-t border-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-800/80 text-slate-200 hover:bg-slate-800 border border-slate-600/50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-3 [&_strong]:text-slate-200 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1">{children}</div>
}

function ModalBody({ id, onNavigate }: { id: FooterModalId; onNavigate: () => void }) {
  switch (id) {
    case "recursos":
      return (
        <Prose>
          <p>
            O <strong>Loading Nexus</strong> oferece diagnóstico e otimização do Windows, painel de métricas (CPU, GPU,
            temperaturas, FPS quando aplicável), ajustes para reduzir travamentos e latência, e gestão de licença por
            conta — ideal para jogos exigentes, trabalho pesado, streaming e criação.
          </p>
          <p>
            Veja a secção <strong>Recursos</strong> na página principal para o detalhe de cada funcionalidade.
          </p>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault()
              onNavigate()
              requestAnimationFrame(() =>
                document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })
              )
            }}
            className="inline-block text-amber-400 hover:text-amber-300 font-semibold text-sm"
          >
            Ir para recursos →
          </a>
        </Prose>
      )
    case "precos":
      return (
        <Prose>
          <p>
            Oferecemos <strong>plano mensal</strong> (a partir de R$27,90), <strong>semestral</strong> e{" "}
            <strong>anual</strong> (com 1 dia de teste no primeiro ciclo do anual). Pagamento seguro via Stripe; pode
            cancelar conforme os termos e o portal de faturação.
          </p>
          <p>Todos os planos incluem o mesmo software; a diferença é o período de cobrança e a economia no longo prazo.</p>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault()
              onNavigate()
              requestAnimationFrame(() =>
                document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })
              )
            }}
            className="inline-block text-amber-400 hover:text-amber-300 font-semibold text-sm"
          >
            Ver tabela de preços →
          </a>
        </Prose>
      )
    case "compat":
      return (
        <Prose>
          <p>
            <strong>Por enquanto, só Windows:</strong> o aplicativo desktop Loading Nexus existe apenas para{" "}
            <strong>Microsoft Windows</strong> (recomendamos Windows 10 ou 11 atualizado). Versões e requisitos detalhados
            vêm no instalador e na documentação. Algumas otimizações pedem permissão de administrador.
          </p>
          <p>
            <strong>macOS e Linux</strong> não são suportados neste momento. O site, login e gestão de conta funcionam em
            qualquer sistema com browser moderno; o programa em si, apenas no PC Windows.
          </p>
        </Prose>
      )
    case "changelog":
      return (
        <Prose>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Versão 0.1.5</p>
          <ul className="text-slate-400 list-disc pl-4 space-y-1">
            <li>Painel de saúde e métricas do sistema</li>
            <li>Fluxos de otimização e limpeza do Windows</li>
            <li>Integração com conta e assinatura (Stripe / Supabase)</li>
            <li>Melhorias de estabilidade e interface</li>
          </ul>
          <p className="text-xs text-slate-600 pt-2">
            As próximas versões serão comunicadas aqui e, quando relevante, na área da conta ou pelo suporte.
          </p>
        </Prose>
      )
    case "termos":
      return (
        <Prose>
          <p>
            Ao utilizar o site, criar conta, assinar ou instalar o <strong>Loading Nexus</strong>, você concorda em
            cumprir estes termos. O serviço é oferecido &quot;no estado em que se encontra&quot;; esforçamo-nos por
            disponibilidade contínua, sem garantia de ausência de interrupções.
          </p>
          <p>
            A <strong>licença</strong> é pessoal, vinculada à sua conta, com uso em <strong>uma máquina de cada vez</strong>,
            salvo disposição em contrário no produto. É proibido revender, engenharia reversa para contornar pagamento ou
            uso que viole leis ou termos de terceiros (incluindo jogos e plataformas).
          </p>
          <p>
            <strong>Pagamentos e cancelamentos</strong> seguem a Stripe e as opções do portal de cliente. Não nos
            responsabilizamos por danos indiretos ou perda de dados; recomendamos backup antes de alterações profundas
            no sistema.
          </p>
          <p className="text-xs text-slate-600">
            Texto resumido para transparência. Para questões contratuais específicas, contacte-nos pelo WhatsApp.
          </p>
        </Prose>
      )
    case "privacidade":
      return (
        <Prose>
          <p>
            Tratamos dados para <strong>prestar o serviço</strong> (conta, autenticação, assinatura, suporte),{" "}
            <strong>cumprir obrigações legais</strong> e, quando aplicável, <strong>melhorar o produto</strong> de forma
            agregada, sem vender dados pessoais a terceiros para marketing deles.
          </p>
          <p>
            Utilizamos <strong>Supabase</strong> (conta/perfil), <strong>Stripe</strong> (pagamentos — não armazenamos
            número completo do cartão no nosso servidor) e infraestrutura de alojamento conforme a sua região de deploy.
          </p>
          <p>
            Conservamos dados pelo tempo necessário à relação contratual e à lei. Pode solicitar informações ou exercer
            direitos (acesso, correção, eliminação quando aplicável) via WhatsApp ou canal indicado na conta.
          </p>
          <p className="text-xs text-slate-600">
            Política resumida. Detalhes adicionais podem constar de documentos específicos de tratamento e do registro
            junto à autoridade, quando exigido.
          </p>
        </Prose>
      )
    case "cookies":
      return (
        <Prose>
          <p>
            Este site pode utilizar <strong>cookies</strong> e tecnologias similares para sessão, preferências, segurança
            (ex.: CSRF em formulários) e, se ativar ferramentas de analytics/marketing, para medir utilização — sempre
            respeitando a legislação aplicável.
          </p>
          <p>
            Pode limpar ou bloquear cookies nas definições do browser; algumas funções (login, checkout) podem deixar de
            funcionar corretamente sem cookies necessários.
          </p>
          <p className="text-xs text-slate-600">
            Não utilizamos cookies para fins que não estejam alinhados com a operação do serviço e a sua privacidade.
          </p>
        </Prose>
      )
    case "lgpd":
      return (
        <Prose>
          <p>
            Nos termos da <strong>Lei n.º 13.709/2018 (LGPD)</strong>, você tem direito a confirmação de tratamento,
            acesso, correção, anonimização, portabilidade quando aplicável, eliminação de dados desnecessários, informação
            sobre partilhas e revogação de consentimento quando o tratamento se basear nele.
          </p>
          <p>
            O <strong>encarregado de proteção de dados (DPO)</strong> ou canal de pedidos pode ser contactado pelo{" "}
            <a href={SUPPORT_WHATSAPP_URL} className="text-emerald-400 hover:text-emerald-300 font-medium">
              WhatsApp {SUPPORT_WHATSAPP_LABEL}
            </a>
            . Responderemos no prazo legal, podendo solicitar identificação razoável para evitar divulgação a terceiros.
          </p>
          <p className="text-xs text-slate-600">
            Também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD), conforme a lei.
          </p>
        </Prose>
      )
    default:
      return null
  }
}

const PRODUTO_LINKS: { label: string; id: FooterModalId }[] = [
  { label: "Recursos", id: "recursos" },
  { label: "Preços", id: "precos" },
  { label: "Compatibilidade", id: "compat" },
  { label: "Changelog", id: "changelog" },
]

const LEGAL_LINKS: { label: string; id: FooterModalId }[] = [
  { label: "Termos de Uso", id: "termos" },
  { label: "Privacidade", id: "privacidade" },
  { label: "Cookies", id: "cookies" },
  { label: "LGPD", id: "lgpd" },
]

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const CONTACT_ITEMS = [
  {
    icon: InstagramIcon,
    label: "@loading.nexus",
    href: "https://instagram.com/loading.nexus",
    color: "text-pink-400 group-hover:text-pink-300",
    bg: "bg-pink-500/10 group-hover:bg-pink-500/20 border-pink-500/20",
  },
  {
    icon: Mail,
    label: "nexus@loading.dev.br",
    href: "mailto:nexus@loading.dev.br",
    color: "text-amber-400 group-hover:text-amber-300",
    bg: "bg-amber-500/10 group-hover:bg-amber-500/20 border-amber-500/20",
  },
  {
    icon: WhatsAppIcon,
    label: SUPPORT_WHATSAPP_LABEL,
    href: SUPPORT_WHATSAPP_URL,
    color: "text-emerald-400 group-hover:text-emerald-300",
    bg: "bg-emerald-500/10 group-hover:bg-emerald-500/20 border-emerald-500/20",
    external: true,
  },
]

export function Footer() {
  const [active, setActive] = useState<FooterModalId | null>(null)

  const close = useCallback(() => setActive(null), [])

  return (
    <>
      <footer className="relative overflow-hidden bg-[#040810]">

        {/* ── Dot-grid texture ─────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── Ambient glows ────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 15% 110%, rgba(212,175,55,0.08) 0%, transparent 60%), " +
              "radial-gradient(ellipse 60% 40% at 85% 110%, rgba(30,58,150,0.10) 0%, transparent 60%)",
          }}
        />

        {/* ── CTA strip ────────────────────────────────────────────── */}
        <div className="relative border-b border-white/[0.05]">
          {/* Glow line top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col items-center text-center gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/8 text-[11px] font-semibold text-amber-400 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Para Windows 10 &amp; 11
            </div>

            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tighter max-w-2xl"
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 40%, #d4af37 75%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Seu PC. Seu potencial.
            </h2>

            <p className="text-sm sm:text-base text-slate-500 max-w-sm leading-relaxed">
              Otimização real, painel de métricas e ajustes que o Windows não faz sozinho.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:from-amber-400 hover:to-amber-300 transition-all duration-200"
              >
                Ver planos
                <span aria-hidden="true">→</span>
              </a>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/loading.nexus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @loading.nexus"
                  className="group w-10 h-10 rounded-xl border border-pink-500/20 bg-pink-500/8 hover:bg-pink-500/18 hover:border-pink-500/40 flex items-center justify-center transition-all duration-200"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
                </a>
                <a
                  href="mailto:nexus@loading.dev.br"
                  aria-label="E-mail nexus@loading.dev.br"
                  className="group w-10 h-10 rounded-xl border border-amber-500/20 bg-amber-500/8 hover:bg-amber-500/18 hover:border-amber-500/40 flex items-center justify-center transition-all duration-200"
                >
                  <Mail className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
                </a>
                <a
                  href={SUPPORT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Suporte via WhatsApp"
                  className="group w-10 h-10 rounded-xl border border-emerald-500/20 bg-emerald-500/8 hover:bg-emerald-500/18 hover:border-emerald-500/40 flex items-center justify-center transition-all duration-200"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main grid ────────────────────────────────────────────── */}
        <div className="relative py-12 px-4 sm:px-6 border-b border-white/[0.04]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-14">

            {/* Brand column */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-2 space-y-6">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                className="flex items-center gap-3 sm:gap-4 group w-fit shrink-0"
              >
                <div className="relative size-16 shrink-0 sm:size-[5.25rem]">
                  <BrandLogo
                    width={84}
                    height={84}
                    className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span
                  className="font-black text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #4a7ab5 0%, #c4cbd4 35%, #d4af37 65%, #f0d875 100%)",
                  }}
                >
                  Loading Nexus
                </span>
              </a>

              <p className="text-[13px] text-slate-500 leading-relaxed max-w-[260px]">
                Do gamer ao criador de conteúdo — ajustes transparentes, painel real. Sem truques opacos.
              </p>
            </div>

            {/* Produto */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.14em] mb-4">Produto</h4>
              <ul className="space-y-3">
                {PRODUTO_LINKS.map(({ label, id }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setActive(id)}
                      className="text-[12px] text-slate-500 hover:text-slate-200 transition-colors text-left group flex items-center gap-1.5"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-amber-500 shrink-0">›</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suporte */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.14em] mb-4">Suporte</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href={SUPPORT_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-emerald-500/80 hover:text-emerald-400 transition-colors font-medium group flex items-center gap-1.5"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-emerald-400 shrink-0">›</span>
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:nexus@loading.dev.br"
                    className="text-[12px] text-amber-500/70 hover:text-amber-400 transition-colors font-medium group flex items-center gap-1.5"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-amber-400 shrink-0">›</span>
                    E-mail
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/loading.nexus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-pink-500/70 hover:text-pink-400 transition-colors font-medium group flex items-center gap-1.5"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-pink-400 shrink-0">›</span>
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.14em] mb-4">Legal</h4>
              <ul className="space-y-3">
                {LEGAL_LINKS.map(({ label, id }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setActive(id)}
                      className="text-[12px] text-slate-500 hover:text-slate-200 transition-colors text-left group flex items-center gap-1.5"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-amber-500 shrink-0">›</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────── */}
        <div className="relative py-5 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-700">
              © 2026 Loading Nexus — Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Windows 10 / 11
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <span className="text-[11px] text-slate-700">v0.1.5</span>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/loading.nexus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-slate-700 hover:text-pink-400 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="mailto:nexus@loading.dev.br"
                  aria-label="E-mail"
                  className="text-slate-700 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </footer>

      {active ? (
        <ModalShell title={MODAL_TITLES[active]} open onClose={close}>
          <ModalBody id={active} onNavigate={close} />
        </ModalShell>
      ) : null}
    </>
  )
}
