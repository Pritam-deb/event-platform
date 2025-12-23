import { clusterApiUrl, Connection } from "@solana/web3.js";

/**
 * Returns the Solana RPC URL to use.
 * Defaults to Solana devnet if `NEXT_PUBLIC_SOLANA_RPC_URL` is not set.
 */
export function getSolanaRpcUrl() {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet");
}

/**
 * Creates a Solana `Connection` configured for typical web apps.
 */
export function createSolanaConnection() {
  return new Connection(getSolanaRpcUrl(), {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60_000,
  });
}

