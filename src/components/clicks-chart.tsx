"use client";
// Son 30 günün günlük tıklama grafiği. Kütüphane kullanmadan, düz HTML/CSS ile çizildi.
// Fareyle (veya klavyeyle) bir sütunun üzerine gelince o günün değeri gösterilir.
import { useState } from "react";
import type { DailyPoint } from "@/lib/stats";

const dayFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
const fullFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" });

// "2026-09-28" metnini saat dilimi kaymasına uğramadan tarihe çevirir
function toDate(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function ClicksChart({ data }: { data: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.clicks));
  const activePoint = active !== null ? data[active] : null;

  return (
    <div className="space-y-2">
      <div className="flex h-5 items-center text-sm">
        {activePoint ? (
          <span>
            <span className="font-semibold tabular-nums">{activePoint.clicks} tıklama</span>
            <span className="text-zinc-500"> · {fullFormat.format(toDate(activePoint.day))}</span>
          </span>
        ) : (
          <span className="text-zinc-500">Bir güne gelerek ayrıntıyı gör</span>
        )}
      </div>

      <div className="relative">
        {/* Arka plan çizgileri: en üst değer ve sıfır tabanı */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-2">
          <div className="h-px flex-1 border-t border-dashed border-zinc-200 dark:border-zinc-800" />
          <span className="text-xs tabular-nums text-zinc-500">{max}</span>
        </div>

        <div
          className="flex h-40 items-end gap-0.5 border-b border-zinc-300 pr-8 dark:border-zinc-700"
          onMouseLeave={() => setActive(null)}
        >
          {data.map((point, i) => (
            <div
              key={point.day}
              tabIndex={0}
              aria-label={`${fullFormat.format(toDate(point.day))}: ${point.clicks} tıklama`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              // Sütunun tamamı (boş kısmı dahil) üzerine gelme alanıdır; ince çubuğu tutturmak gerekmez
              className="group flex h-full flex-1 items-end justify-center outline-none"
            >
              <div
                className="w-full max-w-6 rounded-t bg-[var(--series-1)] transition-opacity group-focus-visible:ring-2 group-focus-visible:ring-[var(--series-1)] group-focus-visible:ring-offset-2"
                style={{
                  height: point.clicks === 0 ? 0 : `${Math.max(2, (point.clicks / max) * 100)}%`,
                  opacity: active === null || active === i ? 1 : 0.4,
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-1 flex justify-between pr-8 text-xs text-zinc-500">
          <span>{dayFormat.format(toDate(data[0].day))}</span>
          <span>{dayFormat.format(toDate(data[Math.floor(data.length / 2)].day))}</span>
          <span>Bugün</span>
        </div>
      </div>

      {/* Erişilebilirlik: aynı veri tablo olarak da okunabilir */}
      <details className="text-sm">
        <summary className="cursor-pointer text-zinc-500">Tablo olarak gör</summary>
        <table className="mt-2 w-full max-w-sm text-left">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1 font-medium">Gün</th>
              <th className="py-1 text-right font-medium">Tıklama</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((p) => (
              <tr key={p.day} className="border-t border-zinc-100 dark:border-zinc-900">
                <td className="py-1">{dayFormat.format(toDate(p.day))}</td>
                <td className="py-1 text-right tabular-nums">{p.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
