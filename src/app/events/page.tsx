"use client";

import { useEvents } from "@/hooks/useEvents";
import { EventTable } from "@/components/events/EventTable";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

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

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconRefresh(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 12a9 9 0 00-15.5-6.4L3 8" />
      <path d="M3 4v4h4" />
      <path d="M3 12a9 9 0 0015.5 6.4L21 16" />
      <path d="M21 20v-4h-4" />
    </svg>
  );
}

function IconPlus(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconSettings(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
      <path d="M19.4 15a7.7 7.7 0 00.1-2l2-1.2-2-3.5-2.3.7a7.6 7.6 0 00-1.7-1l-.3-2.4H9l-.3 2.4c-.6.3-1.2.6-1.7 1l-2.3-.7-2 3.5 2 1.2a7.7 7.7 0 000 2l-2 1.2 2 3.5 2.3-.7c.5.4 1.1.7 1.7 1l.3 2.4h6l.3-2.4c.6-.3 1.2-.6 1.7-1l2.3.7 2-3.5-2-1.2z" />
    </svg>
  );
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    value
  );
}

export default function EventsPage() {
  const [now] = useState(() => Date.now());
  const [rangePreset, setRangePreset] = useState<
    "1D" | "7D" | "1M" | "3M" | "Custom"
  >("7D");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const toDateParam = (d: Date) => {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const start_date = (() => {
    if (rangePreset === "Custom") return customStartDate || undefined;
    const end = new Date(now);
    end.setUTCHours(0, 0, 0, 0);
    const days =
      rangePreset === "1D"
        ? 1
        : rangePreset === "7D"
        ? 7
        : rangePreset === "1M"
        ? 30
        : 90;
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));
    start.setUTCHours(0, 0, 0, 0);
    return toDateParam(start);
  })();

  const end_date = (() => {
    if (rangePreset === "Custom") return customEndDate || undefined;
    const end = new Date(now);
    end.setUTCHours(0, 0, 0, 0);
    return toDateParam(end);
  })();

  const offset = (page - 1) * limit;
  const { data, isLoading, error } = useEvents({
    limit,
    offset,
    start_date,
    end_date,
  });

  const events = data?.items ?? [];
  const totalCount = data?.meta?.totalCount ?? events.length;
  const totalEvents = totalCount > 0 ? totalCount : isLoading ? 1205 : 0;
  const upcomingEvents =
    events.length > 0
      ? events.filter((e) => e.eventStatus === "ACTIVE").length
      : isLoading
      ? 112
      : 0;
  const cancelledEvents =
    events.length > 0
      ? events.filter((e) => e.eventStatus === "CANCELLED").length
      : isLoading
      ? 104
      : 0;
  const ongoingEvents =
    events.length > 0
      ? events.filter((e) => {
          const start = new Date(e.startAt).getTime();
          const end = new Date(e.endAt).getTime();
          return now >= start && now <= end;
        }).length
      : isLoading
      ? 5
      : 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="min-h-screen bg-[#070B14] text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-10 left-10 h-[420px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[720px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/60">
            Event Management / <span className="text-white/90">Events</span>
          </div>

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
        </header>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-white/80">
              Event Overview
            </h2>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 text-xs text-white/70 backdrop-blur">
                {(["1D", "7D", "1M", "3M", "Custom"] as const).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setRangePreset(label);
                      setPage(1);
                    }}
                    className={[
                      "rounded-lg px-3 py-1.5 transition",
                      label === rangePreset
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/5",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 backdrop-blur hover:bg-white/10"
              >
                <IconSettings className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {rangePreset === "Custom" ? (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <div className="text-xs text-white/50">Start</div>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-white/50">End</div>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-5 backdrop-blur">
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/15 text-amber-300">
                  <span className="text-sm">▦</span>
                </div>
                Total events
              </div>
              <div className="mt-4 text-3xl font-semibold">
                {formatCompactNumber(totalEvents)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <span className="text-emerald-300">↑ 10%</span>
                From last week
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-5 backdrop-blur">
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/15 text-sky-300">
                  <span className="text-sm">◷</span>
                </div>
                Upcoming events
              </div>
              <div className="mt-4 text-3xl font-semibold">
                {formatCompactNumber(upcomingEvents)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <span className="text-emerald-300">↑ 12%</span>
                From last week
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-5 backdrop-blur">
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <span className="text-sm">●●</span>
                </div>
                Ongoing events
              </div>
              <div className="mt-4 text-3xl font-semibold">
                {formatCompactNumber(ongoingEvents)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <span className="text-rose-300">↓ 12%</span>
                From last week
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-5 backdrop-blur">
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-500/15 text-rose-300">
                  <span className="text-sm">×</span>
                </div>
                Cancelled events
              </div>
              <div className="mt-4 text-3xl font-semibold">
                {formatCompactNumber(cancelledEvents)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <span className="text-emerald-300">↓ 5%</span>
                From last week
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-baseline gap-2">
              <div className="text-sm font-semibold">Events</div>
              <div className="text-xs text-white/50">
                ({formatCompactNumber(totalEvents)})
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full max-w-[260px]">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  placeholder="Search by event, location"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/40 backdrop-blur focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur hover:bg-white/10"
              >
                Filter
                <IconChevronDown className="h-4 w-4 text-white/60" />
              </button>

              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80 backdrop-blur hover:bg-white/10"
              >
                <IconRefresh className="h-4.5 w-4.5" />
              </button>

              <Link
                href="/events/create"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500"
              >
                <IconPlus className="h-4 w-4" />
                Create Event
              </Link>
            </div>
          </div>

          <div className="mt-4">
            {error ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                Failed to load events
              </div>
            ) : isLoading ? (
              <div className="space-y-3">
                <div className="h-10 w-full rounded-xl bg-white/5" />
                <div className="h-10 w-full rounded-xl bg-white/5" />
                <div className="h-10 w-full rounded-xl bg-white/5" />
                <div className="h-10 w-full rounded-xl bg-white/5" />
                <div className="h-10 w-full rounded-xl bg-white/5" />
              </div>
            ) : (
              <EventTable events={events} />
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
              >
                ‹
              </button>
              <div className="flex items-center gap-1">
                {(() => {
                  const start = Math.max(
                    1,
                    Math.min(currentPage - 2, totalPages - 4)
                  );
                  const end = Math.min(totalPages, start + 4);
                  const pages = [];
                  for (let p = start; p <= end; p += 1) pages.push(p);
                  return pages;
                })().map((p) => (
                  <button
                    key={String(p)}
                    type="button"
                    onClick={() => setPage(p)}
                    className={[
                      "grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10",
                      p === currentPage ? "bg-sky-600/30 text-white" : "",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
}
