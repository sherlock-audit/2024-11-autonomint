import { ethers,upgrades } from "hardhat";
import hre = require("hardhat");

import {
  wethGatewayBaseSepolia,
  wethGatewaySepolia,
  cometBaseSepolia,
  cometSepolia,
  aTokenAddressBaseSepolia,
  aTokenAddressSepolia,
  priceFeedAddressBaseSepolia,
  priceFeedAddressSepolia,
  aavePoolAddressBaseSepolia,
  aavePoolAddressSepolia,
  owner1,owner2,owner3,
  eidSepolia,eidBaseSepolia,
  endpointSepolia,endpointBaseSepolia,
  PROXY_AMINT_ADDRESS,PROXY_ABOND_ADDRESS,PROXY_BORROWING_ADDRESS,
  PROXY_CDS_ADDRESS,PROXY_OPTIONS_ADDRESS,PROXY_MULTISIGN_ADDRESS,PROXY_TESTUSDT_ADDRESS,PROXY_TREASURY_ADDRESS,
  wethAddressSepolia,wethAddressBaseSepolia
} from"./index"

async function main() {

  // const AMINTStablecoin = await ethers.getContractFactory("TestAMINTStablecoin");
  // const deployedAMINTStablecoin = await upgrades.deployProxy(AMINTStablecoin,[
  //   "Test AMINT TOKEN",
  //   "TAMINT",
  //   endpointBaseSepolia,
  //   owner1
  // ], {kind:'uups'});
  // await deployedAMINTStablecoin.waitForDeployment();
  // console.log("PROXY AMINT ADDRESS",await deployedAMINTStablecoin.getAddress());

  // const ABONDToken = await ethers.getContractFactory("TestABONDToken");
  // const deployedABONDToken = await upgrades.deployProxy(ABONDToken,[
  //   "Test ABOND TOKEN",
  //   "TABOND",
  //   endpointBaseSepolia,
  //   owner1
  // ], {kind:'uups'});
  // await deployedABONDToken.waitForDeployment();
  // console.log("PROXY ABOND ADDRESS",await deployedABONDToken.getAddress());

  // const TestUSDT = await ethers.getContractFactory("TestUSDT");
  // const deployedTestUSDT = await upgrades.deployProxy(TestUSDT,[
  //   "Test USDT",
  //   "TUSDT",
  //   endpointBaseSepolia,
  //   owner1
  // ], {kind:'uups'});
  // await deployedTestUSDT.waitForDeployment();
  // console.log("PROXY TEST USDT ADDRESS",await deployedTestUSDT.getAddress());

  // const multiSign = await ethers.getContractFactory("MultiSign");
  // const deployedMultisign = await upgrades.deployProxy(multiSign,[[owner1,owner2,owner3],2],{initializer:'initialize'},{kind:'uups'});
  // await deployedMultisign.waitForDeployment();
  // console.log("PROXY MULTISIGN ADDRESS",await deployedMultisign.getAddress());
  
  // const CDSLibFactory = await ethers.getContractFactory("CDSLib");
  // const CDSLib = await CDSLibFactory.deploy();
  // const CDS = await ethers.getContractFactory("CDSTest",{
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
  // const Borrowing = await ethers.getContractFactory("BorrowingTest",{
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

  // const Treasury = await ethers.getContractFactory("Treasury");
  // const deployedTreasury = await upgrades.deployProxy(Treasury,[
  //   await deployedBorrowing.getAddress(),
  //   await deployedAMINTStablecoin.getAddress(),
  //   await deployedABONDToken.getAddress(),
  //   await deployedCDS.getAddress(),
  //   wethGatewayBaseSepolia,
  //   cometBaseSepolia,
  //   aavePoolAddressBaseSepolia,
  //   aTokenAddressBaseSepolia,
  //   await deployedTestUSDT.getAddress(),
  //   wethAddressBaseSepolia,
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

  await hre.run("verify:verify", {
    address: "0xc26f505b330bfc9294086fe19aa2b9f559c87540",
    contract: "contracts/TestContracts/CopyAmint.sol:TestAMINTStablecoin"
  });

  await hre.run("verify:verify", {
    address: "0x2d1232cef21409fd8d386acabfee071dc625f60d",
    contract: "contracts/TestContracts/Copy_Abond_Token.sol:TestABONDToken"
  });

  await hre.run("verify:verify", {
    address: "0x17656a9cab0112193afad5cec417e975ef9a37a4",
    contract: "contracts/TestContracts/CopyUsdt.sol:TestUSDT"
  });

  await hre.run("verify:verify", {
    address: "0xd55a743c2cf4c6bbc7a2e1ad056c2d764850eaf1",
    contract: "contracts/Core_logic/multiSign.sol:MultiSign",
  });

  await hre.run("verify:verify", {
    address: "0xeecc63b1385e6ad4d29118c3815e230e8b5a64fb",
    contract: "contracts/TestContracts/CopyCDS.sol:CDSTest",
  });

  await hre.run("verify:verify", {
    address: "0x2947c80bdd302fb3da1f23eada1557897c9220ff",
    contract: "contracts/TestContracts/CopyBorrowing.sol:BorrowingTest",
  });

  await hre.run("verify:verify", {
    address: "0x3dc4f06c969b8218eefb733248c505d65d46275d",
    contract: "contracts/Core_logic/Treasury.sol:Treasury",
  });

  await hre.run("verify:verify", {
    address: "0xb573579adcba8a685f8484128927c683e0938ec1",
    contract: "contracts/Core_logic/Options.sol:Options",
  });

  // await deployedMultisign.approveSetterFunction([0,1,2,3,4,5,6,7,8,9,10]);
  // await deployedABONDToken.setBorrowingContract(await deployedBorrowing.getAddress());


//   await deployedBorrowing.setAdmin(owner1);
//   await deployedBorrowing.setTreasury(deployedTreasury.address);
//   await deployedBorrowing.setOptions(deployedOptions.address);
//   await deployedBorrowing.setLTV(80);
//   await deployedBorrowing.setBondRatio(4);

//   await deployedCDS.setAdmin(owner1);
//   await deployedCDS.setBorrowingContract(deployedBorrowing.address);
//   await deployedCDS.setTreasury(deployedTreasury.address);
//   await deployedCDS.setAmintLimit(80);
//   await deployedCDS.setUsdtLimit(20000000000);

  // await deployedTestUSDT.mint(owner1,10000000000);
  // await deployedTestUSDT.approve(deployedCDS.address,10000000000);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });