"use client";

import { useEvents } from "@/hooks/useEvents";
import { EventTable } from "@/components/events/EventTable";

export default function EventsPage() {
  const { data, isLoading, error } = useEvents();

  if (isLoading) {
    return <div className="p-8">Loading events...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Failed to load events</div>;
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Events</h1>
        <a
          href="/events/create"
          className="px-4 py-2 bg-black text-white rounded-md text-sm"
        >
          Create Event
        </a>
      </div>

      {data && <EventTable events={data} />}
    </main>
  );
}
