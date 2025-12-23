import clsx from "clsx";

type Props = {
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
};

export function EventStatusBadge({ status }: Props) {
  const label =
    {
      DRAFT: "Draft",
      ACTIVE: "Upcoming",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    }[status] ?? status;

  const dotClass =
    {
      DRAFT: "bg-slate-400",
      ACTIVE: "bg-emerald-400",
      COMPLETED: "bg-sky-400",
      CANCELLED: "bg-rose-400",
    }[status] ?? "bg-slate-400";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
        {
          DRAFT: "bg-white/5 text-white/80 border-white/10",
          ACTIVE: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
          COMPLETED: "bg-sky-500/10 text-sky-200 border-sky-500/20",
          CANCELLED: "bg-rose-500/10 text-rose-200 border-rose-500/20",
        }[status]
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", dotClass)} />
      {label}
    </span>
  );
}
