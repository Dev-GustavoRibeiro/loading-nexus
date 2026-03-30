import type { NextConfig } from "next"
import path from "path"
import { fileURLToPath } from "url"

/** Diretório deste app — evita inferência errada do Turbopack quando há vários lockfiles acima (monorepo / home). */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: turbopackRoot,
  },
}

export default nextConfig
