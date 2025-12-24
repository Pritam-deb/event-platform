"use client";

import { useParams, useRouter } from "next/navigation";
import { EventForm } from "@/components/events/EventForm";
import { useEventById } from "@/hooks/useEventById";
import { useUpdateEvent } from "@/hooks/useEventMutations";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useEventById(id);
  const mutation = useUpdateEvent(id);

  return (
    <AppShell>
      <AppHeader
        breadcrumb={
          <>
            Event Management / Events /{" "}
            <span className="text-white/90">Edit Event</span>
          </>
        }
      />

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Edit Event</h1>
            <p className="mt-1 text-sm text-white/55">
              Update details, schedule, and settings for this event.
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
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-10 w-full rounded-xl bg-white/5" />
              <div className="h-10 w-full rounded-xl bg-white/5" />
              <div className="h-28 w-full rounded-xl bg-white/5" />
              <div className="h-10 w-full rounded-xl bg-white/5" />
            </div>
          ) : !data ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
              Event not found
            </div>
          ) : (
            <EventForm
              initialData={data}
              onSubmit={(form) =>
                mutation.mutate(form, {
                  onSuccess: () => router.push("/events"),
                })
              }
              isSubmitting={mutation.isPending}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
