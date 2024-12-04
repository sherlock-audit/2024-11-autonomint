# Hardhat Deployment Script

## Overview
This Hardhat deployment script sets up a comprehensive system of contracts. It includes deploying various mock contracts, proxies, and initializing them with necessary parameters to simulate a multi-environment setup. The script is designed for a complex decentralized financial ecosystem involving assets like WEETH, RSETH, stablecoins, price oracles, and other components such as multi-signature wallets and treasury modules.

## Prerequisites
Ensure you have the following installed and configured before running the script:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://docs.ethers.io/)
- `@openzeppelin/hardhat-upgrades` for deploying upgradeable contracts

## Usage
1. Clone the repository containing this script:
   ```bash
   git clone https://github.com/Autonomint/Blockchain/tree/AuditBranch
   cd Blockchian
   yarn install
   ```
2. Update the `hardhat.config.ts` file with mode network and configuration details.
   ```bash
   npx hardhat test test/BorrowingTest.ts
   ```
3. Git Bash
   ```bash
   cd Blockchian
   forge install foundry-rs/forge-std --no-commit
   anvil --fork-url https://mainnet.mode.network
   forge test --fork-url http://127.0.0.1:8545 --mt invariant_ProtocolMustHaveMoreValueThanSupply
   ```


## Script Functionality
The script performs the following tasks:

1. **Initialize Signers**:
   - Assigns multiple signers (`owner`, `owner1`, `owner2`, etc.) for use in the deployment.

2. **Deploy Mock Endpoints**:
   - Deploys instances of `EndpointV2Mock` to simulate LayerZero endpoints for inter-contract communication.

3. **Deploy Proxy Contracts**:
   - Deploys `WEETH`, `RSETH`, `TestUSDaStablecoin`, and other contracts using UUPS proxies.

4. **Set Up Multi-Signature Wallets**:
   - Deploys `MultiSign` contracts with configurable signer requirements.

5. **Deploy Price Oracles**:
   - Deploys `MockV3Aggregator` and configures them for asset price feeds.

6. **Configure Master Price Oracle**:
   - Aggregates multiple price feeds into a single oracle.

7. **Deploy and Link Libraries**:
   - Deploys libraries like `CDSLib` and `BorrowLib` for use in linked contracts.

8. **Deploy Core Contracts**:
   - Sets up key components like `CDS`, `BorrowingTest`, `Treasury`, and `Options` modules.

9. **Initialize Inter-Contract Communication**:
   - Configures communication between deployed contracts by setting destination endpoints and peers.

## Deployment flow
1. Deploy mock Endpoint contracts.
   Initialize function arguments:
      1. Endpoint ID.

2. Deploy mock WeETH contract for two chains.
   Initialize function arguments:
      1. Endpoint contract address.
      2. Contract owner address.

3. Deploy mock WrsETH contract for two chains.
   Initialize function arguments:
      1. Endpoint contract address.
      2. Contract owner address.

4. Deploy mock rsETH contract for two chains.
   Initialize function arguments:
      1. Endpoint contract address.
      2. Contract owner address.

5. Deploy USDaStablecoin contract for two chains.
   Initialize function arguments:
      1. Endpoint contract address.
      2. Contract owner address.

6. Deploy ABONDToken contract for two chains.
   Initialize function arguments: NA

7. Deploy MultiSign contract for two chains.
   Initialize function arguments:
      1. Array od owner addresses.
      2. Required number of approvals from owners.

8. Deploy Mock ChainLinkPriceFeed contract for two chains for ETH only.
   Constructor arguments:
      1. Decimals.
      2. Price in USD.

9. Deploy MasterPriceOracle contract for two chains.
   Constructor arguments:
      1. Collateral addresses.
      2. Array of pricefeed/oracle addresses from chainlink for op and redstone for mode.
   
10. Deploy CDS contract with CDSLib library linked for two chains.
   Initialize function arguments:
      1. USDa address.
      2. MasterPriceOracle address.
      3. USDT address.
      4. MultiSign address.

11. Deploy GlobalVariables contract for two chains.
   Initialize function arguments:
      1. USDa address.
      2. CDS address.
      3. Endpoint address.
      4. Owner address.

12. Deploy Borrowing contract with BorrowLib library linked for two chains.
   Initialize function arguments:
      1. USDa address.
      2. CDS address.
      3. ABONDToken address.
      4. MultiSign address.
      5. MasterPriceOracle Address.
      6. Array of supported collateral addresses.
      7. Array of token addresses.
      8. Chain ID.
      9. GlobalVariables address.

13. Deploy BorrowLiquidation contract with BorrowLib library linked for two chains.
   Initialize function arguments:
      1. Borrowing address.
      2. CDS address.
      3. USDa address.
      4. GlobalVariables address.
      5. weth Address,
      6. wrapper(synthetix) Address,
      7. synthetixPerpsV2 Address,
      8. synthetix Address

14. Deploy Treasury contract for two chains.
   Initialize function arguments:
      1. Borrowing address.
      2. USDa address.
      3. ABONDToken address.
      4. CDS address.
      5. BorrowLiquidation address.
      6. USDT address.
      7. GlobalVariables address.

15. Deploy Options contract for two chains.
   Initialize function arguments:
      1. Treasury address.
      2. CDS address.
      3. Borrowing address.
      4. GlobalVariables address.

## Setting / Initializing protocol
1. setPeer in USDa and GlobalVariables contract.
   Function params:
      1. Endpoint ID of destination chain.
      2. Destination chain USDa and GlobalVariables address.

2. setBorrowingContract in ABONDToken contract.
   Function params:
      1. Borrowing address.

3. approveSetterFunction in MultiSign contract.
   Function params:
      1. Array of enums for setter functions.

4. setAdmin in Borrowing ad CDS contract.
   Function params:
      1. Admin address

5. setDstEid in USDa and GlobalVariables contract.
   Function params:
      1. Destination chain EID.

6. setBorrowingContract, setCdsContract, setTreasuryContract in USDa contract.
   Function params:
      1. Respective contract address.

7. setDstGlobalVariablesAddress in GlobalVariables contract.
   Function params:
      1. Destination chain GlobalVariables contract address.

8. setTreasury, setBorrowLiq, setBorrowing in GlobalVariables contract.
   Function params:
      1. Respective contract address.

9. setTreasury, setOptions, setBorrowLiquidation, setLTV, setBondRatio, setAPR in Borrowing contract.
   Function params:
      1. Respective contract address.
      2. setLTV - 80.
      3. setBondRatio - 4.
      4. setAPR - 50(means 5%), 1000000001547125957863212448(got from maker).

10. setTreasury, setAdmin in BorrowLiquidation contract.
   Function params:
      1. Respective address.

11. setTreasury, setBorrowingContract, setBorrowLiquidation, setGlobalVariables, setAdminTwo, setUSDaLimit, setUsdtLimit in USDa contract.
   Function params:
      1. Respective contract address.
      2. setAdminTwo - keccak256 version of admin2 address.
      3. setUSDaLimit - 80 (80 %).
      4. setUsdtLimit - 20000000000($20K).

12. calculateCumulativeRate in Borrowing contract.
   Function params: NA.

13. setExternalProtocolAddresses in Treasury contract.
   Function params:
      1. Ionic contract address.
      2. WETH address.
      3. ODOS router V2 address.

## Notes
- Ensure all libraries are deployed before deploying linked contracts.

## License
This script is open-source and available under the MIT license.