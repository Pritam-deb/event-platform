"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";

export default function NotFound() {
  return (
    <AppShell>
      <AppHeader
        breadcrumb={
          <>
            Event Management /{" "}
            <span className="text-white/90">Not Found</span>
          </>
        }
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500"
            >
              Events
            </Link>
          </div>
        }
      />

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Page not found</h1>
          <p className="text-sm text-white/55">
            The page you’re looking for doesn’t exist or was moved.
          </p>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold text-white/90">
            Error code: 404
          </div>
          <div className="mt-2 text-sm text-white/55">
            Check the URL, or use one of the shortcuts above.
          </div>
        </div>
      </section>
    </AppShell>
  );
}
