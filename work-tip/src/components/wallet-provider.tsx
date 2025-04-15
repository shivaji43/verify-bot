"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [endpointUrl, setEndpointUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setEndpointUrl(`${origin}/api/rpc`);
    }
  }, []);

  const wallets = useMemo(() => [], []);

  if (!endpointUrl) {
    return null;
  }

  return (
    <ConnectionProvider endpoint={endpointUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            className="flex gap-2 items-center"
            style={{ position: "absolute", top: 24, right: 30 }}
          >
            <WalletMultiButton />
            <button className="w-full flex items-center gap-2 px-4 py-3 bg-violet-500 text-white rounded hover:bg-violet-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-zinc-500">
              <img src="/discord-white-icon.svg" className="size-4" />
              Login with Discord
            </button>
          </div>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
