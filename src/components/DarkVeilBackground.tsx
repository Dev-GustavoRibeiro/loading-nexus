"use client"

import dynamic from "next/dynamic"

const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050a14]" aria-hidden />,
})

type Props = {
  className?: string
  /** Ajuste de matiz (graus) — valores ~200–260 puxam para azul. */
  hueShift?: number
  noiseIntensity?: number
  scanlineIntensity?: number
  speed?: number
  warpAmount?: number
}

export function DarkVeilBackground({
  className = "",
  hueShift = 235,
  noiseIntensity = 0.04,
  scanlineIntensity = 0.06,
  speed = 0.45,
  warpAmount = 0.12,
}: Props) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <DarkVeil
        hueShift={hueShift}
        noiseIntensity={noiseIntensity}
        scanlineIntensity={scanlineIntensity}
        speed={speed}
        scanlineFrequency={0.5}
        warpAmount={warpAmount}
        resolutionScale={1}
      />
    </div>
  )
}
