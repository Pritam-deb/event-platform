"use client";

import { useState } from "react";
import { Event } from "@/types/event";

type Props = {
  initialData?: Partial<Event>;
  onSubmit: (data: Partial<Event>) => void;
  isSubmitting: boolean;
};

export function EventForm({ initialData = {}, onSubmit, isSubmitting }: Props) {
  const [form, setForm] = useState<Partial<Event>>({
    title: "",
    location: "",
    eventStatus: "DRAFT",
    eventType: "OFFLINE",
    description: "",
    totalTickets: 0,
    startAt: new Date(),
    endAt: new Date(),
    isPublished: false,
    ...initialData,
  });

  const updateField = (key: keyof Event, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 max-w-xl"
    >
      <input
        className="w-full border p-2 rounded"
        placeholder="Event title"
        value={form.title ?? ""}
        onChange={(e) => updateField("title", e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Event description"
        value={form.description ?? ""}
        onChange={(e) => updateField("description", e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Location"
        value={form.location ?? ""}
        onChange={(e) => updateField("location", e.target.value)}
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Total Tickets"
        value={form.totalTickets ?? 0}
        onChange={(e) =>
          updateField("totalTickets", parseInt(e.target.value) || 0)
        }
      />

      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Tags"
        value={form.eventTag ?? ""}
        onChange={(e) => updateField("eventTag", e.target.value)}
      />

      {/* // event start date and end date inputs can be added here */}
      <input
        type="datetime-local"
        className="w-full border p-2 rounded"
        value={
          form.startAt ? new Date(form.startAt).toISOString().slice(0, 16) : ""
        }
        onChange={(e) => updateField("startAt", new Date(e.target.value))}
      />
      <input
        type="datetime-local"
        className="w-full border p-2 rounded"
        value={
          form.endAt ? new Date(form.endAt).toISOString().slice(0, 16) : ""
        }
        onChange={(e) => updateField("endAt", new Date(e.target.value))}
      />

      <select
        className="w-full border p-2 rounded"
        value={form.eventStatus}
        onChange={(e) => updateField("eventStatus", e.target.value)}
      >
        <option value="DRAFT">Draft</option>
        <option value="ACTIVE">Active</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <select
        className="w-full border p-2 rounded"
        value={form.eventType}
        onChange={(e) => updateField("eventType", e.target.value)}
      >
        <option value="ONLINE">Online</option>
        <option value="OFFLINE">Offline</option>
      </select>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {isSubmitting ? "Saving..." : "Save Event"}
      </button>
    </form>
  );
}
