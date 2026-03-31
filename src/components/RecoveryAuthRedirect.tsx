"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"

/**
 * Após o clique no e-mail, o Supabase redireciona para a Site URL com sessão no hash ou com `?code=` (PKCE).
 * Leva o utilizador para a página onde define a nova senha.
 */
export function RecoveryAuthRedirect() {
  const pathname = usePathname()
  const codeHandled = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (pathname === "/auth/atualizar-senha") return

    const hash = window.location.hash
    if (hash.length > 2) {
      const hp = new URLSearchParams(hash.replace(/^#/, ""))
      if (hp.get("type") === "recovery") {
        window.location.replace(`${window.location.origin}/auth/atualizar-senha${hash}`)
        return
      }
    }

    const code = new URLSearchParams(window.location.search).get("code")
    if (!code || codeHandled.current) return
    codeHandled.current = true

    void supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        codeHandled.current = false
        return
      }
      const path = window.location.pathname || "/"
      const nextUrl = `${window.location.origin}/auth/atualizar-senha`
      window.history.replaceState(null, "", path)
      window.location.assign(nextUrl)
    })
  }, [pathname])

  return null
}
