"use client";

import { EventForm } from "@/components/events/EventForm";
import { useCreateEvent } from "@/hooks/useEventMutations";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";

export default function CreateEventPage() {
  const router = useRouter();
  const mutation = useCreateEvent();

  return (
    <AppShell>
      <AppHeader
        breadcrumb={
          <>
            Event Management / Events /{" "}
            <span className="text-white/90">Create Event</span>
          </>
        }
      />

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Create Event</h1>
            <p className="mt-1 text-sm text-white/55">
              Add details, schedule, and settings for a new event.
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
          <EventForm
            onSubmit={(data) =>
              mutation.mutate(data, {
                onSuccess: () => router.push("/events"),
              })
            }
            isSubmitting={mutation.isPending}
          />
        </div>
      </div>
    </AppShell>
  );
}
