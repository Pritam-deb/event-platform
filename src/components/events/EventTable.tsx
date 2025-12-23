"use client";

import { Event } from "@/types/event";
import { EventStatusBadge } from "./EventStatusBadge";
import { motion } from "framer-motion";
import Link from "next/link";
type Props = {
  events: Event[];
};

export function EventTable({ events }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm">Event</th>
            <th className="px-4 py-2 text-left text-sm">Date</th>
            <th className="px-4 py-2 text-left text-sm">Location</th>
            <th className="px-4 py-2 text-left text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <motion.tr
              key={event.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="border-t hover:bg-gray-50 transition cursor-pointer"
            >
              <td className="px-4 py-2 font-medium">
                <Link href={`/events/${event.id}`} className="block">
                  {event.title}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link href={`/events/${event.id}`} className="block">
                  {new Date(event.startAt).toLocaleDateString()}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link href={`/events/${event.id}`} className="block">
                  {event.location ?? "—"}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link href={`/events/${event.id}`} className="block">
                  <EventStatusBadge status={event.eventStatus} />
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
