import { PublicKey } from "@solana/web3.js";

type PhantomEvent = "connect" | "disconnect" | "accountChanged";

export type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: PublicKey;
  isConnected?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: PublicKey;
  }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: unknown) => void) => void;
  removeListener: (
    event: PhantomEvent,
    handler: (args: unknown) => void
  ) => void;
};

/**
 * Returns the Phantom provider injected into `window`, if available.
 */
export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const anyWindow = window as unknown as { solana?: PhantomProvider };
  if (!anyWindow.solana?.isPhantom) return null;
  return anyWindow.solana;
}

/**
 * Attempts a trusted connection first (no prompt). Falls back to interactive connect.
 */
export async function connectPhantomWallet(provider: PhantomProvider) {
  try {
    return await provider.connect({ onlyIfTrusted: true });
  } catch {
    return provider.connect();
  }
}

