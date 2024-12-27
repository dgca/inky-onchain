"use client";
import { useMemo, useState } from "react";
import { useReadContract } from "wagmi";
import { INKY_ABI } from "@/web3/abis/InkyOnChain";
import { INKY_ADDRESS } from "@/web3/addresses";
import { VT323 } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { renderImageBytes } from "@/lib/renderImageBytes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import styles from "./styles.module.css";
import { Spinner } from "@/components/ui/spinner";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
});

const PAGE_SIZE = 8;

export default function TokensPage() {
  const { data: totalSupplyData } = useReadContract({
    address: INKY_ADDRESS,
    abi: INKY_ABI,
    functionName: "totalSupply",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const totalSupply =
    typeof totalSupplyData === "bigint" ? totalSupplyData : BigInt(0);

  const pageCount = useMemo(() => {
    return Math.ceil(Number(totalSupply) / PAGE_SIZE);
  }, [totalSupply]);

  const tokenIds = useMemo(() => {
    const startId = (currentPage - 1) * PAGE_SIZE + 1;
    const endId = Math.min(Number(totalSupply), startId + PAGE_SIZE - 1);
    return Array.from({ length: endId - startId + 1 }, (_, i) =>
      BigInt(startId + i),
    );
  }, [currentPage, totalSupply]);

  const { data: imageBytes, isLoading } = useReadContract({
    address: INKY_ADDRESS,
    abi: INKY_ABI,
    functionName: "getImageBytesForTokenIds",
    args: [tokenIds],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={cn(vt323.className, "text-6xl text-white text-center mb-12")}
      >
        Inky Collection
      </h1>

      {isLoading && (
        <div className="flex justify-center items-center">
          <Spinner className="text-white h-12 w-12" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {imageBytes?.map((bytes, index) => (
          <Link
            href={`/tokens/${tokenIds[index]}`}
            key={tokenIds[index].toString()}
            className="block hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-[#7F51D4] rounded-sm">
              <img
                src={`data:image/bmp;base64,${renderImageBytes(bytes as string)}`}
                alt={`Token #${tokenIds[index]}`}
                className={cn(
                  styles.image,
                  "w-full aspect-square object-contain",
                )}
              />
              <p
                className={cn(
                  vt323.className,
                  "text-white text-xl text-center mt-3 mb-1",
                )}
              >
                Inky #{tokenIds[index].toString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => p - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}

          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {currentPage < pageCount && (
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => p + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
