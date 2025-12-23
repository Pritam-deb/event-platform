"use client";

import { EventForm } from "@/components/events/EventForm";
import { useCreateEvent } from "@/hooks/useEventMutations";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const mutation = useCreateEvent();

  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold mb-4">Create Event</h1>

      <EventForm
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: () => router.push("/events"),
          })
        }
        isSubmitting={mutation.isPending}
      />
    </main>
  );
}
