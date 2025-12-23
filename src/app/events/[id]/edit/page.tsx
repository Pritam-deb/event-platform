"use client";

import { useParams, useRouter } from "next/navigation";
import { EventForm } from "@/components/events/EventForm";
import { useEventById } from "@/hooks/useEventById";
import { useUpdateEvent } from "@/hooks/useEventMutations";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useEventById(id);
  const mutation = useUpdateEvent(id);

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
            <span className="text-white/90">Edit Event</span>
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

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Edit Event</h1>
              <p className="mt-1 text-sm text-white/55">
                Update details, schedule, and settings for this event.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Cancel
            </Link>
          </div>

          <div className="mt-5">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-10 w-full rounded-xl bg-white/5" />
                <div className="h-10 w-full rounded-xl bg-white/5" />
                <div className="h-28 w-full rounded-xl bg-white/5" />
                <div className="h-10 w-full rounded-xl bg-white/5" />
              </div>
            ) : !data ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                Event not found
              </div>
            ) : (
              <EventForm
                initialData={data}
                onSubmit={(form) =>
                  mutation.mutate(form, {
                    onSuccess: () => router.push("/events"),
                  })
                }
                isSubmitting={mutation.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </motion.main>
  );
}
