import { getChainsAndTransports } from "@/web3/getWalletClient";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const { chains, transports } = getChainsAndTransports();

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const config = getDefaultConfig({
  appName: "Inky Onchain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains,
  transports,
  ssr: true,
});
