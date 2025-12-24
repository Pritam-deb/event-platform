"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void error;
  }, [error]);

  return (
    <AppShell>
      <AppHeader
        breadcrumb={
          <>
            Event Management / <span className="text-white/90">Error</span>
          </>
        }
        right={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500"
            >
              Retry
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Events
            </Link>
          </div>
        }
      />

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-white/55">
            Please try again. If the problem persists, return to the dashboard.
          </p>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold text-white/90">Details</div>
          <div className="mt-2 break-words rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            {error.message || "Unknown error"}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
