// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test,StdUtils,console} from "forge-std/Test.sol";
import {BorrowingTest} from "../../contracts/TestContracts/CopyBorrowing.sol";
import {Treasury} from "../../contracts/Core_logic/Treasury.sol";
import {Options} from "../../contracts/Core_logic/Options.sol";
import {MultiSign} from "../../contracts/Core_logic/multiSign.sol";
import {CDSTest} from "../../contracts/TestContracts/CopyCDS.sol";
import {TestUSDaStablecoin} from "../../contracts/TestContracts/CopyUSDa.sol";
import {TestABONDToken} from "../../contracts/TestContracts/Copy_Abond_Token.sol";
import {TestUSDT} from "../../contracts/TestContracts/CopyUsdt.sol";
import {HelperConfig} from "../../scripts/script/HelperConfig.s.sol";
import {DeployBorrowing} from "../../scripts/script/DeployBorrowing.s.sol";
import {IWrappedTokenGatewayV3} from "../../contracts/interface/AaveInterfaces/IWETHGateway.sol";
import {IPoolAddressesProvider} from "../../contracts/interface/AaveInterfaces/IPoolAddressesProvider.sol";
import {ILendingPoolAddressesProvider} from "../../contracts/interface/AaveInterfaces/ILendingPoolAddressesProvider.sol";
import {IPool} from "../../contracts/interface/AaveInterfaces/IPool.sol";
import {State} from "../../contracts/interface/IAbond.sol";
import {IBorrowing} from "../../contracts/interface/IBorrowing.sol";
import {CDSInterface} from "../../contracts/interface/CDSInterface.sol";
import {ITreasury} from "../../contracts/interface/ITreasury.sol";
import {CometMainInterface} from "../../contracts/interface/CometMainInterface.sol";
import {IOptions} from "../../contracts/interface/IOptions.sol";
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { MessagingFee } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {IGlobalVariables} from "../../contracts/interface/IGlobalVariables.sol";
import {IWrsETH} from "../../contracts/interface/IWrsETH.sol";

