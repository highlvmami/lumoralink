// "Nereden geldiler, hangi cihazı kullandılar" listeleri.
// Her satırda ad, sayı, yüzde ve oranı gösteren ince bir çubuk var.
import type { BreakdownRow } from "@/lib/stats";

type Props = {
  title: string;
  rows: BreakdownRow[];
  total: number;
  emptyLabel: string; // değer boşsa gösterilecek ad (ör. "Doğrudan", "Bilinmiyor")
  format?: (label: string) => string;
};

export function BreakdownList({ title, rows, total, emptyLabel, format }: Props) {
  return (
    <section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">Henüz veri yok</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const label =
              row.label === "__other__"
                ? "Diğer"
                : row.label === ""
                  ? emptyLabel
                  : (format?.(row.label) ?? row.label);
            const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
            return (
              <li key={row.label} className="space-y-1">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate">{label}</span>
                  <span className="shrink-0 tabular-nums text-zinc-600 dark:text-zinc-400">
                    {row.count} <span className="text-zinc-500">· %{pct}</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className="h-full rounded-full bg-[var(--series-1)]"
                    style={{ width: `${Math.max(pct, 1)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
