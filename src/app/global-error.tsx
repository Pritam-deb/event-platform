"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="min-h-screen bg-[#070B14] text-white"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute top-10 left-10 h-[420px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[520px] w-[720px] rounded-full bg-violet-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-sm text-white/60">
                  Event Management /{" "}
                  <span className="text-white/90">Application Error</span>
                </div>
                <h1 className="mt-2 text-xl font-semibold">
                  Application encountered an error
                </h1>
                <p className="mt-1 text-sm text-white/55">
                  Try reloading this view, or return to the home page.
                </p>
              </div>

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
              </div>
            </header>

            <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-semibold text-white/90">Details</div>
              <div className="mt-2 break-words rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                {error.message || "Unknown error"}
              </div>
            </section>
          </div>
        </motion.main>
      </body>
    </html>
  );
}

