import { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-chai-matchers");
import "solidity-coverage";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import "hardhat-tracer";
import "hardhat-contract-sizer";
import dotenv from 'dotenv';
dotenv.config({ path: ".env" });

const INFURA_ID_ETH_MAINNET = process.env.INFURA_ID_ETH_MAINNET;
const INFURA_ID_OPT_MAINNET = process.env.INFURA_ID_OPT_MAINNET;
const INFURA_ID_MODE_MAINNET = process.env.INFURA_ID_MODE_MAINNET;

const INFURA_ID_SEPOLIA = process.env.INFURA_ID_SEPOLIA;
const INFURA_ID_BASE_SEPOLIA = process.env.INFURA_ID_BASE_SEPOLIA;
const INFURA_ID_MODE_SEPOLIA = process.env.INFURA_ID_MODE_SEPOLIA;
const INFURA_ID_OPT_SEPOLIA = process.env.INFURA_ID_OPT_SEPOLIA;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SEPOLIA_API_KEY = process.env.SEPOLIA_API_KEY;
const BASE_SEPOLIA_API_KEY = process.env.BASE_SEPOLIA_API_KEY;
const MODE_SEPOLIA_API_KEY = process.env.MODE_SEPOLIA_API_KEY;
const OPT_SEPOLIA_API_KEY = process.env.OPT_SEPOLIA_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true
        },
      },
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true
        },
      },
    ],
  },
  mocha: {
    timeout: 1000000
  },
  networks: {
    hardhat: {
      forking: {
        url: INFURA_ID_MODE_MAINNET ? INFURA_ID_MODE_MAINNET : "https://mode.gateway.tenderly.co", // https://mode.gateway.tenderly.co
        // blockNumber: 15994552
      },
    },
  },
};

export default config;

