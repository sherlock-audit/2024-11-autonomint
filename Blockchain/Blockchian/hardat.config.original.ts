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
        url: INFURA_ID_MODE_MAINNET ? INFURA_ID_MODE_MAINNET : "", // https://mode.gateway.tenderly.co
        // blockNumber: 15994552
      },
    },
    sepolia: {
      url: INFURA_ID_SEPOLIA,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    baseSepolia: {
      url: INFURA_ID_BASE_SEPOLIA,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    modeSepolia: {
      url: INFURA_ID_MODE_SEPOLIA,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    optimismSepolia:{
      url: INFURA_ID_OPT_SEPOLIA,
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: {
      sepolia: SEPOLIA_API_KEY ? SEPOLIA_API_KEY : "",
      baseSepolia: BASE_SEPOLIA_API_KEY ? BASE_SEPOLIA_API_KEY : "",
      modeSepolia: MODE_SEPOLIA_API_KEY ? MODE_SEPOLIA_API_KEY : "",
      optimisimSepolia: OPT_SEPOLIA_API_KEY ? OPT_SEPOLIA_API_KEY : ""
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://api-sepolia.basescan.org/api",
         browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "modeSepolia",
        chainId: 919,
        urls: {
         apiURL: "https://sepolia.explorer.mode.network/api",
         browserURL: "https://sepolia.explorer.mode.network/"
        }
      },
      {
        network: "optimisimSepolia",
        chainId: 11155420,
        urls: {
         apiURL: "https://api-sepolia-optimism.etherscan.io/api",
         browserURL: "https://sepolia-optimistic.etherscan.io"
        }
      }
    ]
  }
};

export default config;

