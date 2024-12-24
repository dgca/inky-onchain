import { Address, createPublicClient, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { ink, inkSepolia } from "viem/chains";

const HTTP_TRANSPORT_URLS = {
  development: "http://127.0.0.1:8545/",
  testnet: process.env.NEXT_PUBLIC_TESTNET_TRANSPORT_URL,
  mainnet: process.env.NEXT_PUBLIC_MAINNET_TRANSPORT_URL,
};

const env = (process.env.NEXT_PUBLIC_ENV ??
  "development") as keyof typeof HTTP_TRANSPORT_URLS;

const HTTP_TRANSPORT_URL = HTTP_TRANSPORT_URLS[env];

export function getChainsAndTransports(): {
  chains:
    | readonly [typeof inkSepolia]
    | readonly [typeof ink]
    | readonly [typeof hardhat];
  transports: {
    [key: string]: ReturnType<typeof http>;
  };
} {
  if (env === "development") {
    return {
      chains: [hardhat],
      transports: {
        [hardhat.id]: http(HTTP_TRANSPORT_URL),
      },
    } as const;
  }

  if (env === "testnet") {
    return {
      chains: [inkSepolia],
      transports: {
        [inkSepolia.id]: http(HTTP_TRANSPORT_URL),
      },
    } as const;
  }

  if (env !== "mainnet") {
    throw new Error("Invalid env");
  }

  return {
    chains: [ink],
    transports: {
      [ink.id]: http(HTTP_TRANSPORT_URL),
    },
  } as const;
}

function getAccountParamsByNetwork() {
  const { chain, httpUrl, privateKey } = {
    development: {
      chain: hardhat,
      httpUrl: HTTP_TRANSPORT_URLS.development,
      privateKey: process.env.DEVELOPMENT_PK,
    },
    testnet: {
      chain: inkSepolia,
      httpUrl: HTTP_TRANSPORT_URLS.testnet,
      privateKey: process.env.TESTNET_PK,
    },
    mainnet: {
      chain: ink,
      httpUrl: HTTP_TRANSPORT_URLS.mainnet,
      privateKey: process.env.MAINNET_PK,
    },
  }[env];

  if (!privateKey) {
    throw new Error("Private key not found");
  }

  return {
    chain,
    httpUrl,
    privateKey,
  };
}

export function getWalletClient() {
  const { chain, httpUrl, privateKey } = getAccountParamsByNetwork();

  const account = privateKeyToAccount(privateKey as Address);

  return createWalletClient({
    account,
    chain,
    transport: http(httpUrl, {
      fetchOptions: {
        cache: "force-cache",
      },
    }),
  });
}

export function getPublicClient() {
  const { chains, transports } = getChainsAndTransports();

  const chain = chains.at(0);

  if (!chain) throw new Error("Chain not found");

  return createPublicClient({
    chain: chain,
    transport: transports[chain.id],
  });
}
