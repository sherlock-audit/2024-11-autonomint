// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {BorrowingTest} from "../../../contracts/TestContracts/CopyBorrowing.sol";
import {Treasury} from "../../../contracts/Core_logic/Treasury.sol";
import {CDSTest} from "../../../contracts/TestContracts/CopyCDS.sol";
import {Options} from "../../../contracts/Core_logic/Options.sol";
import {MultiSign} from "../../../contracts/Core_logic/multiSign.sol";
import {TestUSDaStablecoin} from "../../../contracts/TestContracts/CopyUSDa.sol";
import {TestABONDToken} from "../../../contracts/TestContracts/Copy_Abond_Token.sol";
import {TestUSDT} from "../../../contracts/TestContracts/CopyUsdt.sol";
import {ITreasury} from "../../../contracts/interface/ITreasury.sol";
import {IOptions} from "../../../contracts/interface/IOptions.sol";
import {DeployBorrowing} from "../../../scripts/script/DeployBorrowing.s.sol";
import { MessagingFee } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {IBorrowing} from "../../../contracts/interface/IBorrowing.sol";
import {CDSInterface} from "../../../contracts/interface/CDSInterface.sol";
import {IGlobalVariables} from "../../../contracts/interface/IGlobalVariables.sol";

contract Handler1 is Test{
    DeployBorrowing.Contracts contractsA;
    DeployBorrowing.Contracts contractsB;
    uint256 MAX_DEPOSIT = type(uint96).max;
    uint public withdrawCalled;

    address public owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public user = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    using OptionsBuilder for bytes;
    MessagingFee globalFee;
    MessagingFee globalFee2;
    MessagingFee globalFee3;

    uint256 public ETH_VOLATILITY = 50622665;

    constructor(
        DeployBorrowing.Contracts memory _contractsA,
        DeployBorrowing.Contracts memory _contractsB)
    {
        contractsA = _contractsA;
        contractsB = _contractsB;
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

    function depositBorrowingA(uint128 amount, uint64 ethPrice, uint8 strikePricePercent, uint8 asset) public {
        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();
        if(omniChainData.totalCdsDepositedAmount == 0){
            return;
        }
        vm.deal(user,type(uint128).max);
        amount = uint128(bound(amount,0,MAX_DEPOSIT));
        asset = uint8(bound(asset,1,3));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        strikePricePercent = uint8(bound(strikePricePercent,0,type(uint8).max));

        if(strikePricePercent == 0 || strikePricePercent > 4){
            return;
        }

        if(amount == 0 || amount < 1e13){
            return;
        }

        if(ethPrice <= 3500){
            return;
        }

        uint256 ratio = (omniChainData.cdsPoolValue * 1e17) / 
                        (omniChainData.totalVolumeOfBorrowersAmountinUSD + amount * ethPrice);

        if(ratio < 200){
            return;
        }
        uint64 strikePrice = uint64(ethPrice + (ethPrice * ((strikePricePercent*5) + 5))/100);
        uint256 tokensToLend = (80 * amount * ethPrice) / 1e16;
        uint256 optionsFees = contractsA.option.calculateOptionPrice(
            ethPrice,
            ETH_VOLATILITY,
            amount,
            IOptions.StrikePrice(strikePricePercent)
        );
        if(optionsFees >= tokensToLend){
            return;
        }

        vm.startPrank(user);
        uint256 ethValueToSend;
        if(asset == 2){
            contractsA.weeth.mint(user, amount);
            contractsA.weeth.approve(address(contractsA.borrow), amount);
        }else if(asset == 3) {
            contractsA.rseth.mint(user, amount);
            contractsA.rseth.approve(address(contractsA.borrow), amount);
        }else if (asset == 1){
            ethValueToSend = amount;
        }
        
        contractsA.borrow.depositTokens{value: ethValueToSend + globalFee.nativeFee}(
            ethPrice,
            uint64(block.timestamp),
            IBorrowing.BorrowDepositParams(
                IOptions.StrikePrice(strikePricePercent),
                strikePrice,
                ETH_VOLATILITY,
                IBorrowing.AssetName(asset),
                amount
            )
        );
        vm.stopPrank();
    }

    function depositBorrowingB(uint128 amount, uint64 ethPrice, uint8 strikePricePercent, uint8 asset) public { 
        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();
        if(omniChainData.totalCdsDepositedAmount == 0){
            return;
        }
        vm.deal(user,type(uint128).max);
        amount = uint128(bound(amount,0,MAX_DEPOSIT));
        asset = uint8(bound(asset,1,3));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        strikePricePercent = uint8(bound(strikePricePercent,0,type(uint8).max));

        if(strikePricePercent == 0 || strikePricePercent > 4){
            return;
        }

        if(amount == 0 || amount < 1e13){
            return;
        }

        if(ethPrice <= 3500){
            return;
        }

        uint256 ratio = (omniChainData.cdsPoolValue * 1e17) / 
                        (omniChainData.totalVolumeOfBorrowersAmountinUSD + amount * ethPrice);

        if(ratio < 200){
            return;
        }
        uint64 strikePrice = uint64(ethPrice + (ethPrice * ((strikePricePercent*5) + 5))/100);
        uint256 tokensToLend = (80 * amount * ethPrice) / 1e16;
        uint256 optionsFees = contractsB.option.calculateOptionPrice(
            ethPrice,
            ETH_VOLATILITY,
            amount,
            IOptions.StrikePrice(strikePricePercent)
        );
        if(optionsFees >= tokensToLend){
            return;
        }
        vm.startPrank(user);
        uint256 ethValueToSend;
        if(asset == 2){
            contractsB.weeth.mint(user, amount);
            contractsB.weeth.approve(address(contractsB.borrow), amount);
        }else if(asset == 3) {
            contractsB.rseth.mint(user, amount);
            contractsB.rseth.approve(address(contractsB.borrow), amount);
        }else if(asset == 1){
            ethValueToSend = amount;
        }
        contractsB.borrow.depositTokens{value: ethValueToSend+globalFee.nativeFee}(
            ethPrice,
            uint64(block.timestamp),
            IBorrowing.BorrowDepositParams(
                IOptions.StrikePrice(strikePricePercent),
                strikePrice,
                ETH_VOLATILITY,
                IBorrowing.AssetName(asset),
                amount
            )
        );
        vm.stopPrank();
    }

    function withdrawBorrowingA(uint64 index, uint64 ethPrice) public{
        (,,,,uint64 maxIndex) = contractsA.treasury.borrowing(user);
        index = uint64(bound(index,0,maxIndex));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));
        // uint64 ethPrice = uint64(contractsA.borrow.getUSDValue());

        if(index == 0){
            return;
        }

        Treasury.GetBorrowingResult memory getBorrowingResult = contractsA.treasury.getBorrowing(user,index);
        Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;

        if(depositDetail.withdrawed){
            return;
        }

        if(depositDetail.liquidated){
            return;
        }

        if(ethPrice <= (depositDetail.ethPriceAtDeposit * 80)/100 || 
            ethPrice > ((contractsA.borrow.lastEthprice() * 105)/100) ||
            ethPrice < ((contractsA.borrow.lastEthprice() * 95)/100)){
            return;
        }

        vm.warp(block.timestamp + 2592000);
        vm.roll(block.number + 216000);

        uint256 currentCumulativeRate = contractsA.borrow.calculateCumulativeRate();
        uint256 tokenBalance = contractsA.usda.balanceOf(user);

        if((currentCumulativeRate*depositDetail.normalizedAmount)/1e27 > tokenBalance){
            return;
        }

        vm.startPrank(user);
        contractsA.usda.approve(address(contractsA.borrow),tokenBalance);
        vm.deal(user, globalFee2.nativeFee);
        bytes memory odosData = hex"83bd37f9000104c0599ae5a44757c0af6f9ec3b93da8976c150a0001f0f161fda2712db8b566946122a5af183995e2ed0801280f39a348555204118af2f200c49b00019b57DcA972Db5D8866c630554AcdbDfE58b2659c000153E85d00F2C6578a1205b842255AB9DF9D053744000147E2D28169738039755586743E2dfCF3bd643f860000000004010205000501000001020102060001030401ff0000000000000000000000000053e85d00f2c6578a1205b842255ab9df9d05374404c0599ae5a44757c0af6f9ec3b93da8976c150ad8abc2be7ad5d17940112969973357a3a3562998420000000000000000000000000000000000000600000000000000000000000000000000";
        contractsA.borrow.withDraw{value:globalFee2.nativeFee}(
            user,
            index,
            odosData,
            "0x",
            ethPrice,uint64(block.timestamp));
        vm.stopPrank();
    }

    function withdrawBorrowingB(uint64 index, uint64 ethPrice) public{
        (,,,,uint64 maxIndex) = contractsB.treasury.borrowing(user);
        index = uint64(bound(index,0,maxIndex));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        // uint64 ethPrice = uint64(contractsB.borrow.getUSDValue());

        if(index == 0){
            return;
        }

        Treasury.GetBorrowingResult memory getBorrowingResult = contractsB.treasury.getBorrowing(user,index);
        Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;

        if(depositDetail.withdrawed){
            return;
        }

        if(depositDetail.liquidated){
            return;
        }

        if(ethPrice <= (depositDetail.ethPriceAtDeposit * 80)/100 || 
            ethPrice > ((contractsB.borrow.lastEthprice() * 105)/100) || 
            ethPrice < ((contractsB.borrow.lastEthprice() * 95)/100)){
            return;
        }

        vm.warp(block.timestamp + 2592000);
        vm.roll(block.number + 216000);

        uint256 currentCumulativeRate = contractsB.borrow.calculateCumulativeRate();
        uint256 tokenBalance = contractsB.usda.balanceOf(user);

        if((currentCumulativeRate*depositDetail.normalizedAmount)/1e27 > tokenBalance){
            return;
        }

        vm.startPrank(user);
        contractsB.usda.approve(address(contractsB.borrow),tokenBalance);
        vm.deal(user,globalFee2.nativeFee);
        // Odos assembled data
        bytes memory odosData = hex"83bd37f9000104c0599ae5a44757c0af6f9ec3b93da8976c150a0001f0f161fda2712db8b566946122a5af183995e2ed0801280f39a348555204118af2f200c49b00019b57DcA972Db5D8866c630554AcdbDfE58b2659c000153E85d00F2C6578a1205b842255AB9DF9D053744000147E2D28169738039755586743E2dfCF3bd643f860000000004010205000501000001020102060001030401ff0000000000000000000000000053e85d00f2c6578a1205b842255ab9df9d05374404c0599ae5a44757c0af6f9ec3b93da8976c150ad8abc2be7ad5d17940112969973357a3a3562998420000000000000000000000000000000000000600000000000000000000000000000000";
        contractsB.borrow.withDraw{value: globalFee2.nativeFee}(
            user,
            index,
            odosData,
            "0x",ethPrice,uint64(block.timestamp));
        vm.stopPrank();
    }

    function depositCDSA(uint128 usdtToDeposit,uint128 usdaToDeposit,uint64 ethPrice) public {

        usdtToDeposit = uint128(bound(usdtToDeposit,0,type(uint64).max));
        usdaToDeposit = uint128(bound(usdaToDeposit,0,type(uint64).max));

        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        if(ethPrice <= 3500 || ethPrice > (contractsA.cds.lastEthPrice() * 105)/100 || 
            ethPrice < (contractsA.cds.lastEthPrice() * 95)/100){
            return;
        }

        if(usdaToDeposit == 0){
            return;
        }

        if(usdtToDeposit == 0 || usdtToDeposit > 20000000000){
            return;
        }

        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();

        if((omniChainData.usdtAmountDepositedTillNow + usdtToDeposit) > contractsA.cds.usdtLimit()){
            return;
        }    

        if((omniChainData.usdtAmountDepositedTillNow + usdtToDeposit) <= contractsA.cds.usdtLimit()){
            usdaToDeposit = 0;
        }    

        if((omniChainData.usdtAmountDepositedTillNow) == contractsA.cds.usdtLimit()){
            usdaToDeposit = (usdaToDeposit * 80)/100;
            usdtToDeposit = (usdaToDeposit * 20)/100;
        }

        if((usdaToDeposit + usdtToDeposit) < 100000000){
            return;
        }

        uint256 liquidationAmount = ((usdaToDeposit + usdtToDeposit) * 50)/100;

        if(contractsA.usda.balanceOf(user) < usdaToDeposit){
            return;
        }
        vm.startPrank(user);

        contractsA.usdt.mint(user,usdtToDeposit);
        contractsA.usdt.approve(address(contractsA.cds),usdtToDeposit);
        contractsA.usda.approve(address(contractsA.cds),usdaToDeposit);
        vm.deal(user,globalFee.nativeFee);
        contractsA.cds.deposit{value:globalFee.nativeFee}(usdtToDeposit,usdaToDeposit,true,uint128(liquidationAmount),ethPrice);

        vm.stopPrank();
    }

    function depositCDSB(uint128 usdtToDeposit,uint128 usdaToDeposit,uint64 ethPrice) public {

        usdtToDeposit = uint128(bound(usdtToDeposit,0,type(uint64).max));
        usdaToDeposit = uint128(bound(usdaToDeposit,0,type(uint64).max));

        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));
        if(ethPrice <= 3500 || ethPrice > (contractsB.cds.lastEthPrice() * 105)/100 || 
            ethPrice < (contractsB.cds.lastEthPrice() * 95)/100){
            return;
        }

        if(usdaToDeposit == 0){
            return;
        }

        if(usdtToDeposit == 0 || usdtToDeposit > 20000000000){
            return;
        }

        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();

        if((omniChainData.usdtAmountDepositedTillNow + usdtToDeposit) > contractsB.cds.usdtLimit()){
            return;
        }    

        if((omniChainData.usdtAmountDepositedTillNow + usdtToDeposit) <= contractsB.cds.usdtLimit()){
            usdaToDeposit = 0;
        }    

        if((omniChainData.usdtAmountDepositedTillNow) == contractsB.cds.usdtLimit()){
            usdaToDeposit = (usdaToDeposit * 80)/100;
            usdtToDeposit = (usdaToDeposit * 20)/100;
        }

        if((usdaToDeposit + usdtToDeposit) < 100000000){
            return;
        }

        uint256 liquidationAmount = ((usdaToDeposit + usdtToDeposit) * 50)/100;

        if(contractsB.usda.balanceOf(user) < usdaToDeposit){
            return;
        }
        vm.startPrank(user);

        contractsB.usdt.mint(user,usdtToDeposit);
        contractsB.usdt.approve(address(contractsB.cds),usdtToDeposit);
        contractsB.usda.approve(address(contractsB.cds),usdaToDeposit);
        vm.deal(user,globalFee.nativeFee);
        contractsB.cds.deposit{value:globalFee.nativeFee}(usdtToDeposit,usdaToDeposit,true,uint128(liquidationAmount),ethPrice);

        vm.stopPrank();
    }

    function withdrawCDSA(uint64 index,uint64 ethPrice) public{
        (uint64 maxIndex,) = contractsA.cds.cdsDetails(user);
        index = uint64(bound(index,0,maxIndex));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        if(ethPrice <= 3500 || ethPrice > (contractsA.cds.lastEthPrice() * 105)/100 || 
            ethPrice < (contractsA.cds.lastEthPrice() * 95)/100){
            return;
        }
        if(index == 0){
            return;
        }

        (CDSInterface.CdsAccountDetails memory accDetails,) = contractsA.cds.getCDSDepositDetails(user,index);
        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();

        if(accDetails.withdrawed){
            return;
        }
        if(omniChainData.totalCdsDepositedAmount >= accDetails.depositedAmount){
            if((omniChainData.totalCdsDepositedAmount - accDetails.depositedAmount) == 0){
                return;
            }
        }

        vm.startPrank(user);
        vm.deal(user,globalFee3.nativeFee);
        contractsA.cds.withdraw{value: globalFee3.nativeFee}(index,ethPrice,0,1,"0x");

        vm.stopPrank();
    }

    function withdrawCDSB(uint64 index,uint64 ethPrice) public{
        (uint64 maxIndex,) = contractsB.cds.cdsDetails(user);
        index = uint64(bound(index,0,maxIndex));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        if(ethPrice <= 3500 || ethPrice > (contractsB.cds.lastEthPrice() * 105)/100 || 
            ethPrice < (contractsB.cds.lastEthPrice() * 95)/100){
            return;
        }
        if(index == 0){
            return;
        }

        (CDSInterface.CdsAccountDetails memory accDetails,) = contractsB.cds.getCDSDepositDetails(user,index);
        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();

        if(accDetails.withdrawed){
            return;
        }
        if(omniChainData.totalCdsDepositedAmount >= accDetails.depositedAmount){
            if((omniChainData.totalCdsDepositedAmount - accDetails.depositedAmount) == 0){
                return;
            }
        }
        vm.startPrank(user);
        vm.deal(user,globalFee3.nativeFee);
        contractsB.cds.withdraw{value: globalFee3.nativeFee}(index,ethPrice,0,1,"0x");

        vm.stopPrank();
    }

    function liquidationA(uint64 index,uint64 ethPrice) public{
        (,,,,uint64 maxIndex) = contractsA.treasury.borrowing(user);
        index = uint64(bound(index,0,maxIndex));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        if(ethPrice == 0){
            return;
        }
        if(index == 0){
            return;
        }

        ITreasury.GetBorrowingResult memory getBorrowingResult = contractsA.treasury.getBorrowing(user,index);
        ITreasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;
        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();

        if(depositDetail.liquidated || depositDetail.withdrawed){
            return;
        }

        if(ethPrice > ((depositDetail.ethPriceAtDeposit * 80)/100)){
            return;
        }
        if((ethPrice * depositDetail.depositedAmount) > omniChainData.totalAvailableLiquidationAmount){
            return;
        }
        vm.warp(block.timestamp + 2592000);
        vm.roll(block.number + 216000);

        vm.startPrank(owner);
        vm.deal(owner,globalFee2.nativeFee);
        contractsA.borrow.liquidate{value: globalFee2.nativeFee}(user,index,ethPrice,IBorrowing.LiquidationType.ONE);
        vm.stopPrank();
    }

    function liquidationB(uint64 index,uint64 ethPrice) public{
        (,,,,uint64 maxIndex) = contractsB.treasury.borrowing(user);
        index = uint64(bound(index,0,maxIndex));
        ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

        if(ethPrice == 0){
            return;
        }
        if(index == 0){
            return;
        }

        ITreasury.GetBorrowingResult memory getBorrowingResult = contractsB.treasury.getBorrowing(user,index);
        ITreasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;
        IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();

        if(depositDetail.liquidated || depositDetail.withdrawed){
            return;
        }

        if(ethPrice > ((depositDetail.ethPriceAtDeposit * 80)/100)){
            return;
        }
        if((ethPrice * depositDetail.depositedAmount) > omniChainData.totalAvailableLiquidationAmount){
            return;
        }
        vm.warp(block.timestamp + 2592000);
        vm.roll(block.number + 216000);

        vm.startPrank(owner);
        vm.deal(owner,globalFee2.nativeFee);
        contractsB.borrow.liquidate{value: globalFee2.nativeFee}(user,index,ethPrice,IBorrowing.LiquidationType.ONE);
        vm.stopPrank();
    }

    function renewOptionsA(uint64 index) public{
        (,,,,uint64 maxIndex) = contractsA.treasury.borrowing(user);
        index = uint64(bound(index,0,maxIndex));

        if(index == 0 || index > maxIndex){
            return;
        }

        Treasury.GetBorrowingResult memory getBorrowingResult = contractsA.treasury.getBorrowing(user,index);
        Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;  

        if(depositDetail.withdrawed){
            return;
        }

        if(depositDetail.liquidated){
            return;
        }
        vm.startPrank(user);
        vm.warp(block.timestamp + 2592000);
        uint256 optionsFees = contractsA.borrow.getOptionFeesToPay(index);
        if(optionsFees > contractsA.usda.balanceOf(user)){
            return;
        }
        contractsA.usda.approve(address(contractsA.borrow), optionsFees);
        vm.deal(user, globalFee.nativeFee);
        contractsA.borrow.renewOptions{value: globalFee.nativeFee}(index);
        vm.stopPrank();
    }

    function renewOptionsB(uint64 index) public{
        (,,,,uint64 maxIndex) = contractsB.treasury.borrowing(user);
        index = uint64(bound(index,0,maxIndex));

        if(index == 0 || index > maxIndex){
            return;
        }

        Treasury.GetBorrowingResult memory getBorrowingResult = contractsB.treasury.getBorrowing(user,index);
        Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;  

        if(depositDetail.withdrawed){
            return;
        }

        if(depositDetail.liquidated){
            return;
        }

        vm.startPrank(user);
        vm.warp(block.timestamp + 2592000);
        uint256 optionsFees = contractsB.borrow.getOptionFeesToPay(index);
        if(optionsFees > contractsB.usda.balanceOf(user)){
            return;
        }
        contractsB.usda.approve(address(contractsB.borrow), optionsFees);
        vm.deal(user, globalFee.nativeFee);
        contractsB.borrow.renewOptions{value: globalFee.nativeFee}(index);
        vm.stopPrank();
    }
}