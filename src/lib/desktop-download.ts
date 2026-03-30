/** Obtém URL do instalador (API valida JWT e subscrição). */
export async function requestDesktopInstallerUrl(
  accessToken: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const res = await fetch("/api/desktop/download-url", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const body = (await res.json()) as { url?: string; error?: string }
  if (!res.ok || !body.url) {
    return { ok: false, error: body.error ?? "Não foi possível obter o link de download." }
  }
  return { ok: true, url: body.url }
}
