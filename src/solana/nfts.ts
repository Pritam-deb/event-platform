import { Metaplex, guestIdentity } from "@metaplex-foundation/js";
import type { Metadata, Nft, Sft } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

export type WalletNft = {
    mintAddress: string;
    name: string;
    image: string | null;
    collection: string | null;
    uri: string | null;
};

function safeString(value: unknown) {
    return typeof value === "string" ? value : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== "object") return null;
    return value as Record<string, unknown>;
}

function getNestedString(
    value: unknown,
    ...keys: string[]
): string | null {
    let current: unknown = value;
    for (const key of keys) {
        const rec = asRecord(current);
        if (!rec) return null;
        current = rec[key];
    }
    return safeString(current);
}

/**
 * Fetches a wallet's NFTs and resolves basic JSON metadata for display.
 * This is read-only and does not require signing.
 */
export async function fetchWalletNfts(
    connection: Connection,
    owner: PublicKey
): Promise<WalletNft[]> {
    const metaplex = Metaplex.make(connection).use(guestIdentity());

    const metas = await metaplex.nfts().findAllByOwner({ owner });
    const isMetadata = (value: Metadata | Nft | Sft): value is Metadata =>
        "mintAddress" in value;

    const results = await Promise.all(
        metas.map(async (meta) => {
            try {
                const nft = isMetadata(meta) ? await metaplex.nfts().load({ metadata: meta }) : meta;

                const json = nft.json;
                const name = safeString(getNestedString(json, "name") ?? nft.name) ?? "Untitled";
                const image = getNestedString(json, "image");
                const collection = getNestedString(json, "collection", "name");
                const uri = safeString(nft.uri) ?? null;

                return {
                    mintAddress: nft.address.toBase58(),
                    name,
                    image,
                    collection,
                    uri,
                } satisfies WalletNft;
            } catch {
                const rec = asRecord(meta);
                const mintValue =
                    rec?.mintAddress ?? rec?.mint ?? rec?.address ?? "unknown";
                const mintRec = asRecord(mintValue);
                const mint =
                    typeof mintValue === "string"
                        ? mintValue
                        : mintRec && typeof mintRec.toBase58 === "function"
                            ? String((mintRec.toBase58 as () => unknown)())
                            : "unknown";
                return {
                    mintAddress: String(mint),
                    name: "Unknown NFT",
                    image: null,
                    collection: null,
                    uri: null,
                } satisfies WalletNft;
            }
        })
    );

    return results;
}
