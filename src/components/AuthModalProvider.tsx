"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

type ModalMode = "login" | "signup" | "account" | null

interface AuthModalCtx {
  open: (mode: ModalMode) => void
  close: () => void
  mode: ModalMode
}

const Ctx = createContext<AuthModalCtx>({
  open: () => {},
  close: () => {},
  mode: null,
})

export const useAuthModal = () => useContext(Ctx)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ModalMode>(null)
  const open = useCallback((m: ModalMode) => setMode(m), [])
  const close = useCallback(() => setMode(null), [])

  return (
    <Ctx.Provider value={{ open, close, mode }}>
      {children}
    </Ctx.Provider>
  )
}
