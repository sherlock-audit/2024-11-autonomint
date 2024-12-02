import { ethers,upgrades } from "hardhat";
import hre = require("hardhat");

import {
  wethGatewaySepolia,
  wethGatewayBaseSepolia,
  cometSepolia,
  cometBaseSepolia,
  aTokenAddressSepolia,
  aTokenAddressBaseSepolia,
  priceFeedAddressSepolia,
  priceFeedAddressBaseSepolia,
  aavePoolAddressSepolia,
  aavePoolAddressBaseSepolia,
  owner1,owner2,owner3,
  eidSepolia,eidBaseSepolia,
  endpointSepolia,endpointBaseSepolia,endpointModeSepolia,
  wethAddressSepolia,wethAddressBaseSepolia
} from"./index"

async function main() {

  // const AMINTStablecoin = await ethers.getContractFactory("USDaStablecoin");
  // const deployedAMINTStablecoin = await upgrades.deployProxy(AMINTStablecoin,[
  //   endpointBaseSepolia,
  //   owner1
  // ],{initializer:'initialize'}, {kind:'uups'});
  // await deployedAMINTStablecoin.waitForDeployment();
  // console.log("PROXY AMINT ADDRESS",await deployedAMINTStablecoin.getAddress());

  // const ABONDToken = await ethers.getContractFactory("ABONDToken");
  // const deployedABONDToken = await upgrades.deployProxy(ABONDToken,{initializer:'initialize'}, {kind:'uups'});
  // await deployedABONDToken.waitForDeployment();
  // console.log("PROXY ABOND ADDRESS",await deployedABONDToken.getAddress());

  // const TestUSDT = await ethers.getContractFactory("TestUSDT");
  // const deployedTestUSDT = await upgrades.deployProxy(TestUSDT,[
  //   "Test USDT",
  //   "TUSDT",
  //   endpointBaseSepolia,
  //   owner1
  // ],{initializer:'initialize'}, {kind:'uups'});
  // await deployedTestUSDT.waitForDeployment();
  // console.log("PROXY TEST USDT ADDRESS",await deployedTestUSDT.getAddress());

  // const multiSign = await ethers.getContractFactory("MultiSign");
  // const deployedMultisign = await upgrades.deployProxy(multiSign,[[owner1,owner2,owner3],2],{initializer:'initialize'},{kind:'uups'});
  // await deployedMultisign.waitForDeployment();
  // console.log("PROXY MULTISIGN ADDRESS",await deployedMultisign.getAddress());
  
  // const CDSLibFactory = await ethers.getContractFactory("CDSLib");
  // const CDSLib = await CDSLibFactory.deploy();
  // const CDS = await ethers.getContractFactory("CDS",{
  //   libraries: {
  //       CDSLib:await CDSLib.getAddress()
  //   }
  // });
  // const deployedCDS = await upgrades.deployProxy(CDS,[
  //   await deployedAMINTStablecoin.getAddress(),
  //   priceFeedAddressBaseSepolia,
  //   await deployedTestUSDT.getAddress(),
  //   await deployedMultisign.getAddress(),
  //   endpointBaseSepolia,
  //   owner1 ],{initializer:'initialize',
  //       unsafeAllowLinkedLibraries:true
  //   },{kind:'uups'})
  // await deployedCDS.waitForDeployment();
  // console.log("PROXY CDS ADDRESS",await deployedCDS.getAddress());

  
  // const borrowLibFactory = await ethers.getContractFactory("BorrowLib");
  // const borrowLib = await borrowLibFactory.deploy();
  // const Borrowing = await ethers.getContractFactory("Borrowing",{
  //   libraries: {
  //       BorrowLib:await borrowLib.getAddress()
  //   }
  // });
  // const deployedBorrowing = await upgrades.deployProxy(Borrowing,[
  //   await deployedAMINTStablecoin.getAddress(),
  //   await deployedCDS.getAddress(),
  //   await deployedABONDToken.getAddress(),
  //   await deployedMultisign.getAddress(),
  //   priceFeedAddressBaseSepolia,
  //   11155111,
  //   endpointBaseSepolia,
  //   owner1],{initializer:'initialize',
  //       unsafeAllowLinkedLibraries:true
  //   },{kind:'uups'})
  // await deployedBorrowing.waitForDeployment();
  // console.log("PROXY BORROWING ADDRESS",await deployedBorrowing.getAddress());

  // const BorrowLiq = await ethers.getContractFactory("BorrowLiquidation",{
  //   libraries: {
  //       BorrowLib:await borrowLib.getAddress()
  //   }
  // });

  // const deployedLiquidation = await upgrades.deployProxy(BorrowLiq,[
  //   await deployedBorrowing.getAddress(),
  //   await deployedCDS.getAddress(),
  //   await deployedAMINTStablecoin.getAddress(),
  // ],{initializer:'initialize',
  //   unsafeAllowLinkedLibraries:true
  // },{kind:'uups'});
  // await deployedLiquidation.waitForDeployment();
  // console.log("PROXY BORROW LIQUIDATION ADDRESS",await deployedLiquidation.getAddress());

  // const Treasury = await ethers.getContractFactory("Treasury");
  // const deployedTreasury = await upgrades.deployProxy(Treasury,[
  //   await deployedBorrowing.getAddress(),
  //   await deployedAMINTStablecoin.getAddress(),
  //   await deployedABONDToken.getAddress(),
  //   await deployedCDS.getAddress(),
  //   await deployedLiquidation.getAddress(),
  //   await deployedTestUSDT.getAddress(),
  //   endpointBaseSepolia,
  //   owner1 ],{initializer:'initialize'},{kind:'uups'});
  // await deployedTreasury.waitForDeployment();
  // console.log("PROXY TREASURY ADDRESS",await deployedTreasury.getAddress());

  // const Option = await ethers.getContractFactory("Options");
  // const deployedOptions = await upgrades.deployProxy(Option,[await deployedTreasury.getAddress(),await deployedCDS.getAddress(),await deployedBorrowing.getAddress()],{initializer:'initialize'},{kind:'uups'});
  // await deployedOptions.waitForDeployment();
  // console.log("PROXY OPTIONS ADDRESS",await deployedOptions.getAddress());


  // async function sleep(ms:number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  // await sleep(30 * 1000);

  // await hre.run("verify:verify", {
  //   address: "0xC713EDf7ef83F8a1393415833083cBEDF690A0E0",
  //   contract: "contracts/Token/USDa.sol:USDaStablecoin"
  // });

  // await hre.run("verify:verify", {
  //   address: "0x2b77d91d67642659924f8e339547f46a70992c62",
  //   contract: "contracts/Token/Abond_Token.sol:ABONDToken"
  // });

  // await hre.run("verify:verify", {
  //   address: "0x17656a9cab0112193afad5cec417e975ef9a37a4",
  //   contract: "contracts/TestContracts/CopyUsdt.sol:TestUSDT"
  // });

  // await hre.run("verify:verify", {
  //   address: "0x809b57518a5319a1cf348f9425ec7721bd472719",
  //   contract: "contracts/Core_logic/multiSign.sol:MultiSign",
  // });

  // await hre.run("verify:verify", {
  //   address: "0xd418ff9b6df4fa01b61823c5ea74021cfec28c06",
  //   contract: "contracts/Core_logic/CDS.sol:CDS",
  // });

  // await hre.run("verify:verify", {
  //   address: "0x62b83355088e1f8f7468182eadb984773034d7ca",
  //   contract: "contracts/Core_logic/borrowing.sol:Borrowing",
  // });

  // await hre.run("verify:verify", {
  //   address: "0xf2474533a55455207c485c654d3d29f7013f5084",
  //   contract: "contracts/Core_logic/borrowLiquidation.sol:BorrowLiquidation",
  // });

  await hre.run("verify:verify", {
    address: "0x6e4584167bb5464c5086c54643c4b6460765921f",
    contract: "contracts/Core_logic/Treasury.sol:Treasury",
  });

  // await hre.run("verify:verify", {
  //   address: "0xb573579adcba8a685f8484128927c683e0938ec1",
  //   contract: "contracts/Core_logic/Options.sol:Options",
  // });

  // await deployedTreasury.setExternalProtocolAddresses(
  //   wethGatewayBaseSepolia,
  //   cometBaseSepolia,
  //   aavePoolAddressBaseSepolia,
  //   aTokenAddressBaseSepolia,
  //   wethAddressBaseSepolia
  // )

  // await deployedMultisign.approveSetterFunction([0,1,2,3,4,5,6,7,8,9]);
  // await deployedABONDToken.setBorrowingContract(await deployedBorrowing.getAddress());

  // await deployedBorrowing.setDstEid(eidSepolia);
  // await deployedCDS.setDstEid(eidSepolia);
  // await deployedTreasury.setDstEid(eidSepolia);
  // await deployedAMINTStablecoin.setDstEid(eidSepolia);
  // await deployedTestUSDT.setDstEid(eidSepolia);


  // await deployedBorrowing.setAdmin(owner1);
  // await deployedBorrowing.setTreasury(deployedTreasury.address);
  // await deployedBorrowing.setOptions(deployedOptions.address);
  // await deployedBorrowing.setLTV(80);
  // await deployedBorrowing.setBondRatio(4);

  // await deployedCDS.setAdmin(owner1);
  // await deployedCDS.setBorrowingContract(deployedBorrowing.address);
  // await deployedCDS.setTreasury(deployedTreasury.address);
  // await deployedCDS.setAmintLimit(80);
  // await deployedCDS.setUsdtLimit(20000000000);

  // await deployedTestUSDT.mint("0x876b4dE42e35A37E6D0eaf8762836CAD860C0c18",10000000000);
  // await deployedTestUSDT.approve(await deployedCDS.getAddress(),10000000000);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });