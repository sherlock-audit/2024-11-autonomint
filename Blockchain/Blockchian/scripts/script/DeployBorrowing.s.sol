//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Script,console} from "forge-std/Script.sol";
import {BorrowingTest} from "../../contracts/TestContracts/CopyBorrowing.sol";
import {Treasury} from "../../contracts/Core_logic/Treasury.sol";
import {GlobalVariables} from "../../contracts/Core_logic/GlobalVariables.sol";
import {CDSTest} from "../../contracts/TestContracts/CopyCDS.sol";
import {TestUSDaStablecoin} from "../../contracts/TestContracts/CopyUSDa.sol";
import {TestABONDToken} from "../../contracts/TestContracts/Copy_Abond_Token.sol";
import {WEETH} from "../../contracts/TestContracts/MockWeETH.sol";
import {RSETH} from "../../contracts/TestContracts/MockRsETH.sol";
import {Options} from "../../contracts/Core_logic/Options.sol";
import {MultiSign} from "../../contracts/Core_logic/multiSign.sol";
import {TestUSDT} from "../../contracts/TestContracts/CopyUsdt.sol";
import {EndpointV2Mock} from "../../contracts/TestContracts/EndpointV2Mock.sol";
import {BorrowLiquidation} from "../../contracts/Core_logic/borrowLiquidation.sol";
import {BasePriceOracle} from "../../contracts/oracles/BasePriceOracle.sol";
import {MasterPriceOracle} from "../../contracts/oracles/MasterPriceOracle.sol";

