"use client";

import { useEvents } from "@/hooks/useEvents";
import { EventTable } from "@/components/events/EventTable";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EventsPage() {
  const { data, isLoading, error } = useEvents();

  if (isLoading) {
    return <div className="p-8">Loading events...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Failed to load events</div>;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Events</h1>
        <Link
          href="/events/create"
          className="px-4 py-2 bg-black text-white rounded-md text-sm"
        >
          Create Event
        </Link>
      </div>

      {data && <EventTable events={data} />}
    </motion.main>
  );
}
