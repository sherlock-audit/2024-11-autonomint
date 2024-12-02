// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {Test,console} from "forge-std/Test.sol";
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

contract Handler is Test{
    DeployBorrowing.Contracts contractsA;
    DeployBorrowing.Contracts contractsB;
    uint256 MAX_DEPOSIT = type(uint96).max;
    uint public withdrawCalled;

    address public owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public user = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    using OptionsBuilder for bytes;
    MessagingFee globalFee;

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

        globalFee = contractsA.global.quote(
            IGlobalVariables.FunctionToDo.UPDATE_GLOBAL, 
            IBorrowing.AssetName.DUMMY, 
            options, 
            false
        );
    }

    // function depositBorrowing(uint128 amount,uint64 ethPrice,uint8 strikePricePercent) public { 
    //     if(cds.totalCdsDepositedAmount() == 0){
    //         return;
    //     }
    //     vm.deal(user,type(uint128).max);
    //     amount = uint128(bound(amount,0,MAX_DEPOSIT));
    //     ethPrice = uint64(bound(ethPrice,0,type(uint24).max));
    //     strikePricePercent = uint8(bound(strikePricePercent,0,type(uint8).max));

    //     if(ethPrice <= 3500){
    //         return;
    //     }

    //     if(strikePricePercent == 0 || strikePricePercent > 4){
    //         return;
    //     }

    //     if(amount == 0 || amount < 1e13){
    //         return;
    //     }

    //     uint64 ratio = borrow.calculateRatio(amount,ethPrice);

    //     if(ratio < 20000){
    //         return;
    //     }
    //     uint64 strikePrice = uint64(ethPrice + (ethPrice * ((strikePricePercent*5) + 5))/100);

    //     // depositCDS(uint128((((amount * ethPrice)/1e12)*25)/100),ethPrice);
    //     vm.startPrank(user);
    //     borrow.depositTokens{value: (amount+cdsFee.nativeFee+borrowFee.nativeFee+treasuryFee.nativeFee)}(
    //         ethPrice,
    //         uint64(block.timestamp),
    //         IOptions.StrikePrice(strikePricePercent),
    //         strikePrice,
    //         50622665,
    //         amount);
    //     vm.stopPrank();
    // }

    // function withdrawBorrowing(uint64 index,uint64 ethPrice) public{
    //     (,,,,uint64 maxIndex) = treasury.borrowing(user);
    //     index = uint64(bound(index,0,maxIndex));
    //     ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

    //     if(index == 0){
    //         return;
    //     }

    //     Treasury.GetBorrowingResult memory getBorrowingResult = treasury.getBorrowing(user,index);
    //     Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;

    //     if(depositDetail.withdrawed){
    //         return;
    //     }

    //     if(depositDetail.liquidated){
    //         return;
    //     }

    //     if(ethPrice <= (depositDetail.ethPriceAtDeposit * 80)/100){
    //         return;
    //     }

    //     uint256 currentCumulativeRate = borrow.calculateCumulativeRate();
    //     uint256 tokenBalance = usda.balanceOf(user);

    //     if((currentCumulativeRate*depositDetail.normalizedAmount)/1e27 > tokenBalance){
    //         return;
    //     }

    //     vm.startPrank(user);
    //     usda.approve(address(borrow),tokenBalance);

    //     borrow.withDraw{value:(borrowFee.nativeFee + treasuryFee.nativeFee)}(user,index,ethPrice,uint64(block.timestamp));
    //     vm.stopPrank();
    // }

    // function depositCDS(uint128 usdtToDeposit,uint128 usdaToDeposit,uint64 ethPrice) public {

    //     usdtToDeposit = uint128(bound(usdtToDeposit,0,type(uint64).max));
    //     usdaToDeposit = uint128(bound(usdaToDeposit,0,type(uint64).max));

    //     ethPrice = uint64(bound(ethPrice,0,type(uint24).max));
    //     if(ethPrice <= 3500){
    //         return;
    //     }

    //     if(usdaToDeposit == 0){
    //         return;
    //     }

    //     if(usdtToDeposit == 0 || usdtToDeposit > 20000000000){
    //         return;
    //     }

    //     if((cds.usdtAmountDepositedTillNow() + usdtToDeposit) > cds.usdtLimit()){
    //         return;
    //     }    

    //     if((cds.usdtAmountDepositedTillNow() + usdtToDeposit) <= cds.usdtLimit()){
    //         usdaToDeposit = 0;
    //     }    

    //     if((cds.usdtAmountDepositedTillNow()) == cds.usdtLimit()){
    //         usdaToDeposit = (usdaToDeposit * 80)/100;
    //         usdtToDeposit = (usdaToDeposit * 20)/100;
    //     }

    //     if((usdaToDeposit + usdtToDeposit) < 100000000){
    //         return;
    //     }

    //     uint256 liquidationAmount = ((usdaToDeposit + usdtToDeposit) * 50)/100;

    //     if(usda.balanceOf(user) < usdaToDeposit){
    //         return;
    //     }
    //     vm.startPrank(user);

    //     usdt.mint(user,usdtToDeposit);
    //     usdt.approve(address(cds),usdtToDeposit);
    //     usda.approve(address(cds),usdaToDeposit);

    //     cds.deposit{value:cdsFee.nativeFee}(usdtToDeposit,usdaToDeposit,true,uint128(liquidationAmount),ethPrice);

    //     vm.stopPrank();
    // }

    // function withdrawCDS(uint64 index,uint64 ethPrice) public{
    //     (uint64 maxIndex,) = cds.cdsDetails(user);
    //     index = uint64(bound(index,0,maxIndex));
    //     ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

    //     if(ethPrice <= 3500 || ethPrice > (cds.lastEthPrice() * 5)/100){
    //         return;
    //     }
    //     if(index == 0){
    //         return;
    //     }

    //     (CDSTest.CdsAccountDetails memory accDetails,) = cds.getCDSDepositDetails(user,index);

    //     if(accDetails.withdrawed){
    //         return;
    //     }
    //     vm.startPrank(user);

    //     cds.withdraw(index,ethPrice);

    //     vm.stopPrank();
    // }

    // function liquidation(uint64 index,uint64 ethPrice) public{
    //     (,,,,uint64 maxIndex) = treasury.borrowing(user);
    //     index = uint64(bound(index,0,maxIndex));
    //     ethPrice = uint64(bound(ethPrice,0,type(uint24).max));

    //     if(ethPrice == 0){
    //         return;
    //     }
    //     if(index == 0){
    //         return;
    //     }

    //     Treasury.GetBorrowingResult memory getBorrowingResult = treasury.getBorrowing(user,index);
    //     Treasury.DepositDetails memory depositDetail = getBorrowingResult.depositDetails;

    //     if(depositDetail.liquidated){
    //         return;
    //     }

    //     if(ethPrice > ((depositDetail.ethPriceAtDeposit * 80)/100)){
    //         return;
    //     }
    //     vm.startPrank(owner);
    //     borrow.liquidate(user,index,ethPrice);
    //     vm.stopPrank();
    // }

    // function redeemUSDT(uint128 amount,uint16 usdaPrice,uint16 usdtPrice) public {
    //     amount = uint128(bound(amount,0,type(uint64).max));
    //     usdaPrice = uint16(bound(usdaPrice,0,1200));
    //     usdtPrice = uint16(bound(usdaPrice,0,1200));

    //     if(amount == 0 || usdaPrice == 0 || usdtPrice == 0){
    //         return;
    //     }

    //     if(usda.balanceOf(user) < amount){
    //         return;
    //     }

    //     if(usdt.balanceOf(address(treasury)) < amount){
    //         return;
    //     }

    //     vm.startPrank(user);
    //     cds.redeemUSDT(amount,usdaPrice,usdtPrice);
    //     vm.stopPrank();

    // }
}