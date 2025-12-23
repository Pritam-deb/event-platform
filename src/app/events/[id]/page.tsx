"use client";

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/useEventById";
import { useDeleteEvent } from "@/hooks/useEventMutations";
import { motion } from "framer-motion";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";

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

function IconCalendar(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconTag(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-7.2-7.2V3h10.2l7 7a2 2 0 010 2.8z" />
      <path d="M7.5 7.5h.01" />
    </svg>
  );
}

function IconPin(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 21s-7-4.4-7-11a7 7 0 1114 0c0 6.6-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconEdit(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function IconTrash(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function IconBan(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 7.5l9 9" />
    </svg>
  );
}

function IconDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

function initialsFromTitle(title: string) {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "E";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (first + second).toUpperCase();
}

function formatRange(startAt: Date, endAt: Date) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const startLabel = start.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const endLabel = end.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${startLabel} - ${endLabel} (GMT-6 Central Time)`;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useEventById(id);
  const deleteMutation = useDeleteEvent();

  const placeholder = {
    title: "Gastonia Ghost Peppers vs. Charleston Dirty Birds",
    description:
      "The Gastonia Ghost Peppers are a professional baseball team based in Gastonia, NC, bringing exciting games and a passionate fan experience to the local community.",
    location: "First Horizon Park, Jr Gilliam Wy, Nashville, TN",
    eventTag: "Sports, Baseball",
    eventStatus: "DRAFT" as const,
    ticketSold: 2000,
    eventRevenue: "87120",
    eventAttendees: 1398,
    startAt: new Date("2025-07-26T18:00:00.000Z"),
    endAt: new Date("2025-07-30T18:00:00.000Z"),
  };

  const event = data ?? placeholder;
  const status =
    (data?.eventStatus as
      | "DRAFT"
      | "ACTIVE"
      | "COMPLETED"
      | "CANCELLED") ?? placeholder.eventStatus;

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
            Event Management / Events /{" "}
            <span className="text-white/90">Event Details</span>
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

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-700/40 via-slate-900/30 to-slate-800/40">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />
              <div className="h-[190px] w-full" />
            </div>

            {isLoading ? (
              <div className="mt-5 space-y-3">
                <div className="h-7 w-2/3 rounded-lg bg-white/5" />
                <div className="h-4 w-full rounded-lg bg-white/5" />
                <div className="h-4 w-11/12 rounded-lg bg-white/5" />
              </div>
            ) : error && !data ? (
              <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                Event not found
              </div>
            ) : (
              <>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="-mt-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-white/20 to-white/5 text-lg font-semibold text-white/90 shadow-xl shadow-black/30">
                      {initialsFromTitle(event.title || "Event")}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="max-w-[520px] text-2xl font-semibold leading-tight">
                          {event.title || "Untitled event"}
                        </h1>
                        <EventStatusBadge status={status} />
                      </div>
                      <p className="mt-2 max-w-[620px] text-sm text-white/55">
                        {event.description || placeholder.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/70">
                    <button
                      type="button"
                      onClick={() => router.push(`/events/${id}/edit`)}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10"
                    >
                      <IconEdit className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10"
                    >
                      <IconBan className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmed = confirm(
                          "Are you sure you want to delete this event?"
                        );
                        if (!confirmed) return;
                        deleteMutation.mutate(id, {
                          onSuccess: () => router.push("/events"),
                        });
                      }}
                      disabled={deleteMutation.isPending}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 disabled:opacity-60"
                    >
                      <IconTrash className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10"
                    >
                      <IconDots className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
                  <div className="space-y-3 text-sm text-white/65">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300">
                        <IconCalendar className="h-4.5 w-4.5" />
                      </div>
                      <div>{formatRange(event.startAt, event.endAt)}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300">
                        <IconTag className="h-4.5 w-4.5" />
                      </div>
                      <div>{event.eventTag || placeholder.eventTag}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300">
                        <IconPin className="h-4.5 w-4.5" />
                      </div>
                      <div>{event.location || placeholder.location}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs text-white/45">Policy</div>
                      <div className="mt-1 text-sm font-medium text-white/80">
                        Gastonia Ghost Peppers Policy
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs text-white/45">Organizer</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 text-[11px] font-semibold text-white/90">
                          GG
                        </div>
                        <div className="text-sm font-medium text-white/80">
                          Gastonia Ghost Peppers
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-sm font-semibold">Event Summary</div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-4 text-center">
                <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-sky-500/15 text-sky-300">
                  <span className="text-sm">▦</span>
                </div>
                <div className="mt-3 text-xs text-white/50">
                  Total Tickets Sold
                </div>
                <div className="mt-1 text-xl font-semibold">
                  {(Number(event.ticketSold ?? 0) || 0).toLocaleString()}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-4 text-center">
                <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <span className="text-sm">$</span>
                </div>
                <div className="mt-3 text-xs text-white/50">Total Revenue</div>
                <div className="mt-1 text-xl font-semibold">
                  $
                  {Number(event.eventRevenue ?? 0).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-4 text-center">
                <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-sky-500/15 text-sky-300">
                  <span className="text-sm">👥</span>
                </div>
                <div className="mt-3 text-xs text-white/50">
                  Unique Attendees
                </div>
                <div className="mt-1 text-xl font-semibold">
                  {(Number(event.eventAttendees ?? 0) || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-white/50">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
              >
                ‹
              </button>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
              >
                ›
              </button>
            </div>
          </aside>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Teams</span>
              <button type="button" className="text-white/60 hover:text-white">
                See all
              </button>
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {["Gastonia Ghost Peppers", "Charleston Dirty Birds"].map((name) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 text-xs font-semibold text-white/90">
                    {initialsFromTitle(name)}
                  </div>
                  <div className="text-white/80">{name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="text-xs text-white/50">Tags</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: "Fire Works (2)", tone: "bg-rose-500/10 text-rose-200 border-rose-500/20" },
                { label: "High Spender", tone: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20" },
                { label: "Music Lover", tone: "bg-violet-500/10 text-violet-200 border-violet-500/20" },
                { label: "Loyal", tone: "bg-amber-500/10 text-amber-200 border-amber-500/20" },
                { label: "VIP", tone: "bg-sky-500/10 text-sky-200 border-sky-500/20" },
                { label: "Sports", tone: "bg-slate-500/10 text-slate-200 border-slate-500/20" },
                { label: "Frequent Buyer", tone: "bg-stone-500/10 text-stone-200 border-stone-500/20" },
                { label: "Phone Verified", tone: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20" },
                { label: "Promo Code", tone: "bg-fuchsia-500/10 text-fuchsia-200 border-fuchsia-500/20" },
              ].map((t) => (
                <span
                  key={t.label}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${t.tone}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 text-xs text-white/60">
            {[
              "Ticket Collections",
              "Ticket Categories",
              "Attendee List",
              "Promotions / Discounts",
              "Seat chart",
            ].map((label, idx) => (
              <button
                key={label}
                type="button"
                className={[
                  "rounded-xl px-3 py-2 transition",
                  idx === 0 ? "bg-white/10 text-white" : "hover:bg-white/5",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Ticket Collection</div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500"
            >
              + Attach Collection
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <div className="text-sm font-semibold text-white/80">
              No Ticket Collection Attached
            </div>
            <div className="mt-2 text-xs text-white/45">
              Attach a ticket collection to enable publishing and sales.
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
}
