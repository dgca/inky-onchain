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
import { VT323 } from "next/font/google";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const client = new QueryClient();

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
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
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between">
                    <Logo />
                    <nav
                      className={cn(
                        vt323.className,
                        "sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-6 text-xl",
                      )}
                    >
                      <a
                        href="/"
                        className={`text-white hover:text-gray-300 ${
                          pathname === "/" ? "underline" : ""
                        }`}
                      >
                        Mint
                      </a>
                      <a
                        href="/tokens"
                        className={`text-white hover:text-gray-300 ${
                          pathname === "/tokens" ? "underline" : ""
                        }`}
                      >
                        Tokens
                      </a>
                    </nav>
                    <ConnectButton />
                  </div>

                  <div className="flex flex-col items-center max-w-[1200px] mx-auto mt-6">
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
