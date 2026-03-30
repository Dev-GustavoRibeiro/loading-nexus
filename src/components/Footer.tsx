"use client"

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { X } from "lucide-react"
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

export function Footer() {
  const [active, setActive] = useState<FooterModalId | null>(null)

  const close = useCallback(() => setActive(null), [])

  return (
    <>
      <footer className="relative border-t border-slate-800/60 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <BrandLogo width={32} height={32} />
                <span className="text-slate-100 font-bold text-base">
                  Loading<span className="text-amber-400">Nexus</span>
                </span>
              </Link>
              <p className="text-xs text-slate-600 leading-relaxed">
                Performance no Windows para quem exige resposta — jogos, trabalho e criação.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Produto</h4>
              <ul className="space-y-2">
                {PRODUTO_LINKS.map(({ label, id }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setActive(id)}
                      className="text-xs text-slate-600 hover:text-slate-300 transition-colors text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Suporte</h4>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">Atendimento apenas pelo WhatsApp.</p>
              <a
                href={SUPPORT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500/90 hover:text-emerald-400 transition-colors"
              >
                {SUPPORT_WHATSAPP_LABEL}
              </a>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Legal</h4>
              <ul className="space-y-2">
                {LEGAL_LINKS.map(({ label, id }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setActive(id)}
                      className="text-xs text-slate-600 hover:text-slate-300 transition-colors text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h-px bg-white/[0.05] mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-700">© 2026 Loading Nexus. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                App desktop: Windows 10 ou 11 (por agora)
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
