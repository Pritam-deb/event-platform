"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NftGallery } from "@/components/solana/NftGallery";

export default function NftsPage() {
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
              Event Management / <span className="text-white/90">NFTs</span>
            </div>
            <h1 className="mt-2 text-xl font-semibold">NFT Gallery</h1>
            <p className="mt-1 text-sm text-white/55">
              View NFTs owned by a connected Phantom wallet on Solana devnet.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Back to Events
          </Link>
        </header>

        <div className="mt-6">
          <NftGallery />
        </div>
      </div>
    </motion.main>
  );
}

