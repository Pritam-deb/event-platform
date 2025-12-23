"use client";

import { Event } from "@/types/event";
import { EventStatusBadge } from "./EventStatusBadge";
import { motion } from "framer-motion";

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
              className="border-t"
            >
              <td className="px-4 py-2 font-medium">{event.title}</td>
              <td className="px-4 py-2">
                {new Date(event.startAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{event.location ?? "—"}</td>
              <td className="px-4 py-2">
                <EventStatusBadge status={event.eventStatus} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
