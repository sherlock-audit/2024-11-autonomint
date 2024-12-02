import { ethers,upgrades } from "hardhat";
import hre = require("hardhat");

import {
  SEPOLIA_USDA_ADDRESS,
  SEPOLIA_ABOND_ADDRESS,
  SEPOLIA_TESTUSDT_ADDRESS,
  SEPOLIA_MULTISIGN_ADDRESS,
  SEPOLIA_CDS_ADDRESS,
  SEPOLIA_BORROWING_ADDRESS,
  SEPOLIA_BORROW_LIQUIDATION_ADDRESS,
  SEPOLIA_TREASURY_ADDRESS,
  SEPOLIA_OPTIONS_ADDRESS,

  BASE_SEPOLIA_USDA_ADDRESS,
  BASE_SEPOLIA_ABOND_ADDRESS,
  BASE_SEPOLIA_TESTUSDT_ADDRESS,
  BASE_SEPOLIA_MULTISIGN_ADDRESS,
  BASE_SEPOLIA_CDS_ADDRESS,
  BASE_SEPOLIA_BORROWING_ADDRESS,
  BASE_SEPOLIA_BORROW_LIQUIDATION_ADDRESS,
  BASE_SEPOLIA_TREASURY_ADDRESS,
  BASE_SEPOLIA_OPTIONS_ADDRESS,
  TESTNET_SEPOLIA_TREASURY_ADDRESS,
  TESTNET_BASE_SEPOLIA_TREASURY_ADDRESS
} from"./index"

async function main() {

  // const AMINTStablecoin = await ethers.getContractFactory("AMINTStablecoin");
  // const deployedAMINTStablecoin = await upgrades.upgradeProxy(PROXY_AMINT_ADDRESS,AMINTStablecoin, {kind:'uups'});
  // await deployedAMINTStablecoin.waitForDeployment();
  // console.log("NEW IMP ABOND ADDRESS",await deployedAMINTStablecoin.getAddress());

  // const ABONDToken = await ethers.getContractFactory("ABONDToken");
  // const deployedABONDToken = await upgrades.upgradeProxy(PROXY_ABOND_ADDRESS,ABONDToken, {kind:'uups'});
  // await deployedABONDToken.waitForDeployment();
  // console.log("NEW IMP ABOND ADDRESS",await deployedABONDToken.getAddress());

  // const TestUSDT = await ethers.getContractFactory("TestUSDT");
  // const deployedTestUSDT = await upgrades.upgradeProxy(PROXY_TESTUSDT_ADDRESS,TestUSDT, {kind:'uups'});
  // await deployedTestUSDT.waitForDeployment();
  // console.log("NEW IMP TEST USDT ADDRESS",await deployedTestUSDT.getAddress());

  // const multiSign = await ethers.getContractFactory("MultiSign");
  // const deployedMultisign = await upgrades.upgradeProxy(PROXY_MULTISIGN_ADDRESS,multiSign,{kind:'uups'});
  // await deployedMultisign.waitForDeployment();
  // console.log("NEW IMP MULTISIGN ADDRESS",await deployedMultisign.getAddress());

  // const CDSLibFactory = await ethers.getContractFactory("CDSLib");
  // const CDSLib = await CDSLibFactory.deploy();
  // const CDS = await ethers.getContractFactory("CDS",{
  //   libraries: {
  //       CDSLib:await CDSLib.getAddress()
  //   }
  // });
  // const deployedCDS = await upgrades.upgradeProxy(BASE_SEPOLIA_CDS_ADDRESS,CDS,{unsafeAllowLinkedLibraries:true},{kind:'uups'})
  // await deployedCDS.waitForDeployment();
  // console.log("NEW IMP CDS ADDRESS",await deployedCDS.getAddress());

  // const borrowLibFactory = await ethers.getContractFactory("BorrowLib");
  // const borrowLib = await borrowLibFactory.deploy();
  // const Borrowing = await ethers.getContractFactory("Borrowing",{
  //   libraries: {
  //       BorrowLib:await borrowLib.getAddress()
  //   }
  // });  
  // const deployedBorrowing = await upgrades.upgradeProxy(BASE_SEPOLIA_BORROWING_ADDRESS,Borrowing,{unsafeAllowLinkedLibraries:true},{kind:'uups'});
  // await deployedBorrowing.waitForDeployment();
  // console.log("NEW IMP BORROWING ADDRESS",await deployedBorrowing.getAddress());

  const Treasury = await ethers.getContractFactory("Treasury");
  const deployedTreasury = await upgrades.upgradeProxy(TESTNET_BASE_SEPOLIA_TREASURY_ADDRESS,Treasury,{kind:'uups'});
  await deployedTreasury.waitForDeployment();
  console.log("NEW IMP TREASURY ADDRESS",await deployedTreasury.getAddress());

  // const Option = await ethers.getContractFactory("Options");
  // const deployedOptions = await upgrades.upgradeProxy(PROXY_OPTIONS_ADDRESS,Option,{kind:'uups'});
  // await deployedOptions.waitForDeployment();
  // console.log("NEW IMP OPTIONS ADDRESS",await deployedOptions.getAddress());

  // async function sleep(ms:number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  // await sleep(30 * 1000);

  // await hre.run("verify:verify", {
  //   address: deployedAMINTStablecoin.address,
  //   contract: "contracts/Token/Amint.sol:AMINTStablecoin"
  // });

  // await hre.run("verify:verify", {
  //   address: deployedABONDToken.address,
  //   contract: "contracts/Token/Abond_Token.sol:ABONDToken"
  // });

  // await hre.run("verify:verify", {
  //   address: deployedTestUSDT.address,
  //   contract: "contracts/TestContracts/CopyUsdt.sol:TestUSDT"
  // });

  // await hre.run("verify:verify", {
  //   address: deployedMultisign.address,
  //   contract: "contracts/Core_logic/multiSign.sol:MultiSign",
  //   constructorArguments: [[owner1,owner2,owner3],2],
  // });

  // await hre.run("verify:verify", {
  //   address: deployedCDS.address,
  //   contract: "contracts/Core_logic/CDS.sol:CDS",
  //   constructorArguments: [deployedAMINTStablecoin.address,priceFeedAddressGoerli,deployedTestUSDT.address,deployedMultisign.address],
  // });

  // await hre.run("verify:verify", {
  //   address: deployedBorrowing.address,
  //   contract: "contracts/Core_logic/borrowing.sol:Borrowing",
  //   constructorArguments: [deployedAMINTStablecoin.address,deployedCDS.address,deployedABONDToken.address,deployedMultisign.address,priceFeedAddressGoerli,5],
  // });

  // await hre.run("verify:verify", {
  //   address: deployedTreasury.address,
  //   contract: "contracts/Core_logic/Treasury.sol:Treasury",
  //   constructorArguments: [deployedBorrowing.address,deployedAMINTStablecoin.address,deployedCDS.address,wethGatewayGoerli,cEtherGoerli,aavePoolAddressGoerli,aTokenAddressGoerli,deployedTestUSDT.address],
  // });

  // await hre.run("verify:verify", {
  //   address: "0x3a0249Db5c2137ec31899495dC49a6568325d8b1",
  //   contract: "contracts/Core_logic/Options.sol:Options",
  //   // constructorArguments: [priceFeedAddressGoerli,deployedTreasury.address,deployedCDS.address,deployedBorrowing.address],
  // });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });