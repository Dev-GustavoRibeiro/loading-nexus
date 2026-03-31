import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  width?: number
  height?: number
  /** No header, `screen` pode esbatuar o PNG em fundos escuros. */
  blendScreen?: boolean
}

export function BrandLogo({ className, width = 40, height = 40, blendScreen = true }: Props) {
  return (
    <Image
      src="/logo.png"
      alt="Loading Nexus"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      style={blendScreen ? { mixBlendMode: "screen" } : undefined}
      priority
    />
  )
}
