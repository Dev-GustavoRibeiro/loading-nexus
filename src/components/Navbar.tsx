"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { LogIn, UserPlus, UserCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BrandLogo } from "@/components/BrandLogo"
import { useAuthModal } from "@/components/AuthModalProvider"
import { useSession } from "@/components/SessionProvider"

const NAV_LINKS = [
  { label: "Recursos", href: "#features" },
  { label: "Planos", href: "#pricing" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open } = useAuthModal()
  const { user, loading: sessionLoading } = useSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#050a14]/95 backdrop-blur-xl border-b border-amber-900/20 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[80px] py-2 sm:min-h-[88px] sm:py-2.5">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 sm:gap-4 group shrink-0">
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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-500/70 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {!sessionLoading && user ? (
              <button
                type="button"
                onClick={() => open("account")}
                className="flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 px-4 py-2 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 transition-all"
              >
                <UserCircle2 className="w-4 h-4" />
                Minha conta
              </button>
            ) : !sessionLoading ? (
              <>
                <button
                  onClick={() => open("login")}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-slate-800/40"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Entrar
                </button>
                <ShimmerButton
                  shimmerColor="#f0d875"
                  background="rgba(212,175,55,0.12)"
                  borderRadius="10px"
                  className="text-sm font-bold px-5 py-2 border-amber-500/30 text-amber-300 hover:text-amber-200"
                  onClick={() => open("signup")}
                >
                  <UserPlus className="w-3.5 h-3.5 inline mr-1.5 -mt-px" />
                  Criar conta
                </ShimmerButton>
              </>
            ) : null}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-200 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            <div className="space-y-[5px] w-6">
              <span className={cn("block h-[2px] bg-current rounded-full transition-all duration-250", mobileOpen && "rotate-45 translate-y-[7px]")} />
              <span className={cn("block h-[2px] bg-current rounded-full transition-all duration-250", mobileOpen && "opacity-0 scale-x-0")} />
              <span className={cn("block h-[2px] bg-current rounded-full transition-all duration-250", mobileOpen && "-rotate-45 -translate-y-[7px]")} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden bg-[#080f1e]/98 backdrop-blur-xl border-t border-slate-800/60 overflow-hidden"
          >
            <div className="px-4 py-5 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 rounded-lg transition-all text-sm"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 space-y-2 border-t border-slate-800/60">
                {!sessionLoading && user ? (
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); open("account") }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-amber-300 border border-amber-500/30 rounded-xl bg-amber-500/10"
                  >
                    <UserCircle2 className="w-4 h-4" />
                    Minha conta
                  </button>
                ) : !sessionLoading ? (
                  <>
                    <button
                      onClick={() => { setMobileOpen(false); open("login") }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-400 border border-slate-700/60 rounded-xl hover:border-slate-600 hover:text-slate-200 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); open("signup") }}
                      className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                      Criar conta
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
