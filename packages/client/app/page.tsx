"use client";
import { VT323 } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useReadContract } from "wagmi";
import { INKY_ABI } from "@/web3/abis/InkyOnChain";
import { INKY_ADDRESS } from "@/web3/addresses";
import { MintButton } from "@/components/MintButton/MintButton";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const { data } = useReadContract({
    address: INKY_ADDRESS,
    abi: INKY_ABI,
    functionName: "totalSupply",
  });

  return (
    <div className="flex flex-col gap-6 my-8">
      <h1 className={cn(vt323.className, "text-6xl text-white text-center")}>
        Inky Onchain
      </h1>

      <p
        className={cn(
          vt323.className,
          "text-center text-lg text-white max-w-md",
        )}
      >
        A 31px by 31px, onchain art collection commemorating the launch of
        Kraken's L2 blockchain: Ink 🦑
      </p>

      <MintButton />

      <p
        className={cn(
          vt323.className,
          "text-center text-lg text-white max-w-md mx-auto",
        )}
      >
        Need Ink ETH? Bridge from Base to Ink via{" "}
        <a
          href="https://relay.link/bridge/ink?includeChainIds=57073&fromChainId=8453&fromCurrency=0x0000000000000000000000000000000000000000"
          target="_blank"
          rel="noreferrer"
          className="text-white underline hover:text-gray-300"
        >
          Relay
        </a>
        ,{" "}
        <a
          href="https://rainbow.me/en/"
          target="_blank"
          rel="noreferrer"
          className="text-white underline hover:text-gray-300"
        >
          Rainbow Wallet
        </a>
        , or check out the{" "}
        <a
          href="https://inkonchain.com/dashboard?&category=bridge"
          target="_blank"
          rel="noreferrer"
          className="text-white underline hover:text-gray-300"
        >
          list of bridges
        </a>{" "}
        on the Ink website.
      </p>

      <h2
        className={cn(vt323.className, "text-4xl text-white text-center mt-12")}
      >
        About Inky
      </h2>

      <p
        className={cn(
          vt323.className,
          "text-center text-lg text-white max-w-md",
        )}
      >
        Each token encodes the token ID and minter's address directly into the
        artwork, creating a permanent and personalized record on the blockchain.
        Ink your name on the blockchain today!
      </p>

      <Image
        src="/inky-image.png"
        alt="InkyOnChain"
        width={400}
        height={400}
        className="mt-12"
      />

      <ul
        className={cn(
          vt323.className,
          "list-none text-center text-xl text-white space-y-2 mt-10",
        )}
      >
        <li>{typeof data === "bigint" ? Number(data) : "—"} of 2024 minted</li>
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
        <li>
          <a
            href="https://explorer.inkonchain.com/address/0x985d0E6DB49338E9F4ecb4eE57496492e26f6647?tab=contract"
            target="_blank"
            rel="noreferrer"
            className="text-white underline hover:text-gray-300"
          >
            View contract source
          </a>
        </li>
      </ul>
    </div>
  );
}
