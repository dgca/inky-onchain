import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";
import { INKY_ABI } from "@/web3/abis/InkyOnChain";
import { INKY_ADDRESS } from "@/web3/addresses";
import { retryPromise } from "@/lib/retryPromise";
import { useState } from "react";
import { useRouter } from "next/navigation";

const INK_CHAIN_ID = 57073;

export function MintButton() {
  const { address, chainId } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const publicClient = usePublicClient();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { switchChainAsync } = useSwitchChain();

  const isWrongChain = chainId !== INK_CHAIN_ID;

  return (
    <div className="flex flex-col items-center">
      {address && isWrongChain && (
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await switchChainAsync({ chainId: INK_CHAIN_ID });
            } catch (err) {
              setError("Failed to switch network");
            }
          }}
        >
          Switch to Ink Chain
        </Button>
      )}
      {address && !isWrongChain && (
        <>
          <Button
            variant="secondary"
            onClick={async () => {
              setError(null);

              const txHash = await writeContractAsync(
                {
                  address: INKY_ADDRESS,
                  abi: INKY_ABI,
                  functionName: "mint",
                  value: BigInt(2000000000000000), // 0.002 ETH from contract
                },
                {
                  onError: (error) => {
                    setError(
                      "details" in error ? error.details : error.message,
                    );
                  },
                },
              );

              let tokenId: number | null = null;

              try {
                await retryPromise(async () => {
                  const receipt = await publicClient.waitForTransactionReceipt({
                    hash: txHash,
                  });

                  const maybeTokenId = receipt.logs[0].topics[3];

                  if (maybeTokenId === undefined) {
                    throw new Error(
                      "Unable to get tokenId, but your mint was successful.",
                    );
                  }

                  tokenId = Number(maybeTokenId);

                  router.push(`/token/${tokenId}`);
                });
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Unknown error occured.",
                );
              }
            }}
            disabled={isPending || isWrongChain}
          >
            {isPending ? "Minting..." : "Mint Your Inky"}
          </Button>
          <p className="text-xs text-white mt-2">Price: 0.002 ETH</p>
        </>
      )}
      {!address && <ConnectButton />}
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center border border-red-500 bg-red-50 rounded p-2 mb-8">
          {error}
        </p>
      )}
    </div>
  );
}