import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployBorrowing is Script {

    struct Contracts {
        WEETH weeth;
        RSETH rseth;
        TestUSDaStablecoin usda;
        TestABONDToken abond;
        MultiSign multiSign;
        TestUSDT usdt;
        CDSTest cds;
        GlobalVariables global;
        BorrowingTest borrow;
        BorrowLiquidation borrowLiquidation;
        Treasury treasury;
        Options option;
        HelperConfig config;
    }

    TestUSDaStablecoin usda;
    TestABONDToken abond;
    MultiSign multiSign;
    TestUSDT usdt;
    CDSTest cds;
    GlobalVariables global;
    BorrowingTest borrow;
    BorrowLiquidation borrowLiquidation;
    Treasury treasury;
    Options option;
    HelperConfig config;
    EndpointV2Mock endPointV2A;
    EndpointV2Mock endPointV2B;
    WEETH weeth;
    RSETH rseth;

    uint32 eidA = 1;
    uint32 eidB = 2;

    address[] owners = [
        0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
        0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
        0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
        ];

    uint8[] functions = [0,1,2,3,4,5,6,7,8,9];

    address[] priceFeedAddresses;
    address[] collateralAddresses;
    address[] tokenAddresses;

    function run() external returns (Contracts memory,Contracts memory){
        config = new HelperConfig();
        HelperConfig.NetworkConfig memory activeNetworkConfig = config.getActiveNetworkConfig();
        
        vm.startBroadcast(activeNetworkConfig.deployerKey);
        usda = new TestUSDaStablecoin();
        abond = new TestABONDToken();
        multiSign = new MultiSign();
        usdt = new TestUSDT();
        cds = new CDSTest();
        borrow = new BorrowingTest();
        treasury = new Treasury();
        option = new Options();
        borrowLiquidation = new BorrowLiquidation();
        global = new GlobalVariables();
        endPointV2A = new EndpointV2Mock(eidA);

        if(block.chainid == 31337){
            weeth = new WEETH();
            rseth = new RSETH();
            activeNetworkConfig.weethAddress = address(weeth); 
            activeNetworkConfig.rsethAddress = address(rseth);
        }
        priceFeedAddresses = [
            activeNetworkConfig.ethUsdPriceFeed, 
            activeNetworkConfig.weethUsdPriceFeed, 
            activeNetworkConfig.wrsethUsdPriceFeed,
            activeNetworkConfig.wrsethUsdPriceFeed
        ];
        collateralAddresses = [
            activeNetworkConfig.ethAddress, 
            activeNetworkConfig.weethAddress, 
            activeNetworkConfig.wrsethAddress,
            activeNetworkConfig.rsethAddress
        ];
        tokenAddresses = [
            address(usda),
            address(abond),
            address(usdt)
        ];
        MasterPriceOracle mpo = new MasterPriceOracle(
            collateralAddresses, priceFeedAddresses
        );
        // weeth.initialize(address(endPointV2A), owners[0]);
        // rseth.initialize(address(endPointV2A), owners[0]);
        usda.initialize(address(endPointV2A), owners[0]);
        abond.initialize();
        multiSign.initialize(owners, 2);
        usdt.initialize(address(endPointV2A), owners[0]);
        cds.initialize(
            address(usda),
            address(mpo),
            address(usdt),
            address(multiSign)
            );
        global.initialize(
            address(usda),
            address(cds),
            address(endPointV2A),
            owners[0]
        );
        borrow.initialize(
            address(usda),
            address(cds),
            address(abond),
            address(multiSign),
            address(mpo),
            collateralAddresses,
            tokenAddresses,
            uint64(block.chainid),
            address(global)
            );
        borrowLiquidation.initialize(
            address(borrow),
            address(cds),
            address(usda),
            address(global),
            0x4200000000000000000000000000000000000006,
            0x1ea449185eE156A508A4AeA2affCb88ec400a95D,
            0xCa1Da01A412150b00cAD52b426d65dAB38Ab3830,
            0xC6F85E8Cc2F13521f909810d03Ca66397a813eDb
            );
        treasury.initialize(
            address(borrow),
            address(usda),
            address(abond),
            address(cds),
            address(borrowLiquidation),
            address(usdt),
            address(global)
            );
        option.initialize(
            address(treasury),
            address(cds),
            address(borrow),
            address(global)
        );

        Contracts memory contractsA = Contracts(
            weeth,
            rseth,
            usda,
            abond,
            multiSign,
            usdt,
            cds,
            global,
            borrow,
            borrowLiquidation,
            treasury,
            option,
            config
        );

        weeth = new WEETH();
        rseth = new RSETH();
        usda = new TestUSDaStablecoin();
        abond = new TestABONDToken();
        multiSign = new MultiSign();
        usdt = new TestUSDT();
        cds = new CDSTest();
        borrow = new BorrowingTest();
        treasury = new Treasury();
        option = new Options();
        borrowLiquidation = new BorrowLiquidation();
        global = new GlobalVariables();
        endPointV2B = new EndpointV2Mock(eidB);
        config = new HelperConfig();
        if(block.chainid == 31337){
            activeNetworkConfig.weethAddress = address(weeth); 
            activeNetworkConfig.rsethAddress = address(rseth);
        }
        priceFeedAddresses = [
            activeNetworkConfig.ethUsdPriceFeed, 
            activeNetworkConfig.weethUsdPriceFeed, 
            activeNetworkConfig.wrsethUsdPriceFeed,
            activeNetworkConfig.wrsethUsdPriceFeed
        ];
        collateralAddresses = [
            activeNetworkConfig.ethAddress, 
            activeNetworkConfig.weethAddress, 
            activeNetworkConfig.wrsethAddress,
            activeNetworkConfig.rsethAddress
        ];
        tokenAddresses = [
            address(usda),
            address(abond),
            address(usdt)
        ];
        mpo = new MasterPriceOracle(
            collateralAddresses, priceFeedAddresses
        );
        // weeth.initialize(address(endPointV2B), owners[0]);
        // rseth.initialize(address(endPointV2B), owners[0]);
        usda.initialize(address(endPointV2B), owners[0]);
        abond.initialize();
        multiSign.initialize(owners, 2);
        usdt.initialize(address(endPointV2B), owners[0]);
        cds.initialize(
            address(usda),
            address(mpo),
            address(usdt),
            address(multiSign)
            );
        global.initialize(
            address(usda),
            address(cds),
            address(endPointV2B),
            owners[0]
        );
        borrow.initialize(
            address(usda),
            address(cds),
            address(abond),
            address(multiSign),
            address(mpo),
            collateralAddresses,
            tokenAddresses,
            uint64(block.chainid),
            address(global)
            );
        borrowLiquidation.initialize(
            address(borrow),
            address(cds),
            address(usda),
            address(global),
            0x4200000000000000000000000000000000000006,
            0x1ea449185eE156A508A4AeA2affCb88ec400a95D,
            0xCa1Da01A412150b00cAD52b426d65dAB38Ab3830,
            0xC6F85E8Cc2F13521f909810d03Ca66397a813eDb
            );
        treasury.initialize(
            address(borrow),
            address(usda),
            address(abond),
            address(cds),
            address(borrowLiquidation),
            address(usdt),
            address(global)
            );
        option.initialize(
            address(treasury),
            address(cds),
            address(borrow),
            address(global)
        );
        Contracts memory contractsB = Contracts(
            weeth,
            rseth,
            usda,
            abond,
            multiSign,
            usdt,
            cds,
            global,
            borrow,
            borrowLiquidation,
            treasury,
            option,
            config
        );
        vm.stopBroadcast();

        endPointV2A.setDestLzEndpoint(address(contractsB.usda),address(endPointV2B));
        endPointV2A.setDestLzEndpoint(address(contractsB.usdt),address(endPointV2B));
        endPointV2A.setDestLzEndpoint(address(contractsB.global),address(endPointV2B));
        endPointV2A.setDestLzEndpoint(address(contractsB.weeth),address(endPointV2B));
        endPointV2A.setDestLzEndpoint(address(contractsB.rseth),address(endPointV2B));

        endPointV2B.setDestLzEndpoint(address(contractsA.usda),address(endPointV2A));
        endPointV2B.setDestLzEndpoint(address(contractsA.usdt),address(endPointV2A));
        endPointV2B.setDestLzEndpoint(address(contractsA.global),address(endPointV2A));
        endPointV2B.setDestLzEndpoint(address(contractsA.weeth),address(endPointV2A));
        endPointV2B.setDestLzEndpoint(address(contractsA.rseth),address(endPointV2A));

        set(contractsA, contractsB);
        return(contractsA, contractsB);
    }

    function set(Contracts memory contractsA, Contracts memory contractsB) internal {
        HelperConfig.NetworkConfig memory activeNetworkConfig = config.getActiveNetworkConfig();
        vm.startPrank(owners[0]);

        if(block.chainid == 31337){
            contractsA.weeth.setPeer(eidB,bytes32(uint256(uint160(address(contractsB.weeth)))));
            contractsA.rseth.setPeer(eidB,bytes32(uint256(uint160(address(contractsB.rseth)))));

            contractsB.weeth.setPeer(eidA,bytes32(uint256(uint160(address(contractsA.weeth)))));
            contractsB.rseth.setPeer(eidA,bytes32(uint256(uint160(address(contractsA.rseth)))));
        }

        contractsA.usda.setPeer(eidB,bytes32(uint256(uint160(address(contractsB.usda)))));
        contractsA.usdt.setPeer(eidB,bytes32(uint256(uint160(address(contractsB.usdt)))));
        contractsA.global.setPeer(eidB,bytes32(uint256(uint160(address(contractsB.global)))));

        contractsB.usda.setPeer(eidA,bytes32(uint256(uint160(address(contractsA.usda)))));
        contractsB.usdt.setPeer(eidA,bytes32(uint256(uint160(address(contractsA.usdt)))));
        contractsB.global.setPeer(eidA,bytes32(uint256(uint160(address(contractsA.global)))));
        
        contractsA.usda.setDstEid(eidB);
        contractsA.usdt.setDstEid(eidB);
        contractsA.global.setDstEid(eidB);

        contractsB.usda.setDstEid(eidA);
        contractsB.usdt.setDstEid(eidA);
        contractsB.global.setDstEid(eidA);

        contractsA.usda.setBorrowingContract(address(contractsA.borrow));
        contractsA.usda.setCdsContract(address(contractsA.cds));
        contractsA.usda.setTreasuryContract(address(contractsA.treasury));

        contractsB.usda.setBorrowingContract(address(contractsB.borrow));
        contractsB.usda.setCdsContract(address(contractsB.cds));
        contractsB.usda.setTreasuryContract(address(contractsB.treasury));

        contractsA.abond.setBorrowingContract(address(contractsA.borrow));
        contractsB.abond.setBorrowingContract(address(contractsB.borrow));

        contractsA.global.setTreasury(address(contractsA.treasury));
        contractsA.global.setBorrowLiq(address(contractsA.borrowLiquidation));
        contractsA.global.setBorrowing(address(contractsA.borrow));
        contractsA.global.setDstGlobalVariablesAddress(address(contractsB.global));

        contractsB.global.setTreasury(address(contractsB.treasury));
        contractsB.global.setBorrowLiq(address(contractsB.borrowLiquidation));
        contractsB.global.setBorrowing(address(contractsB.borrow));
        contractsB.global.setDstGlobalVariablesAddress(address(contractsA.global));

        contractsA.borrowLiquidation.setTreasury(address(contractsA.treasury));
        contractsB.borrowLiquidation.setTreasury(address(contractsB.treasury));

        contractsA.borrowLiquidation.setAdmin(owners[0]);
        contractsB.borrowLiquidation.setAdmin(owners[0]);

        contractsA.multiSign.approveSetterFunction(functions);
        contractsB.multiSign.approveSetterFunction(functions);

        vm.startPrank(owners[1]);
        contractsA.multiSign.approveSetterFunction(functions);
        contractsB.multiSign.approveSetterFunction(functions);
        vm.stopPrank();
        
        vm.startPrank(owners[0]);
        contractsA.borrow.setAdmin(owners[0]);
        contractsA.borrow.setTreasury(address(contractsA.treasury));
        contractsA.borrow.setOptions(address(contractsA.option));
        contractsA.borrow.setBorrowLiquidation(address(contractsA.borrowLiquidation));
        contractsA.borrow.setLTV(80);
        contractsA.borrow.setBondRatio(4);
        contractsA.borrow.setAPR(50, 1000000001547125957863212449);

        contractsA.cds.setAdmin(owners[0]);
        contractsA.cds.setTreasury(address(contractsA.treasury));
        contractsA.cds.setBorrowingContract(address(contractsA.borrow));
        contractsA.cds.setBorrowLiquidation(address(contractsA.borrowLiquidation));
        contractsA.cds.setUSDaLimit(80);
        contractsA.cds.setUsdtLimit(20000000000);
        contractsA.cds.setGlobalVariables(address(contractsA.global));

        contractsB.borrow.setAdmin(owners[0]);
        contractsB.borrow.setTreasury(address(contractsB.treasury));
        contractsB.borrow.setOptions(address(contractsB.option));
        contractsB.borrow.setBorrowLiquidation(address(contractsB.borrowLiquidation));
        contractsB.borrow.setLTV(80);
        contractsB.borrow.setBondRatio(4);
        contractsB.borrow.setAPR(50, 1000000001547125957863212449);

        contractsB.cds.setAdmin(owners[0]);
        contractsB.cds.setTreasury(address(contractsB.treasury));
        contractsB.cds.setBorrowingContract(address(contractsB.borrow));
        contractsB.cds.setBorrowLiquidation(address(contractsB.borrowLiquidation));
        contractsB.cds.setUSDaLimit(80);
        contractsB.cds.setUsdtLimit(20000000000);
        contractsB.cds.setGlobalVariables(address(contractsB.global));

        contractsA.treasury.setExternalProtocolAddresses(
            0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2,
            activeNetworkConfig.wethAddress,
            0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874
        );
        contractsB.treasury.setExternalProtocolAddresses(
            0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2,
            activeNetworkConfig.wethAddress,
            0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874
        );

        contractsA.borrow.calculateCumulativeRate();
        contractsB.borrow.calculateCumulativeRate();
        vm.stopPrank();
    }
}