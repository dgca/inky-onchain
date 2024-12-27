"use client";
import { VT323 } from "next/font/google";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { INKY_ADDRESS } from "@/web3/addresses";
import { INKY_ABI } from "@/web3/abis/InkyOnChain";
import styles from "./styles.module.css";
import { useMemo } from "react";
import { renderImageBytes } from "@/lib/renderImageBytes";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
});

export default function TokenPage() {
  const params = useParams();

  const { data: imageData, isSuccess: isImageSuccess } = useReadContract({
    address: INKY_ADDRESS,
    abi: INKY_ABI,
    functionName: "tokenIdToImageBytes",
    args: [BigInt(params.tokenId as string)],
  });

  const { data: minterAddress, isSuccess: isMinterSuccess } = useReadContract({
    address: INKY_ADDRESS,
    abi: INKY_ABI,
    functionName: "tokenIdToMinter",
    args: [BigInt(params.tokenId as string)],
  });

  const imageSrc = useMemo(() => {
    if (!isImageSuccess) return null;

    return `data:image/png;base64,${renderImageBytes(imageData as string)}`;
  }, [isImageSuccess, imageData]);

  return (
    <>
      <h1
        className={cn(
          vt323.className,
          "text-6xl mt-12 text-white text-center mb-4",
        )}
      >
        Token #{params.tokenId}
      </h1>
      {isMinterSuccess && (
        <p className={cn(vt323.className, "text-white text-center text-xl")}>
          Minted by: {minterAddress}
        </p>
      )}
      {isMinterSuccess && (
        <a
          href={`https://explorer.inkonchain.com/token/${INKY_ADDRESS}/instance/${params.tokenId}`}
          target="_blank"
          rel="noreferrer"
          className={cn(
            vt323.className,
            "text-white underline text-center block hover:text-gray-300",
          )}
        >
          View on Block Explorer
        </a>
      )}

      {imageSrc && (
        <img
          className={styles.image}
          src={imageSrc}
          alt="Inky Onchain"
          width={512}
          height={512}
        />
      )}
    </>
  );
}
