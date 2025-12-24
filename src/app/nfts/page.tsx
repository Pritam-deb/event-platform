"use client";

import Link from "next/link";
import { NftGallery } from "@/components/solana/NftGallery";
import { AppShell } from "@/components/layout/AppShell";

export default function NftsPage() {
  return (
    <AppShell>
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
    </AppShell>
  );
}
