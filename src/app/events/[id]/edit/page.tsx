"use client";

import { useParams, useRouter } from "next/navigation";
import { EventForm } from "@/components/events/EventForm";
import { useEventById } from "@/hooks/useEventById";
import { useUpdateEvent } from "@/hooks/useEventMutations";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useEventById(id);
  const mutation = useUpdateEvent(id);

  if (isLoading || !data) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold mb-4">Edit Event</h1>

      <EventForm
        initialData={data}
        onSubmit={(form) =>
          mutation.mutate(form, {
            onSuccess: () => router.push("/events"),
          })
        }
        isSubmitting={mutation.isPending}
      />
    </main>
  );
}
