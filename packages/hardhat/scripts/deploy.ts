import hre from "hardhat";

async function main() {
  const publicClient = await hre.viem.getPublicClient();
  const [deployerClient] = await hre.viem.getWalletClients();

  console.log("Deploying BitmapRendererV1");
  const bitmapRendererV1 = await hre.viem.deployContract("BitmapRendererV1");
  console.log(`BitmapRendererV1 deployed at ${bitmapRendererV1.address}`);

  console.log("Deploying InkyOnChain");
  const inkyOnChain = await hre.viem.deployContract("InkyOnChain", [
    bitmapRendererV1.address,
  ]);
  console.log(`InkyOnChain deployed at ${inkyOnChain.address}`);

  const mintReceipt = await deployerClient.writeContract({
    address: inkyOnChain.address,
    abi: inkyOnChain.abi,
    functionName: "mint",
    args: [],
    value: BigInt(0.002 * 10 ** 18),
  });

  await publicClient.waitForTransactionReceipt({
    hash: mintReceipt,
  });

  const tokenURI = await publicClient.readContract({
    address: inkyOnChain.address,
    abi: inkyOnChain.abi,
    functionName: "tokenURI",
    args: [1n],
  });

  console.log(`Token URI for token #1:`);
  console.log(tokenURI);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
