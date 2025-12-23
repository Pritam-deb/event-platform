"use client";

import { useCallback, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { createSolanaConnection } from "@/solana/rpc";
import { connectPhantomWallet, getPhantomProvider } from "@/solana/phantom";
import { fetchWalletNfts, WalletNft } from "@/solana/nfts";

type Status = "idle" | "connecting" | "loading" | "ready" | "error";

/**
 * Minimal wallet-connected NFT gallery for Solana devnet.
 */
export function NftGallery() {
  const connection = useMemo(() => createSolanaConnection(), []);
  const [status, setStatus] = useState<Status>("idle");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [items, setItems] = useState<WalletNft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasPhantom = useMemo(() => Boolean(getPhantomProvider()), []);

  const loadForOwner = useCallback(
    async (owner: PublicKey) => {
      setStatus("loading");
      setErrorMessage(null);
      try {
        const nfts = await fetchWalletNfts(connection, owner);
        setItems(nfts);
        setStatus("ready");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch NFTs";
        setErrorMessage(message);
        setStatus("error");
      }
    },
    [connection]
  );

  const handleConnect = useCallback(async () => {
    const provider = getPhantomProvider();
    if (!provider) {
      setErrorMessage("Phantom wallet not found. Please install Phantom.");
      setStatus("error");
      return;
    }

    setStatus("connecting");
    setErrorMessage(null);
    try {
      const { publicKey } = await connectPhantomWallet(provider);
      const address = publicKey.toBase58();
      setWalletAddress(address);
      await loadForOwner(publicKey);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Wallet connection failed";
      setErrorMessage(message);
      setStatus("error");
    }
  }, [loadForOwner]);

  const handleDisconnect = useCallback(async () => {
    const provider = getPhantomProvider();
    setItems([]);
    setWalletAddress(null);
    setStatus("idle");
    setErrorMessage(null);
    try {
      await provider?.disconnect?.();
    } catch {
      // no-op
    }
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold">Wallet NFTs (Devnet)</div>
          <div className="mt-1 text-xs text-white/55">
            Connect Phantom to fetch NFTs owned by your wallet.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {walletAddress ? (
            <>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                {walletAddress.slice(0, 4)}…{walletAddress.slice(-4)}
              </div>
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!hasPhantom || status === "connecting"}
              onClick={handleConnect}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500 disabled:opacity-60"
            >
              {hasPhantom
                ? status === "connecting"
                  ? "Connecting…"
                  : "Connect Phantom"
                : "Install Phantom"}
            </button>
          )}
        </div>
      </div>

      {status === "loading" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : null}

      {status === "error" && errorMessage ? (
        <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {errorMessage}
        </div>
      ) : null}

      {status === "ready" ? (
        items.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center">
            <div className="text-sm font-semibold text-white/80">
              No NFTs found
            </div>
            <div className="mt-2 text-xs text-white/45">
              This wallet doesn’t own any NFTs on devnet.
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((nft) => (
              <div
                key={nft.mintAddress}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 to-white/3 p-4 backdrop-blur"
              >
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {nft.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white/90">
                      {nft.name}
                    </div>
                    <div className="mt-1 truncate text-xs text-white/55">
                      Mint: {nft.mintAddress.slice(0, 4)}…
                      {nft.mintAddress.slice(-4)}
                    </div>
                    {nft.collection ? (
                      <div className="mt-1 truncate text-xs text-white/55">
                        Collection: {nft.collection}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : null}
    </section>
  );
}

