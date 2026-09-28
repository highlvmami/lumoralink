// LumoraLink logosu: yaprak + zincir halkası birleşimi basit bir işaret.
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-xl bg-primary text-on-primary ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* yaprak */}
        <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
        {/* yaprağın damarı, aynı zamanda bir bağlantı çizgisi */}
        <path d="M5 19 14 10" />
      </svg>
    </span>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight text-ink">
        Lumora<span className="text-brand">Link</span>
      </span>
    </span>
  );
}
