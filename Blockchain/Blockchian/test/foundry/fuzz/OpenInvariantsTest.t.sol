// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.22;

// import {Test, console, StdInvariant} from "forge-std/Test.sol";
// import {BorrowingTest} from "../../../contracts/TestContracts/CopyBorrowing.sol";
// import {Treasury} from "../../../contracts/Core_logic/Treasury.sol";
// import {CDSTest} from "../../../contracts/TestContracts/CopyCDS.sol";
// import {Options} from "../../../contracts/Core_logic/Options.sol";
// import {MultiSign} from "../../../contracts/Core_logic/multiSign.sol";
// import {TestUSDaStablecoin} from "../../../contracts/TestContracts/CopyUSDa.sol";
// import {TestABONDToken} from "../../../contracts/TestContracts/Copy_Abond_Token.sol";
// import {TestUSDT} from "../../../contracts/TestContracts/CopyUsdt.sol";
// import {HelperConfig} from "../../../scripts/script/HelperConfig.s.sol";
// import {DeployBorrowing} from "../../../scripts/script/DeployBorrowing.s.sol";
// import {IBorrowing} from "../../../contracts/interface/IBorrowing.sol";
// import {CDSInterface} from "../../../contracts/interface/CDSInterface.sol";
// import {ITreasury} from "../../../contracts/interface/ITreasury.sol";
// import {IGlobalVariables} from "../../../contracts/interface/IGlobalVariables.sol";
// import {IWrappedTokenGatewayV3} from "../../../contracts/interface/AaveInterfaces/IWETHGateway.sol";
// import {CometMainInterface} from "../../../contracts/interface/CometMainInterface.sol";
// import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
// import { MessagingFee } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
// import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";

// contract InvariantTest is StdInvariant,Test {
//     DeployBorrowing deployer;
//     DeployBorrowing.Contracts contractsA;
//     DeployBorrowing.Contracts contractsB;

//     address public USER = makeAddr("user");
//     address public owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

//     uint256 public ETH_AMOUNT = 1 ether;
//     uint256 public STARTING_ETH_BALANCE = 100 ether;
//     using OptionsBuilder for bytes;

//     function setUp() public {
//         deployer = new DeployBorrowing();
//         (contractsA,contractsB) = deployer.run();

//         vm.deal(USER,STARTING_ETH_BALANCE);
//         vm.deal(owner,STARTING_ETH_BALANCE);
//         targetContract(address(contractsA.borrow));
//     }

//     function invariant_ProtocolMustHaveMoreValueThanSupply() public view {
//         uint256 totalSupply = contractsA.usda.totalSupply() + contractsB.usda.totalSupply();
//         IGlobalVariables.OmniChainData memory omniChainData = contractsA.global.getOmniChainData();
//         uint256 totalDepositedEth = omniChainData.totalVolumeOfBorrowersAmountinWei;

//         (, uint256 currentETHPrice) = contractsA.borrow.getUSDValue(contractsA.borrow.assetAddress(IBorrowing.AssetName.ETH));

//         uint256 totalEthValue = totalDepositedEth * currentETHPrice;
//         uint256 usdtInCds = omniChainData.usdtAmountDepositedTillNow;
//         uint256 totalBacked = (totalEthValue / 1e2) + (usdtInCds * 1e12);
//         console.log("ETH VALUE",totalBacked);
//         console.log("TOTAL SUPPLY",(totalSupply * 1e12));
//         assert(totalBacked >= (totalSupply * 1e12));
//     }
// }