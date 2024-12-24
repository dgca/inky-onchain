import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-contract-sizer";
import "@nomicfoundation/hardhat-verify";

function getNetworks() {
  if (!process.env.TESTNET_PK || !process.env.MAINNET_PK) {
    throw new Error("TESTNET_PK or MAINNET_PK is not set");
  }

  return {
    sepolia: {
      url: process.env.TESTNET_TRANSPORT_URL,
      accounts: [process.env.TESTNET_PK],
    },
    mainnet: {
      url: process.env.MAINNET_TRANSPORT_URL,
      accounts: [process.env.MAINNET_PK],
    },
  };
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
  },
  networks: getNetworks(),
  paths: {
    sources: "./src",
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.BLOCKSCOUT_API_KEY!,
    },
    customChains: [
      {
        network: "mainnet",
        chainId: 57073,
        urls: {
          apiURL: "https://explorer.inkonchain.com/api",
          browserURL: "https://explorer.inkonchain.com",
        },
      },
    ],
  },
};

export default config;
