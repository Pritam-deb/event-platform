"use client";

import clsx from "clsx";

type Props = {
  breadcrumb: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function IconBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </svg>
  );
}

function DefaultRight() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full max-w-[320px]">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <input
          placeholder="Search for anything"
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/40 backdrop-blur focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
      </div>

      <button
        type="button"
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80 backdrop-blur hover:bg-white/10"
      >
        <IconBell className="h-4.5 w-4.5" />
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sky-500 px-1 text-[10px] font-semibold text-white">
          4
        </span>
      </button>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 text-xs font-semibold text-white/90">
          HC
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Hailey Carter</div>
          <div className="text-xs text-white/50">Master Admin</div>
        </div>
      </div>
    </div>
  );
}

export function AppHeader({ breadcrumb, right, className }: Props) {
  return (
    <header
      className={clsx(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="text-sm text-white/60">{breadcrumb}</div>
      {right ?? <DefaultRight />}
    </header>
  );
}
