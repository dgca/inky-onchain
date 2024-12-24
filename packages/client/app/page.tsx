"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { VT323 } from "next/font/google";
import { Logo } from "@/components/Logo/Logo";
import { cn } from "@/lib/utils";
import { hexToBytes } from "viem";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
});

function renderImageBytes(hexString: string) {
  const bytesData = hexToBytes(hexString as `0x${string}`);

  const binString = Array.from(bytesData, (byte) =>
    String.fromCodePoint(byte),
  ).join("");

  return btoa(binString);
}

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen relative">
      <main className="grow p-4 relative">
        <div className="flex items-center justify-between">
          <Logo />
          <ConnectButton />
        </div>

        <div className="flex flex-col items-center max-w-[700px] mx-auto mt-6">
          <h1
            className={cn(
              vt323.className,
              "text-6xl mt-12 text-white text-center",
            )}
          >
            Inky Onchain
          </h1>

          <ul
            className={cn(
              vt323.className,
              "list-none text-center text-xl text-white space-y-2 mt-4",
            )}
          >
            <li>1 of 2024 minted</li>
            <li>
              <a
                href="https://explorer.inkonchain.com/token/0x985d0E6DB49338E9F4ecb4eE57496492e26f6647"
                target="_blank"
                rel="noreferrer"
                className="text-white underline hover:text-gray-300"
              >
                View collection
              </a>
            </li>
          </ul>

          <Button className="my-12" variant="secondary">
            Mint Your Inky
          </Button>

          <p className={cn(vt323.className, "text-center text-lg text-white")}>
            A 31px by 31px, fully onchain art collection commemorating the
            launch of Ink's L2 blockchain.
          </p>

          <Image
            src="/inky-image.png"
            alt="InkyOnChain"
            width={400}
            height={400}
            className="my-8"
          />

          <p className={cn(vt323.className, "text-center text-lg text-white")}>
            Limited to 2024 unique bitmap NFTs, each piece encodes the token ID
            and minter's address directly into the artwork, creating a permanent
            and personalized record on the blockchain.
          </p>
        </div>
      </main>

      <footer className="p-4 text-white text-center mt-8">
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
  );
}
