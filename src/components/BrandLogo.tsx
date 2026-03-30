import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  width?: number
  height?: number
}

export function BrandLogo({ className, width = 40, height = 40 }: Props) {
  return (
    <Image
      src="/logo.png"
      alt="Loading Nexus"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      style={{ mixBlendMode: "screen" }}
      priority
    />
  )
}
