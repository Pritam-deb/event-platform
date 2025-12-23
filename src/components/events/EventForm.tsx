"use client";

import { useState } from "react";
import { Event } from "@/types/event";
import clsx from "clsx";
import { createEventSchema } from "@/validators/event.schema";

type Props = {
  initialData?: Partial<Event>;
  onSubmit: (data: Partial<Event>) => void;
  isSubmitting: boolean;
};

function toDatetimeLocalValue(value: unknown) {
  if (!value) return "";
  const d = new Date(value as never);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function Spinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (key: keyof Event, value: unknown) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const inputBase =
    "w-full rounded-xl border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 backdrop-blur focus:outline-none focus:ring-2";

  const labelBase = "text-xs font-medium text-white/60";

  const errorTextBase = "mt-1 text-xs text-rose-200";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const result = createEventSchema.safeParse({
          title: form.title ?? "",
          description: form.description ?? undefined,
          location: form.location ?? undefined,
          totalTickets: Number(form.totalTickets ?? 0),
          eventStatus: form.eventStatus,
          eventType: form.eventType,
          eventTag: form.eventTag ?? undefined,
          startAt: form.startAt ?? "",
          endAt: form.endAt ?? "",
          isPublished: Boolean(form.isPublished),
        });

        if (!result.success) {
          const next: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const key = String(issue.path[0] ?? "form");
            if (!next[key]) next[key] = issue.message;
          }
          setErrors(next);
          return;
        }

        setErrors({});
        onSubmit(form);
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className={labelBase}>
            Event name
          </label>
          <input
            id="title"
            className={clsx(
              inputBase,
              errors.title
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            placeholder="Enter event title"
            value={form.title ?? ""}
            onChange={(e) => updateField("title", e.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <div id="title-error" role="alert" className={errorTextBase}>
              {errors.title}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className={labelBase}>
            Location
          </label>
          <input
            id="location"
            className={clsx(
              inputBase,
              errors.location
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            placeholder="Enter location"
            value={form.location ?? ""}
            onChange={(e) => updateField("location", e.target.value)}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          {errors.location && (
            <div id="location-error" role="alert" className={errorTextBase}>
              {errors.location}
            </div>
          )}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label htmlFor="description" className={labelBase}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className={clsx(
              inputBase,
              "resize-none py-2.5",
              errors.description
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            placeholder="Write a short description"
            value={form.description ?? ""}
            onChange={(e) => updateField("description", e.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <div id="description-error" role="alert" className={errorTextBase}>
              {errors.description}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="totalTickets" className={labelBase}>
            Total tickets
          </label>
          <input
            id="totalTickets"
            type="number"
            min={0}
            className={clsx(
              inputBase,
              errors.totalTickets
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            placeholder="0"
            value={form.totalTickets ?? 0}
            onChange={(e) =>
              updateField("totalTickets", parseInt(e.target.value, 10) || 0)
            }
            aria-invalid={Boolean(errors.totalTickets)}
            aria-describedby={errors.totalTickets ? "totalTickets-error" : undefined}
          />
          {errors.totalTickets && (
            <div id="totalTickets-error" role="alert" className={errorTextBase}>
              {errors.totalTickets}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="eventTag" className={labelBase}>
            Tags
          </label>
          <input
            id="eventTag"
            type="text"
            className={clsx(
              inputBase,
              errors.eventTag
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            placeholder="e.g. Sports, Music"
            value={form.eventTag ?? ""}
            onChange={(e) => updateField("eventTag", e.target.value)}
            aria-invalid={Boolean(errors.eventTag)}
            aria-describedby={errors.eventTag ? "eventTag-error" : undefined}
          />
          {errors.eventTag && (
            <div id="eventTag-error" role="alert" className={errorTextBase}>
              {errors.eventTag}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="startAt" className={labelBase}>
            Start date &amp; time
          </label>
          <input
            id="startAt"
            type="datetime-local"
            className={clsx(
              inputBase,
              errors.startAt
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            value={toDatetimeLocalValue(form.startAt)}
            onChange={(e) => updateField("startAt", e.target.value)}
            aria-invalid={Boolean(errors.startAt)}
            aria-describedby={errors.startAt ? "startAt-error" : undefined}
          />
          {errors.startAt && (
            <div id="startAt-error" role="alert" className={errorTextBase}>
              {errors.startAt}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="endAt" className={labelBase}>
            End date &amp; time
          </label>
          <input
            id="endAt"
            type="datetime-local"
            className={clsx(
              inputBase,
              errors.endAt
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            value={toDatetimeLocalValue(form.endAt)}
            onChange={(e) => updateField("endAt", e.target.value)}
            aria-invalid={Boolean(errors.endAt)}
            aria-describedby={errors.endAt ? "endAt-error" : undefined}
          />
          {errors.endAt && (
            <div id="endAt-error" role="alert" className={errorTextBase}>
              {errors.endAt}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="eventStatus" className={labelBase}>
            Status
          </label>
          <select
            id="eventStatus"
            className={clsx(
              inputBase,
              "appearance-none",
              errors.eventStatus
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            value={form.eventStatus}
            onChange={(e) => updateField("eventStatus", e.target.value)}
            aria-invalid={Boolean(errors.eventStatus)}
            aria-describedby={errors.eventStatus ? "eventStatus-error" : undefined}
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          {errors.eventStatus && (
            <div id="eventStatus-error" role="alert" className={errorTextBase}>
              {errors.eventStatus}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="eventType" className={labelBase}>
            Type
          </label>
          <select
            id="eventType"
            className={clsx(
              inputBase,
              "appearance-none",
              errors.eventType
                ? "border-rose-500/30 focus:ring-rose-500/30"
                : "border-white/10 focus:ring-sky-500/40"
            )}
            value={form.eventType}
            onChange={(e) => updateField("eventType", e.target.value)}
            aria-invalid={Boolean(errors.eventType)}
            aria-describedby={errors.eventType ? "eventType-error" : undefined}
          >
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
          {errors.eventType && (
            <div id="eventType-error" role="alert" className={errorTextBase}>
              {errors.eventType}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 lg:col-span-2">
          <div>
            <div className="text-sm font-medium text-white/85">Published</div>
            <div className="text-xs text-white/45">
              Make this event visible to attendees.
            </div>
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.isPublished)}
              onChange={(e) => updateField("isPublished", e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/10 text-sky-500 focus:ring-sky-500/40"
            />
            <span className="sr-only">Published</span>
          </label>
        </div>
      </div>

      {errors.form && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {errors.form}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500 disabled:opacity-60"
        >
          {isSubmitting && <Spinner className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Event"}
        </button>
      </div>
    </form>
  );
}
