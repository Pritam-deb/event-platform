import { describe, expect, it, vi } from "vitest";
import { PublicKey } from "@solana/web3.js";
import { connectPhantomWallet, getPhantomProvider } from "./phantom";

describe("solana/phantom", () => {
  it("getPhantomProvider returns null when window is undefined", () => {
    expect(getPhantomProvider()).toBeNull();
  });

  it("getPhantomProvider returns null when Phantom is not installed", () => {
    vi.stubGlobal("window", {} as unknown as Window);
    expect(getPhantomProvider()).toBeNull();
    vi.unstubAllGlobals();
  });

  it("getPhantomProvider returns provider when isPhantom is true", () => {
    const provider = {
      isPhantom: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    vi.stubGlobal("window", { solana: provider } as unknown as Window);
    expect(getPhantomProvider()).toBe(provider);
    vi.unstubAllGlobals();
  });

  it("connectPhantomWallet uses trusted connect when available", async () => {
    const publicKey = new PublicKey("11111111111111111111111111111111");
    const provider = {
      connect: vi.fn().mockResolvedValue({ publicKey }),
      disconnect: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    const result = await connectPhantomWallet(provider);
    expect(result.publicKey.toBase58()).toBe(publicKey.toBase58());
    expect(provider.connect).toHaveBeenCalledTimes(1);
    expect(provider.connect).toHaveBeenCalledWith({ onlyIfTrusted: true });
  });

  it("connectPhantomWallet falls back to interactive connect", async () => {
    const publicKey = new PublicKey("11111111111111111111111111111111");
    const provider = {
      connect: vi
        .fn()
        .mockRejectedValueOnce(new Error("not trusted"))
        .mockResolvedValueOnce({ publicKey }),
      disconnect: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    const result = await connectPhantomWallet(provider);
    expect(result.publicKey.toBase58()).toBe(publicKey.toBase58());
    expect(provider.connect).toHaveBeenCalledTimes(2);
    expect(provider.connect).toHaveBeenNthCalledWith(1, { onlyIfTrusted: true });
    expect(provider.connect).toHaveBeenNthCalledWith(2);
  });
});
