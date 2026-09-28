import type { LinkStatus } from "@/lib/link-status";

// Durum yalnızca renkle değil, yazıyla da belirtilir (renk körü kullanıcılar için)
const styles: Record<LinkStatus, { label: string; className: string }> = {
  active: {
    label: "Aktif",
    className: "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300",
  },
  inactive: {
    label: "Pasif",
    className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
  expired: {
    label: "Süresi doldu",
    className: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
};

export function LinkStatusBadge({ status, hideActive = false }: { status: LinkStatus; hideActive?: boolean }) {
  if (hideActive && status === "active") return null;
  const { label, className } = styles[status];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 font-sans text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
