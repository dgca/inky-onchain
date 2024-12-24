"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Logo } from "@/components/Logo/Logo";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "./wagmi";

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const client = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Inky Onchain</title>
        <meta
          content="An onchain art collection commemorating the launch of the Ink blockchain"
          name="description"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦑</text></svg>"
        />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: "#BD93D8",
                accentColorForeground: "#000",
              })}
            >
              <div className="grid grid-rows-[1fr_auto] min-h-screen relative">
                <main className="grow p-4 relative">
                  <div className="flex items-center justify-between">
                    <Logo />
                    <ConnectButton />
                  </div>

                  <div className="flex flex-col items-center max-w-[700px] mx-auto mt-6">
                    {children}
                  </div>
                </main>

                <footer className="p-4 text-white text-center mt-16">
                  A project by{" "}
                  <a
                    href="https://warpcast.com/typeof.eth"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline"
                  >
                    @typeof.eth
                  </a>
                </footer>
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
