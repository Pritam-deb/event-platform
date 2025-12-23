import { describe, expect, it, vi } from "vitest";
import { PublicKey } from "@solana/web3.js";

const findAllByOwner = vi.fn();
const load = vi.fn();

vi.mock("@metaplex-foundation/js", () => {
  const metaplexApi = {
    use: vi.fn(() => metaplexApi),
    nfts: () => ({
      findAllByOwner,
      load,
    }),
  };

  return {
    Metaplex: {
      make: vi.fn(() => metaplexApi),
    },
    guestIdentity: vi.fn(() => ({})),
  };
});

describe("solana/nfts", () => {
  it("fetchWalletNfts maps loaded NFTs to WalletNft shape", async () => {
    const { fetchWalletNfts } = await import("./nfts");

    const owner = new PublicKey("11111111111111111111111111111111");
    const mint = new PublicKey("So11111111111111111111111111111111111111112");

    findAllByOwner.mockResolvedValueOnce([{ mintAddress: mint }]);
    load.mockResolvedValueOnce({
      address: mint,
      name: "Fallback Name",
      uri: "https://example.com/meta.json",
      json: {
        name: "Event Pass #1",
        image: "https://example.com/image.png",
        collection: { name: "Event Collection" },
      },
    });

    const results = await fetchWalletNfts({} as never, owner);
    expect(results).toEqual([
      {
        mintAddress: mint.toBase58(),
        name: "Event Pass #1",
        image: "https://example.com/image.png",
        collection: "Event Collection",
        uri: "https://example.com/meta.json",
      },
    ]);
  });

  it("fetchWalletNfts falls back when JSON metadata is malformed", async () => {
    const { fetchWalletNfts } = await import("./nfts");

    const owner = new PublicKey("11111111111111111111111111111111");
    const mint = new PublicKey("So11111111111111111111111111111111111111112");

    findAllByOwner.mockResolvedValueOnce([{ mintAddress: mint }]);
    load.mockResolvedValueOnce({
      address: mint,
      name: "Fallback Name",
      uri: "https://example.com/meta.json",
      json: { name: 123 },
    });

    const results = await fetchWalletNfts({} as never, owner);
    expect(results[0]?.name).toBe("Fallback Name");
    expect(results[0]?.image).toBeNull();
    expect(results[0]?.collection).toBeNull();
  });

  it("fetchWalletNfts returns placeholder when load fails", async () => {
    const { fetchWalletNfts } = await import("./nfts");

    const owner = new PublicKey("11111111111111111111111111111111");
    const mint = new PublicKey("So11111111111111111111111111111111111111112");

    findAllByOwner.mockResolvedValueOnce([{ mintAddress: mint }]);
    load.mockRejectedValueOnce(new Error("failed to load"));

    const results = await fetchWalletNfts({} as never, owner);
    expect(results).toEqual([
      {
        mintAddress: mint.toBase58(),
        name: "Unknown NFT",
        image: null,
        collection: null,
        uri: null,
      },
    ]);
  });
});

