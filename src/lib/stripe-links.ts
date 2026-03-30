/** Payment Links — nomes novos + retrocompat com PRO_* */
export const STRIPE_CHECKOUT_LINKS = {
  monthly:
    process.env.NEXT_PUBLIC_STRIPE_LINK_MONTHLY ??
    process.env.NEXT_PUBLIC_STRIPE_LINK_PRO_MONTHLY ??
    "#",
  semiannual:
    process.env.NEXT_PUBLIC_STRIPE_LINK_SEMIANNUAL ??
    process.env.NEXT_PUBLIC_STRIPE_LINK_PRO_PLUS ??
    "#",
  annual:
    process.env.NEXT_PUBLIC_STRIPE_LINK_ANNUAL ??
    process.env.NEXT_PUBLIC_STRIPE_LINK_ANNUAL_PRO ??
    "#",
} as const
