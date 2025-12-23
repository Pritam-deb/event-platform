"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
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
      </div>
    </motion.main>
  );
}
