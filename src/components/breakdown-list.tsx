// "Nereden geldiler, hangi cihazı kullandılar" listeleri.
// Her satırda ad, sayı, yüzde ve oranı gösteren ince bir çubuk var.
import type { BreakdownRow } from "@/lib/stats";
import { ui } from "@/lib/ui";

type Props = {
  title: string;
  rows: BreakdownRow[];
  total: number;
  emptyLabel: string; // değer boşsa gösterilecek ad (ör. "Doğrudan", "Bilinmiyor")
  format?: (label: string) => string;
};

export function BreakdownList({ title, rows, total, emptyLabel, format }: Props) {
  return (
    <section className={`${ui.card} p-6`}>
      <h2 className="mb-4 font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">Henüz veri yok</p>
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
                  <span className="shrink-0 font-medium tabular-nums">
                    {row.count} <span className="font-normal text-muted">· %{pct}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-soft">
                  <div
                    className="h-full rounded-full bg-series"
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
