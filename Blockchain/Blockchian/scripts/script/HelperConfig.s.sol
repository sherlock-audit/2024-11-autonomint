//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Script} from "../../lib/forge-std/src/Script.sol";
import {MockV3Aggregator} from "../../test/foundry/mocks/MockV3Aggregator.sol";
import {ERC20Mock} from "../../test/foundry/mocks/ERC20Mock.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address ethUsdPriceFeed;
        address weethUsdPriceFeed;
        address wrsethUsdPriceFeed;
        address ethAddress;
        address weethAddress;
        address wrsethAddress;
        address rsethAddress;
        address wethGatewayAddress;
        address cEthAddress;
        address wethAddress;
        address aavePoolAddress;
        address aTokenAddress;
        uint256 deployerKey;
    }

    MockV3Aggregator immutable ethUsdPriceFeedV3;
    MockV3Aggregator immutable weethUsdPriceFeedV3;
    MockV3Aggregator immutable wrsethUsdPriceFeedV3;

    uint8 public constant DECIMALS = 8;
    int256 public constant ETH_USD_PRICE = 1000e8;
    int256 public constant WEETH_USD_PRICE = 1100e18;
    int256 public constant WRSETH_USD_PRICE = 1100e18;

    uint256 public constant DEFAULT_ANVIL_KEY =
        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    NetworkConfig private activeNetworkConfig;

    constructor() {
        ethUsdPriceFeedV3 = new MockV3Aggregator(
            DECIMALS,
            ETH_USD_PRICE
        );
        weethUsdPriceFeedV3 = new MockV3Aggregator(
            DECIMALS,
            WEETH_USD_PRICE
        );
        wrsethUsdPriceFeedV3 = new MockV3Aggregator(
            DECIMALS,
            WRSETH_USD_PRICE
        );
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else if (block.chainid == 1) {
            activeNetworkConfig = getMainnetEthConfig();
        } else if (block.chainid == 34443){
            activeNetworkConfig = getModeEthConfig();
        }else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                ethUsdPriceFeed: address(ethUsdPriceFeedV3),
                weethUsdPriceFeed: address(weethUsdPriceFeedV3),
                wrsethUsdPriceFeed: address(wrsethUsdPriceFeedV3),
                // ethUsdPriceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306,
                // weethUsdPriceFeed: 0x5c9C449BbC9a6075A2c061dF312a35fd1E05fF22,
                // rsethUsdPriceFeed: 0x03c68933f7a3F76875C0bc670a58e69294cDFD01,
                ethAddress: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE,
                weethAddress: 0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee,
                rsethAddress: 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7,
                wrsethAddress: 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7,
                wethGatewayAddress: 0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9,
                cEthAddress: 0xA17581A9E3356d9A858b789D68B4d866e593aE94,
                wethAddress: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
                aavePoolAddress: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e,
                aTokenAddress: 0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }

    function getMainnetEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                ethUsdPriceFeed: address(ethUsdPriceFeedV3),
                weethUsdPriceFeed: address(weethUsdPriceFeedV3),
                wrsethUsdPriceFeed: address(wrsethUsdPriceFeedV3),
                // ethUsdPriceFeed: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419,
                // weethUsdPriceFeed: 0x5c9C449BbC9a6075A2c061dF312a35fd1E05fF22,
                // rsethUsdPriceFeed: 0x03c68933f7a3F76875C0bc670a58e69294cDFD01,
                ethAddress: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE,
                weethAddress: 0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee,
                rsethAddress: 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7,
                wrsethAddress: 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7,
                wethGatewayAddress: 0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9,
                cEthAddress: 0xA17581A9E3356d9A858b789D68B4d866e593aE94,
                wethAddress: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
                aavePoolAddress: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e,
                aTokenAddress: 0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8,
                deployerKey: DEFAULT_ANVIL_KEY
            });
    }

    function getModeEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                ethUsdPriceFeed: 0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256,// address(ethUsdPriceFeedV3),
                weethUsdPriceFeed: 0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256,// address(weethUsdPriceFeedV3),
                wrsethUsdPriceFeed: 0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256,// address(rsethUsdPriceFeedV3),
                // ethUsdPriceFeed: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419,
                // weethUsdPriceFeed: 0x5c9C449BbC9a6075A2c061dF312a35fd1E05fF22,
                // rsethUsdPriceFeed: 0x03c68933f7a3F76875C0bc670a58e69294cDFD01,
                ethAddress: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE,
                weethAddress: 0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A,
                wrsethAddress: 0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd,
                rsethAddress: 0x4186BFC76E2E237523CBC30FD220FE055156b41F,
                wethGatewayAddress: 0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9,
                cEthAddress: 0xA17581A9E3356d9A858b789D68B4d866e593aE94,
                wethAddress: 0x4200000000000000000000000000000000000006,
                aavePoolAddress: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e,
                aTokenAddress: 0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8,
                deployerKey: DEFAULT_ANVIL_KEY
            });
    }

    function getOrCreateAnvilEthConfig() public view returns (NetworkConfig memory) {
        if (activeNetworkConfig.ethUsdPriceFeed != address(0)) {
            return activeNetworkConfig;
        }
        return
            NetworkConfig({
                ethUsdPriceFeed: address(ethUsdPriceFeedV3),
                weethUsdPriceFeed: address(weethUsdPriceFeedV3),
                wrsethUsdPriceFeed: address(wrsethUsdPriceFeedV3),
                ethAddress: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE,
                weethAddress: 0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee,
                rsethAddress: 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7,
                wrsethAddress: 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7,
                wethGatewayAddress: 0x893411580e590D62dDBca8a703d61Cc4A8c7b2b9,
                cEthAddress: 0xA17581A9E3356d9A858b789D68B4d866e593aE94,
                wethAddress: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
                aavePoolAddress: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e,
                aTokenAddress: 0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8,
                deployerKey: DEFAULT_ANVIL_KEY
            });
    }

    function getActiveNetworkConfig() public view returns(NetworkConfig memory){
        return activeNetworkConfig;
    }
}
