import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/SessionProvider"
import { AuthModalProvider } from "@/components/AuthModalProvider"
import { AuthModals } from "@/components/AuthModals"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Loading Nexus — Otimização do Windows (app desktop)",
  description:
    "Aplicação para Windows: diagnóstico, limpeza e ajustes inteligentes para mais fluidez em jogos, trabalho pesado, streaming e criação. Planos a partir de R$27,90/mês; anual com 1 dia de teste.",
  keywords: [
    "otimização Windows",
    "performance PC",
    "fps boost",
    "anti-lag",
    "Loading Nexus",
    "PC lento",
    "streaming",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Loading Nexus — PC mais rápido e previsível",
    description:
      "Software para Windows — mais fluidez em jogos, multitarefa, streaming e ferramentas pesadas.",
    type: "website",
    images: ["/logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} relative h-full antialiased dark`}
    >
      <body className="relative min-h-full flex flex-col bg-[#050a14] text-slate-100">
        <SessionProvider>
          <AuthModalProvider>
            {children}
            <AuthModals />
          </AuthModalProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