contract BorrowTest is Test {
    DeployBorrowing deployer;
    DeployBorrowing.Contracts contractsA;
    DeployBorrowing.Contracts contractsB;

    address ethUsdPriceFeed;

    address public USER = makeAddr("user");
    address public owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public owner1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address public aTokenAddress = 0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8; // 0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8;
    address public cometAddress = 0xA17581A9E3356d9A858b789D68B4d866e593aE94; // 0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5;

    uint256 public ETH_AMOUNT = 1 ether;
    uint256 public STARTING_ETH_BALANCE = 100 ether;
    uint64 public ETH_PRICE = 1000e2;
    uint256 public ETH_VOLATILITY = 50622665;
    using OptionsBuilder for bytes;
    MessagingFee globalFee;
    MessagingFee globalFee2;
    MessagingFee globalFee3;

    function setUp() public {
        deployer = new DeployBorrowing();
        (contractsA,contractsB) = deployer.run();
        vm.deal(USER,STARTING_ETH_BALANCE);
        vm.deal(owner,STARTING_ETH_BALANCE);
        feeSetup();
    }

    function feeSetup() public {
        bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(400000, 0);
        bytes memory options2 = OptionsBuilder.newOptions().addExecutorLzReceiveOption(1200000, 0);
        bytes memory options3 = OptionsBuilder.newOptions().addExecutorLzReceiveOption(12500000, 0);

        globalFee = contractsA.global.quote(
            IGlobalVariables.FunctionToDo.UPDATE_GLOBAL, 
            IBorrowing.AssetName.DUMMY, 
            options, 
            false
        );    

        globalFee2 = contractsA.global.quote(
            IGlobalVariables.FunctionToDo(3), 
            IBorrowing.AssetName.DUMMY, 
            options2, 
            false
        );   

        globalFee3 = contractsA.global.quote(
            IGlobalVariables.FunctionToDo(5), 
            IBorrowing.AssetName.DUMMY, 
            options3, 
            false
        );   
    }

    // modifier depositInCdsA {
    //     vm.startPrank(USER);
    //     contractsA.usdt.mint(address(USER),5000000000);
    //     uint256 usdtBalance = contractsA.usdt.balanceOf(address(USER));
    //     contractsA.usdt.approve(address(contractsA.cds),usdtBalance);
    //     contractsA.cds.deposit{value:globalFee.nativeFee}(uint128(usdtBalance),0,true,uint128(usdtBalance), ETH_PRICE);
    //     vm.stopPrank();
    //     _;
    // }

    modifier depositETHInB_CdsA {
        vm.startPrank(USER);
        contractsA.usdt.mint(address(USER),5000000000);
        uint256 usdtBalance = contractsA.usdt.balanceOf(address(USER));
        contractsA.usdt.approve(address(contractsA.cds),usdtBalance);
        contractsA.cds.deposit{value:globalFee.nativeFee}(uint128(usdtBalance),0,true,uint128(usdtBalance), ETH_PRICE);
        contractsB.borrow.depositTokens{value: (ETH_AMOUNT+globalFee.nativeFee)}(
            ETH_PRICE,
            uint64(block.timestamp),
            IBorrowing.BorrowDepositParams(
                IOptions.StrikePrice.TEN,
                110000,
                ETH_VOLATILITY,
                IBorrowing.AssetName.ETH,
                ETH_AMOUNT
            )
        );

        vm.stopPrank();
        _;
    }

    function testGetEthUsdValue() public {
        console.log('treas addr', address(contractsB.treasury));
        uint256 expectedUsd = 1000e2;
        (, uint256 actualUsd) = contractsA.borrow.getUSDValue(contractsA.borrow.assetAddress(IBorrowing.AssetName.ETH));
        assertEq(expectedUsd, actualUsd);
    }

    function testGetWeethUsdValue() public {
        uint256 expectedUsd = 1100e8;
        (uint256 actualUsd,) = contractsA.borrow.getUSDValue(contractsA.borrow.assetAddress(IBorrowing.AssetName.WeETH));
        assertEq(expectedUsd, actualUsd);
    }

    function testGetRsethUsdValue() public {
        uint256 expectedUsd = 1100e8;
        (uint256 actualUsd,) = contractsA.borrow.getUSDValue(contractsA.borrow.assetAddress(IBorrowing.AssetName.rsETH));
        assertEq(expectedUsd, actualUsd);
    }

    // function testCanDepositEthInB_CdsA() public depositInCdsA{
    //     vm.startPrank(USER);
    //     uint256 expectedAmount = ((800*1e6) - contractsB.option.calculateOptionPrice(100000,50622665,ETH_AMOUNT,Options.StrikePrice.TEN));
    //     contractsB.borrow.depositTokens{value: (ETH_AMOUNT+cdsFee.nativeFee+borrowFee.nativeFee+treasuryFee.nativeFee)}(
    //         100000,uint64(block.timestamp),IOptions.StrikePrice.TEN,110000,50622665,ETH_AMOUNT);
    //     uint256 actualAmount = contractsB.usda.balanceOf(USER); 
    //     assertEq(expectedAmount,actualAmount);
    //     vm.stopPrank();
    // }

    // function testUserCantWithdrawDirectlyFromAave() public depositETH{
    //     vm.startPrank(USER);
    //     console.log("USER BALANCE AFTER DEPOSIT",USER.balance);
    //     vm.warp(block.timestamp + 360000000);

    //     uint256 balance = IERC20(aTokenAddress).balanceOf(address(USER));
    //     address poolAddress = ILendingPoolAddressesProvider(0x5E52dEc931FFb32f609681B8438A51c675cc232d/*0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e*/).getLendingPool();

    //     IERC20(aTokenAddress).approve(address(wethGateway),balance);
    //     wethGateway.withdrawETH(poolAddress,balance,address(USER));

    //     console.log("USER BALANCE AFTER AAVE WITHDRAW",USER.balance);
    //     vm.stopPrank();
    // }

    // function testUserCantWithdrawDirectlyFromCompound() public depositETH{
    //     vm.startPrank(USER);
    //     vm.roll(block.number + 100);
    //     console.log("USER BALANCE AFTER DEPOSIT",USER.balance);
    //     console.log("TREASURY BALANCE AFTER DEPOSIT",contractsA.treasury.getBalanceInTreasury());

    //     uint256 balance = cEther.balanceOf(address(contractsA.treasury));
    //     console.log(balance);
    //     contractsA.treasury.compoundWithdraw(balance);

    //     cEther.redeem(balance);
    //     console.log("USER BALANCE AFTER COMPOUND WITHDRAW",USER.balance);
    //     console.log("TREASURY BALANCE AFTER COMPOUND WITHDRAW",contractsA.treasury.getBalanceInTreasury());
    //     console.log(cEther.balanceOfUnderlying(address(USER)));
    //     vm.stopPrank();
    // }

    // function testUserCanDepositAndWithdraw() public depositETHInB_CdsA{
    //     vm.startPrank(USER);
    //     vm.warp(block.timestamp + 2592000);
    //     vm.roll(block.number + 216000);

    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.mint(address(USER),1000000000);
    //     uint256 usdaBalance = contractsB.usda.balanceOf(address(USER));

    //     contractsB.usda.approve(address(contractsB.borrow),usdaBalance);
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),1,99900,uint64(block.timestamp));

    //     assertEq(address(USER).balance, STARTING_ETH_BALANCE - (5e17 + 2*(borrowFee.nativeFee + treasuryFee.nativeFee + cdsFee.nativeFee)) );

    //     vm.stopPrank();
    // }

    // function testUserCanRedeemAbond() public depositETHInB_CdsA{
    //     vm.startPrank(USER);

    //     vm.warp(block.timestamp + 2592000);

    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.mint(address(USER),1000000000);
    //     uint256 usdaBalance = contractsB.usda.balanceOf(address(USER));

    //     contractsB.usda.approve(address(contractsB.borrow),usdaBalance);
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),1,99900,uint64(block.timestamp));

    //     contractsB.borrow.depositTokens{value: (ETH_AMOUNT+cdsFee.nativeFee+borrowFee.nativeFee+treasuryFee.nativeFee)}(
    //         100000,uint64(block.timestamp),IOptions.StrikePrice.TEN,110000,50622665,ETH_AMOUNT);

    //     vm.warp(block.timestamp + 2592000);

    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.mint(address(USER),10000000);

    //     contractsB.usda.approve(address(contractsB.borrow),contractsB.usda.balanceOf(address(USER)));
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),2,99900,uint64(block.timestamp));

    //     uint256 aTokenBalance = IERC20(aTokenAddress).balanceOf(address(contractsB.treasury));
    //     uint256 cETHbalance = CometMainInterface(cometAddress).balanceOf(address(contractsB.treasury));

    //     uint256 abondBalance = contractsB.abond.balanceOf(address(USER));
    //     contractsB.abond.approve(address(contractsB.borrow), abondBalance);
    //     uint256 withdrawAmount = contractsB.borrow.redeemYields(address(USER),uint128(abondBalance));

    //     assert((aTokenBalance + cETHbalance - withdrawAmount) <= 1e16);

    //     vm.stopPrank();
    // }

    // function testAbondDataAreStoringCorrectlyForMultipleIndex() public depositETHInB_CdsA{
    //     vm.startPrank(USER);

    //     vm.warp(block.timestamp + 2592000);
    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.mint(address(USER),10000000000);

    //     contractsB.usda.approve(address(contractsB.borrow),contractsB.usda.balanceOf(address(USER)));
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),1,99900,uint64(block.timestamp));

    //     (uint256 cR1,uint128 ethBacked1,uint128 aBondAmount1) = contractsB.abond.userStates(address(USER));

    //     contractsB.borrow.depositTokens{value: (ETH_AMOUNT+cdsFee.nativeFee+borrowFee.nativeFee+treasuryFee.nativeFee)}(
    //         100000,uint64(block.timestamp),IOptions.StrikePrice.TEN,110000,50622665,ETH_AMOUNT);

    //     (uint256 cR2,uint128 ethBacked2,) = contractsB.abond.userStatesAtDeposits(address(USER),2);

    //     vm.warp(block.timestamp + 2592000);
    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.approve(address(contractsB.borrow),contractsB.usda.balanceOf(address(USER)));
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),2,99000,uint64(block.timestamp));

    //     (uint256 cR3,uint128 ethBacked3,uint128 aBondAmount3) = contractsB.abond.userStates(address(USER));

    //     assertEq(((aBondAmount1 * cR1) + ((aBondAmount3 - aBondAmount1) * cR2))/aBondAmount3,cR3);
    //     assertEq(((aBondAmount1 * ethBacked1) + ((aBondAmount3 - aBondAmount1) * ((ethBacked2 * 1e18)/(aBondAmount3 - aBondAmount1))))/aBondAmount3,ethBacked3);

    //     vm.stopPrank();
    // }

    // function testAbondDataAreStoringCorrectlyForOneTransfer() public depositETHInB_CdsA{
    //     vm.startPrank(USER);
    //     (uint256 cR1d,uint128 ethBacked1d,uint128 abondBalance1d) = contractsB.abond.userStatesAtDeposits(address(USER),1);

    //     vm.warp(block.timestamp + 2592000);
    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.mint(address(USER),1000000000);

    //     contractsB.usda.approve(address(contractsB.borrow),contractsB.usda.balanceOf(address(USER)));
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),1,99900,uint64(block.timestamp));
    //     (uint256 cR1w,uint128 ethBacked1w,uint128 abondBalance1w) = contractsB.abond.userStates(address(USER));

    //     contractsB.borrow.depositTokens{value: (ETH_AMOUNT+cdsFee.nativeFee+borrowFee.nativeFee+treasuryFee.nativeFee)}(
    //         100000,uint64(block.timestamp),IOptions.StrikePrice.TEN,110000,50622665,ETH_AMOUNT);
    //     (uint256 cR2d,uint128 ethBacked2d,uint128 abondBalance2d) = contractsB.abond.userStatesAtDeposits(address(USER),2);

    //     vm.warp(block.timestamp + 2592000);
    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.approve(address(contractsB.borrow),contractsB.usda.balanceOf(address(USER)));
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),2,99000,uint64(block.timestamp));
    //     (uint256 cR2w,uint128 ethBacked2w,uint128 abondBalance2w) = contractsB.abond.userStates(address(USER));

    //     contractsB.abond.transfer(owner,(contractsB.abond.balanceOf(address(USER)) * 50)/100);

    //     (uint256 cR1,uint128 ethBacked1,uint128 aBondAmount1) = contractsB.abond.userStates(address(USER));
    //     (uint256 cR2,uint128 ethBacked2,uint128 aBondAmount2) = contractsB.abond.userStates(owner);

    //     assertEq(cR2,cR1);
    //     assertEq(aBondAmount1,aBondAmount2);
    //     assertEq(ethBacked1,ethBacked2);

    //     vm.stopPrank();
    // }

    // function testAbondDataAreStoringCorrectlyForMultipleTransfers() public depositETHInB_CdsA{
    //     vm.startPrank(USER);
    //     (uint256 cR1d,uint128 ethBacked1d,uint128 abondBalance1d) = contractsB.abond.userStatesAtDeposits(address(USER),1);

    //     vm.warp(block.timestamp + 2592000);
    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.mint(address(USER),1000000000);

    //     contractsB.usda.approve(address(contractsB.borrow),contractsB.usda.balanceOf(address(USER)));
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),1,99900,uint64(block.timestamp));
    //     (uint256 cR1w,uint128 ethBacked1w,uint128 abondBalance1w) = contractsB.abond.userStates(address(USER));

    //     contractsB.borrow.depositTokens{value: (ETH_AMOUNT+cdsFee.nativeFee+borrowFee.nativeFee+treasuryFee.nativeFee)}(
    //         100000,uint64(block.timestamp),IOptions.StrikePrice.TEN,110000,50622665,ETH_AMOUNT);
    //     (uint256 cR2d,uint128 ethBacked2d,uint128 abondBalance2d) = contractsB.abond.userStatesAtDeposits(address(USER),2);

    //     vm.warp(block.timestamp + 2592000);
    //     contractsB.borrow.calculateCumulativeRate();

    //     contractsB.usda.approve(address(contractsB.borrow),contractsB.usda.balanceOf(address(USER)));
    //     contractsB.borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(address(USER),2,100000,uint64(block.timestamp));
    //     (uint256 cR2w,uint128 ethBacked2w,uint128 abondBalance2w) = contractsB.abond.userStates(address(USER));

    //     contractsB.abond.transfer(owner,(contractsB.abond.balanceOf(address(USER)) * 50)/100);
    //     vm.warp(block.timestamp + 2592000);

    //     (uint256 cR1,uint128 ethBacked1,uint128 aBondAmount1) = contractsB.abond.userStates(address(USER));
    //     (uint256 cR2,uint128 ethBacked2,uint128 aBondAmount2) = contractsB.abond.userStates(owner);

    //     uint256 aTokenBalance = IERC20(aTokenAddress).balanceOf(address(contractsB.treasury));
    //     uint256 cETHbalance = CometMainInterface(cometAddress).balanceOf(address(contractsB.treasury));

    //     contractsB.abond.approve(address(contractsB.borrow), aBondAmount1);
    //     uint256 withdrawAmount1 = contractsB.borrow.redeemYields(address(USER),uint128(aBondAmount1));
    //     vm.stopPrank();

    //     vm.startPrank(owner);
    //     contractsB.abond.approve(address(contractsB.borrow), aBondAmount2);
    //     uint256 withdrawAmount2 = contractsB.borrow.redeemYields(owner,uint128(aBondAmount2));

    //     assertEq(cR1,cR2);
    //     assertEq(aBondAmount1,aBondAmount2);
    //     assertEq(ethBacked1,ethBacked2);

    //     vm.stopPrank();
    // }


    function testWeETHSwap() public {
        vm.startPrank(USER);
        contractsA.usdt.mint(address(USER),5000000000);
        uint256 usdtBalance = contractsA.usdt.balanceOf(address(USER));
        contractsA.usdt.approve(address(contractsA.cds),usdtBalance);
        contractsA.cds.deposit{value:globalFee.nativeFee}(uint128(usdtBalance),0,true,uint128(usdtBalance), ETH_PRICE);
        address weethAddressInMode = 0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A;

        deal(weethAddressInMode, USER, 1 ether);
        IERC20(weethAddressInMode).approve(address(contractsB.borrow), 1 ether);
        contractsB.borrow.depositTokens{value: globalFee.nativeFee}(
            ETH_PRICE,
            uint64(block.timestamp),
            IBorrowing.BorrowDepositParams(
                IOptions.StrikePrice.TEN,
                110000,
                ETH_VOLATILITY,
                IBorrowing.AssetName.WeETH,
                ETH_AMOUNT
            )
        );

        // vm.warp(block.timestamp + 2592000);
        // vm.roll(block.number + 216000);

        contractsB.usda.mint(USER, 150e6);
        // uint256 currentCumulativeRate = contractsB.borrow.calculateCumulativeRate();
        uint256 tokenBalance = contractsB.usda.balanceOf(USER);
        contractsB.usda.approve(address(contractsB.borrow),tokenBalance);
        vm.deal(USER,globalFee2.nativeFee);
        bytes memory odosData = hex"83bd37f9000104c0599ae5a44757c0af6f9ec3b93da8976c150a0001f0f161fda2712db8b566946122a5af183995e2ed0801280f39a348555204118af2f200c49b00019b57DcA972Db5D8866c630554AcdbDfE58b2659c000153E85d00F2C6578a1205b842255AB9DF9D053744000147E2D28169738039755586743E2dfCF3bd643f860000000004010205000501000001020102060001030401ff0000000000000000000000000053e85d00f2c6578a1205b842255ab9df9d05374404c0599ae5a44757c0af6f9ec3b93da8976c150ad8abc2be7ad5d17940112969973357a3a3562998420000000000000000000000000000000000000600000000000000000000000000000000";

        contractsB.borrow.withDraw{value: globalFee2.nativeFee}(
            USER,
            1,
            odosData,
            "0x",
            120000,
            uint64(block.timestamp)
        );
    }

    function testWithdrawLiquidatedWrsETH() public {
        vm.startPrank(USER);
        contractsA.usdt.mint(address(USER),5000000000);
        uint256 usdtBalance = contractsA.usdt.balanceOf(address(USER));
        contractsA.usdt.approve(address(contractsA.cds),usdtBalance);
        contractsA.cds.deposit{value:globalFee.nativeFee}(uint128(usdtBalance),0,true,uint128(usdtBalance), ETH_PRICE);
        address wrsETHAddressInMode = 0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd;
        address rsETHAddressInMode = 0x4186BFC76E2E237523CBC30FD220FE055156b41F;

        deal(wrsETHAddressInMode, USER, 1 ether);
        IERC20(wrsETHAddressInMode).approve(address(contractsB.borrow), 1 ether);
        contractsB.borrow.depositTokens{value: globalFee.nativeFee}(
            ETH_PRICE,
            uint64(block.timestamp),
            IBorrowing.BorrowDepositParams(
                IOptions.StrikePrice.TEN,
                110000,
                ETH_VOLATILITY,
                IBorrowing.AssetName.WrsETH,
                ETH_AMOUNT
            )
        );

        vm.stopPrank();
        vm.startPrank(owner);

        contractsB.borrow.liquidate{value: globalFee2.nativeFee}(
            USER,
            1,
            800e2,
            IBorrowing.LiquidationType.ONE
        );

        vm.stopPrank();
        vm.startPrank(USER);
        contractsA.cds.withdraw{value: globalFee3.nativeFee}(1,1000e2,0,1,"0x");
        vm.stopPrank();
    }

    function testAbleToWrapRsETH() public {
        vm.startPrank(USER);
        address wrsETHAddressInMode = 0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd;
        address rsETHAddressInMode = 0x4186BFC76E2E237523CBC30FD220FE055156b41F;

        deal(rsETHAddressInMode, USER, 1 ether);
        IERC20(rsETHAddressInMode).approve(wrsETHAddressInMode, 1 ether);

        console.log("rsETH bal before deposit", IERC20(rsETHAddressInMode).balanceOf(USER));
        console.log("wrsETH bal before deposit", IERC20(wrsETHAddressInMode).balanceOf(USER));

        IWrsETH(wrsETHAddressInMode).deposit(
            rsETHAddressInMode, 1 ether
        );

        console.log("rsETH bal after deposit", IERC20(rsETHAddressInMode).balanceOf(USER));
        console.log("wrsETH bal after deposit", IERC20(wrsETHAddressInMode).balanceOf(USER));

        IERC20(wrsETHAddressInMode).approve(wrsETHAddressInMode, 1 ether);
        IWrsETH(wrsETHAddressInMode).withdraw(
            rsETHAddressInMode, 1 ether
        );

        console.log("rsETH bal after withdraw", IERC20(rsETHAddressInMode).balanceOf(USER));
        console.log("wrsETH bal after withdraw", IERC20(wrsETHAddressInMode).balanceOf(USER));
    }
}
