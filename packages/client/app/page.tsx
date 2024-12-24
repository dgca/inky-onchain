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
    <>
      <h1
        className={cn(vt323.className, "text-6xl mt-12 text-white text-center")}
      >
        Inky Onchain
      </h1>

      <ul
        className={cn(
          vt323.className,
          "list-none text-center text-xl text-white space-y-2 mt-4",
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
      </ul>

      <MintButton />

      <p
        className={cn(
          vt323.className,
          "text-center text-lg text-white max-w-md",
        )}
      >
        A 31px by 31px, fully onchain art collection commemorating the launch of
        Kraken's L2 blockchain: Ink 🦑
      </p>

      <Image
        src="/inky-image.png"
        alt="InkyOnChain"
        width={400}
        height={400}
        className="my-8"
      />

      <p className={cn(vt323.className, "text-center text-lg text-white")}>
        Limited to 2024 unique bitmap NFTs, each piece encodes the token ID and
        minter's address directly into the artwork, creating a permanent and
        personalized record on the blockchain.
      </p>
    </>
  );
}
