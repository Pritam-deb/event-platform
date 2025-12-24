"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  return (
    <AppShell>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-white/60">
              Event Management / <span className="text-white/90">Home</span>
            </div>
            <h1 className="mt-2 text-xl font-semibold">Event Platform</h1>
            <p className="mt-1 text-sm text-white/55">
              Jump into event management or view wallet NFTs on Solana devnet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Events
            </Link>
            <Link
              href="/nfts"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500"
            >
              NFTs
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/events"
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/7"
          >
            <div className="text-sm font-semibold text-white/90">
              Manage Events
            </div>
            <div className="mt-2 text-sm text-white/55">
              Browse, create, edit, and delete events with pagination and date
              filtering.
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 group-hover:text-sky-100">
              Open Events
              <span aria-hidden="true">→</span>
            </div>
          </Link>

          <Link
            href="/nfts"
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/7"
          >
            <div className="text-sm font-semibold text-white/90">
              Wallet NFT Gallery
            </div>
            <div className="mt-2 text-sm text-white/55">
              Connect Phantom and view NFTs owned by your wallet on Solana
              devnet.
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 group-hover:text-sky-100">
              Open NFTs
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        </section>
    </AppShell>
  );
}
