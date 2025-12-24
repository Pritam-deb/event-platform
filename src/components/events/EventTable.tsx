"use client";

import { Event } from "@/types/event";
import { EventStatusBadge } from "./EventStatusBadge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function initialsFromTitle(title: string) {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "E";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (first + second).toUpperCase();
}

function formatDateTime(value: Event["startAt"]) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function IconDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}
type Props = {
  events: Event[];
};

export function EventTable({ events }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="text-left text-xs text-white/50">
          <tr>
            <th className="px-4 py-3 font-medium">Event Name</th>
            <th className="px-4 py-3 font-medium">Date &amp; Time</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium text-right">Tickets Sold</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <motion.tr
              key={event.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => router.push(`/events/${event.id}`)}
              className="cursor-pointer border-t border-white/10 text-sm text-white/85 transition hover:bg-white/5"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 text-xs font-semibold text-white/90">
                    {initialsFromTitle(event.title || "Event")}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-white/90">
                      {event.title || "Untitled event"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-white/70">
                {formatDateTime(event.startAt)}
              </td>
              <td className="px-4 py-3 text-white/70">
                {event.location ?? "—"}
              </td>
              <td className="px-4 py-3 text-right text-white/80">
                {(event.ticketSold ?? 0).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <EventStatusBadge status={event.eventStatus} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                >
                  <IconDots className="h-4 w-4" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
