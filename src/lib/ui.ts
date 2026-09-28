// Tekrar eden arayüz sınıfları tek yerde: her sayfadaki kart, düğme ve form alanı
// aynı görünür. Bir görünümü değiştirmek için burayı değiştirmek yeter.
export const ui = {
  card: "rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(28,43,33,0.04)]",
  input:
    "w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-ink placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-on-primary transition hover:bg-primary-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-soft disabled:opacity-50",
  btnDanger:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger-soft disabled:opacity-50",
  error: "rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger",
  eyebrow: "text-xs font-semibold uppercase tracking-wider text-brand",
} as const;
