"use client";

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/useEventById";
import { useDeleteEvent } from "@/hooks/useEventMutations";
import { motion } from "framer-motion";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useEventById(id);
  const deleteMutation = useDeleteEvent();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error || !data) {
    return <div className="p-8">Event not found</div>;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="p-8 space-y-4 max-w-2xl"
    >
      <h1 className="text-2xl font-semibold">{data.title}</h1>

      {data.description && <p className="text-gray-700">{data.description}</p>}

      <div className="text-sm text-gray-500 space-y-1">
        <p>Location: {data.location || "—"}</p>
        <p>Status: {data.eventStatus}</p>
        <p>Type: {data.eventType}</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => router.push(`/events/${id}/edit`)}
          className="px-4 py-2 border rounded"
        >
          Edit
        </button>

        <button
          disabled={deleteMutation.isPending}
          onClick={() => {
            const confirmed = confirm(
              "Are you sure you want to delete this event?"
            );

            if (!confirmed) return;

            deleteMutation.mutate(id, {
              onSuccess: () => router.push("/events"),
            });
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </motion.main>
  );
}
