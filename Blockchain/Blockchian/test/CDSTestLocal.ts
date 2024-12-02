// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { expect } = require("chai");
// const { it } = require("mocha")
// import { ethers,upgrades } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
// import { describe } from "node:test";
// import { BorrowLib } from "../typechain-types";
// import { Contract, ContractFactory, ZeroAddress } from 'ethers'
// import { Options } from '@layerzerolabs/lz-v2-utilities'

// import {
//     wethGatewayMainnet,wethGatewaySepolia,
//     //priceFeedAddressMainnet,priceFeedAddressSepolia,
//     aTokenAddressMainnet,aTokenAddressSepolia,
//     aavePoolAddressMainnet,aavePoolAddressSepolia,
//     cometMainnet,cometSepolia,
//     INFURA_URL_MAINNET,INFURA_URL_SEPOLIA,
//     aTokenABI,
//     cETH_ABI,
//     wethAddressMainnet,wethAddressSepolia,
//     endPointAddressMainnet,endPointAddressPolygon,
//     } from "./utils/index"

// describe("CDS Contract",function(){

//     let owner: any;
//     let owner1: any;
//     let owner2: any;
//     let user1: any;
//     let user2: any;
//     let user3: any;
//     let TokenA: Contract;
//     let abondTokenA: Contract;
//     let usdtA: Contract;
//     let TokenB: Contract;
//     let abondTokenB: Contract;
//     let usdtB: Contract;
//     let TokenC: Contract;
//     const eidA = 1
//     const eidB = 2
//     const eidC = 3
//     const ethVolatility = 50622665;


//     async function deployerOld(){
//         [owner,owner1,owner2,user1,user2,user3] = await ethers.getSigners();

//         const EndpointV2Mock = await ethers.getContractFactory('EndpointV2Mock')
//         const mockEndpointV2AOld = await EndpointV2Mock.deploy(eidA)
//         const mockEndpointV2BOld = await EndpointV2Mock.deploy(eidB)
//         const mockEndpointV2COld = await EndpointV2Mock.deploy(eidC)

//         const USDaStablecoin = await ethers.getContractFactory("TestUSDaStablecoin");
//         const TokenA = await upgrades.deployProxy(USDaStablecoin,[
//             await mockEndpointV2AOld.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const TokenB = await upgrades.deployProxy(USDaStablecoin,[
//             await mockEndpointV2BOld.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const TokenC = await upgrades.deployProxy(USDaStablecoin,[
//             await mockEndpointV2COld.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const ABONDToken = await ethers.getContractFactory("TestABONDToken");
//         const abondTokenA = await upgrades.deployProxy(ABONDToken, {initializer: 'initialize'}, {kind:'uups'});
//         const abondTokenB = await upgrades.deployProxy(ABONDToken, {initializer: 'initialize'}, {kind:'uups'});

//         const MultiSign = await ethers.getContractFactory("MultiSign");
//         const multiSignAOld = await upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],2],{initializer:'initialize'},{kind:'uups'});
//         const multiSignBOld = await upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],2],{initializer:'initialize'},{kind:'uups'});

//         const USDTToken = await ethers.getContractFactory("TestUSDT");
//         const usdtA = await upgrades.deployProxy(USDTToken,[
//             await mockEndpointV2AOld.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});
//         const usdtB = await upgrades.deployProxy(USDTToken,[
//             await mockEndpointV2BOld.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
//         const mockPriceFeedAOld = await MockPriceFeed.deploy(8,100000000000);
//         const mockPriceFeedBOld = await MockPriceFeed.deploy(8,100000000000);

//         const priceFeedAddressMainnetAOld = await mockPriceFeedAOld.getAddress();
//         const priceFeedAddressMainnetBOld = await mockPriceFeedBOld.getAddress();

//         const cdsLibFactory = await ethers.getContractFactory("CDSLib");
//         const cdsLib = await cdsLibFactory.deploy();

//         const CDS = await ethers.getContractFactory("OldCDSTest",{
//             libraries: {
//                 CDSLib:await cdsLib.getAddress()
//             }
//         });

//         const CDSContractAOld = await upgrades.deployProxy(CDS,[
//             await TokenA.getAddress(),
//             priceFeedAddressMainnetAOld,
//             await usdtA.getAddress(),
//             await multiSignAOld.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'})

//         const CDSContractBOld = await upgrades.deployProxy(CDS,[
//             await TokenB.getAddress(),
//             priceFeedAddressMainnetBOld,
//             await usdtB.getAddress(),
//             await multiSignBOld.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'})

//         const GlobalVariables = await ethers.getContractFactory("GlobalVariables");
//         const globalVariablesAOld = await upgrades.deployProxy(GlobalVariables,[
//             await TokenA.getAddress(),
//             await CDSContractAOld.getAddress(),
//             await mockEndpointV2AOld.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const globalVariablesBOld = await upgrades.deployProxy(GlobalVariables,[
//             await TokenB.getAddress(),
//             await CDSContractBOld.getAddress(),
//             await mockEndpointV2BOld.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const borrowLibFactory = await ethers.getContractFactory("BorrowLib");
//         const borrowLib = await borrowLibFactory.deploy();

//         const Borrowing = await ethers.getContractFactory("OldBorrowingTest",{
//             libraries: {
//                 BorrowLib:await borrowLib.getAddress()
//             }
//         });

//         const BorrowingContractAOld = await upgrades.deployProxy(Borrowing,[
//             await TokenA.getAddress(),
//             await CDSContractAOld.getAddress(),
//             await abondTokenA.getAddress(),
//             await multiSignAOld.getAddress(),
//             priceFeedAddressMainnetAOld,
//             1,
//             await globalVariablesAOld.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'});

//         const BorrowingContractBOld = await upgrades.deployProxy(Borrowing,[
//             await TokenB.getAddress(),
//             await CDSContractBOld.getAddress(),
//             await abondTokenB.getAddress(),
//             await multiSignBOld.getAddress(),
//             priceFeedAddressMainnetBOld,
//             1,
//             await globalVariablesBOld.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'});

//         const BorrowLiq = await ethers.getContractFactory("BorrowLiquidation",{
//             libraries: {
//                 BorrowLib:await borrowLib.getAddress()
//             }
//         });

//         const BorrowingLiquidationAOld = await upgrades.deployProxy(BorrowLiq,[
//             await BorrowingContractAOld.getAddress(),
//             await CDSContractAOld.getAddress(),
//             await TokenA.getAddress(),
//             await globalVariablesAOld.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'}); 

//         const BorrowingLiquidationBOld = await upgrades.deployProxy(BorrowLiq,[
//             await BorrowingContractBOld.getAddress(),
//             await CDSContractBOld.getAddress(),
//             await TokenB.getAddress(),
//             await globalVariablesBOld.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'}); 

//         const Treasury = await ethers.getContractFactory("OldTreasury");
//         const treasuryAOld = await upgrades.deployProxy(Treasury,[
//             await BorrowingContractAOld.getAddress(),
//             await TokenA.getAddress(),
//             await abondTokenA.getAddress(),
//             await CDSContractAOld.getAddress(),
//             await BorrowingLiquidationAOld.getAddress(),
//             await usdtA.getAddress(),
//             await globalVariablesAOld.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});

//         const treasuryBOld = await upgrades.deployProxy(Treasury,[
//             await BorrowingContractBOld.getAddress(),
//             await TokenB.getAddress(),
//             await abondTokenB.getAddress(),
//             await CDSContractBOld.getAddress(),
//             await BorrowingLiquidationBOld.getAddress(),
//             await usdtB.getAddress(),
//             await globalVariablesBOld.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});

//         const Option = await ethers.getContractFactory("Options");
//         const optionsAOld = await upgrades.deployProxy(Option,[
//             await treasuryAOld.getAddress(),
//             await CDSContractAOld.getAddress(),
//             await BorrowingContractAOld.getAddress(),
//             await globalVariablesAOld.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});
//         const optionsBOld = await upgrades.deployProxy(Option,[
//             await treasuryBOld.getAddress(),
//             await CDSContractBOld.getAddress(),
//             await BorrowingContractBOld.getAddress(),
//             await globalVariablesBOld.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});

//         await mockEndpointV2AOld.setDestLzEndpoint(await TokenB.getAddress(), mockEndpointV2BOld.getAddress())
//         await mockEndpointV2AOld.setDestLzEndpoint(await TokenC.getAddress(), mockEndpointV2COld.getAddress())
//         await mockEndpointV2BOld.setDestLzEndpoint(await TokenA.getAddress(), mockEndpointV2AOld.getAddress())
//         await mockEndpointV2BOld.setDestLzEndpoint(await TokenC.getAddress(), mockEndpointV2COld.getAddress())
//         await mockEndpointV2COld.setDestLzEndpoint(await TokenA.getAddress(), mockEndpointV2AOld.getAddress())
//         await mockEndpointV2COld.setDestLzEndpoint(await TokenB.getAddress(), mockEndpointV2BOld.getAddress())

//         await mockEndpointV2BOld.setDestLzEndpoint(await usdtA.getAddress(), mockEndpointV2AOld.getAddress())
//         await mockEndpointV2AOld.setDestLzEndpoint(await usdtB.getAddress(), mockEndpointV2BOld.getAddress())

//         await mockEndpointV2AOld.setDestLzEndpoint(await globalVariablesBOld.getAddress(), mockEndpointV2BOld.getAddress())
//         await mockEndpointV2BOld.setDestLzEndpoint(await globalVariablesAOld.getAddress(), mockEndpointV2AOld.getAddress())

//         await TokenA.connect(owner).setPeer(eidB, ethers.zeroPadValue(await TokenB.getAddress(), 32))
//         await TokenA.connect(owner).setPeer(eidC, ethers.zeroPadValue(await TokenC.getAddress(), 32))
//         await TokenB.connect(owner).setPeer(eidA, ethers.zeroPadValue(await TokenA.getAddress(), 32))
//         await TokenB.connect(owner).setPeer(eidC, ethers.zeroPadValue(await TokenC.getAddress(), 32))
//         await TokenC.connect(owner).setPeer(eidA, ethers.zeroPadValue(await TokenA.getAddress(), 32))
//         await TokenC.connect(owner).setPeer(eidB, ethers.zeroPadValue(await TokenB.getAddress(), 32))

//         await usdtA.setPeer(eidB, ethers.zeroPadValue(await usdtB.getAddress(), 32))
//         await usdtB.setPeer(eidA, ethers.zeroPadValue(await usdtA.getAddress(), 32))

//         await globalVariablesAOld.setPeer(eidB, ethers.zeroPadValue(await globalVariablesBOld.getAddress(), 32))
//         await globalVariablesBOld.setPeer(eidA, ethers.zeroPadValue(await globalVariablesAOld.getAddress(), 32))

//         await abondTokenA.setBorrowingContract(await BorrowingContractAOld.getAddress());
//         await abondTokenB.setBorrowingContract(await BorrowingContractBOld.getAddress());

//         await multiSignAOld.approveSetterFunction([0,1,3,4,5,6,7,8,9]);
//         await multiSignAOld.connect(owner1).approveSetterFunction([0,1,3,4,5,6,7,8,9]);
//         await multiSignBOld.approveSetterFunction([0,1,3,4,5,6,7,8,9]);
//         await multiSignBOld.connect(owner1).approveSetterFunction([0,1,3,4,5,6,7,8,9]);

//         await BorrowingContractAOld.setAdmin(owner.getAddress());
//         await BorrowingContractBOld.setAdmin(owner.getAddress());

//         await CDSContractAOld.setAdmin(owner.getAddress());
//         await CDSContractBOld.setAdmin(owner.getAddress());

//         await TokenA.setDstEid(eidB);
//         await TokenB.setDstEid(eidA);

//         await usdtA.setDstEid(eidB);
//         await usdtB.setDstEid(eidA);

//         await globalVariablesAOld.setDstEid(eidB);
//         await globalVariablesBOld.setDstEid(eidA);

//         await globalVariablesAOld.setDstGlobalVariablesAddress(await globalVariablesBOld.getAddress());
//         await globalVariablesBOld.setDstGlobalVariablesAddress(await globalVariablesAOld.getAddress());

//         await globalVariablesAOld.setTreasury(await treasuryAOld.getAddress());
//         await globalVariablesBOld.setTreasury(await treasuryBOld.getAddress());

//         await globalVariablesAOld.setBorrowLiq(await BorrowingLiquidationAOld.getAddress());
//         await globalVariablesBOld.setBorrowLiq(await BorrowingLiquidationBOld.getAddress());        
        
//         await globalVariablesAOld.setBorrowing(await BorrowingContractAOld.getAddress());
//         await globalVariablesBOld.setBorrowing(await BorrowingContractBOld.getAddress());

//         await BorrowingContractAOld.setTreasury(await treasuryAOld.getAddress());
//         await BorrowingContractAOld.setOptions(await optionsAOld.getAddress());
//         await BorrowingContractAOld.setBorrowLiquidation(await BorrowingLiquidationAOld.getAddress());
//         await BorrowingContractAOld.setLTV(80);
//         await BorrowingContractAOld.setBondRatio(4);
//         await BorrowingContractAOld.setAPR(50,BigInt("1000000001547125957863212448"));

//         await BorrowingContractBOld.setTreasury(await treasuryBOld.getAddress());
//         await BorrowingContractBOld.setOptions(await optionsBOld.getAddress());
//         await BorrowingContractBOld.setBorrowLiquidation(await BorrowingLiquidationBOld.getAddress());
//         await BorrowingContractBOld.setLTV(80);
//         await BorrowingContractBOld.setBondRatio(4);
//         await BorrowingContractBOld.setAPR(50,BigInt("1000000001547125957863212448"));

//         await BorrowingLiquidationAOld.setTreasury(await treasuryAOld.getAddress());
//         await BorrowingLiquidationBOld.setTreasury(await treasuryBOld.getAddress());

//         await BorrowingLiquidationAOld.setAdmin(await owner.getAddress());
//         await BorrowingLiquidationBOld.setAdmin(await owner.getAddress());

//         await CDSContractAOld.setTreasury(await treasuryAOld.getAddress());
//         await CDSContractAOld.setBorrowingContract(await BorrowingContractAOld.getAddress());
//         await CDSContractAOld.setBorrowLiquidation(await BorrowingLiquidationAOld.getAddress());
//         await CDSContractAOld.setUSDaLimit(80);
//         await CDSContractAOld.setUsdtLimit(20000000000);
//         await CDSContractAOld.setGlobalVariables(await globalVariablesAOld.getAddress());

//         await CDSContractBOld.setTreasury(await treasuryBOld.getAddress());
//         await CDSContractBOld.setBorrowingContract(await BorrowingContractBOld.getAddress());
//         await CDSContractBOld.setBorrowLiquidation(await BorrowingLiquidationBOld.getAddress());
//         await CDSContractBOld.setUSDaLimit(80);
//         await CDSContractBOld.setUsdtLimit(20000000000);
//         await CDSContractBOld.setGlobalVariables(await globalVariablesBOld.getAddress());

//         await BorrowingContractAOld.calculateCumulativeRate();
//         await BorrowingContractBOld.calculateCumulativeRate();

//         await treasuryAOld.setExternalProtocolAddresses(
//             wethGatewayMainnet,
//             cometMainnet,
//             aavePoolAddressMainnet,
//             aTokenAddressMainnet,
//             wethAddressMainnet,
//         )

//         await treasuryBOld.setExternalProtocolAddresses(
//             wethGatewayMainnet,
//             cometMainnet,
//             aavePoolAddressMainnet,
//             aTokenAddressMainnet,
//             wethAddressMainnet,
//         )

//         const provider = new ethers.JsonRpcProvider(INFURA_URL_MAINNET);
//         const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",provider);

//         const aToken = new ethers.Contract(aTokenAddressMainnet,aTokenABI,signer);
//         const cETH = new ethers.Contract(cometMainnet,cETH_ABI,signer);

//         return {
//             TokenA,abondTokenA,usdtA,
//             CDSContractAOld,BorrowingContractAOld,
//             treasuryAOld,optionsAOld,multiSignAOld,
//             BorrowingLiquidationAOld,globalVariablesAOld,

//             TokenB,abondTokenB,usdtB,
//             CDSContractBOld,BorrowingContractBOld,
//             treasuryBOld,optionsBOld,multiSignBOld,
//             BorrowingLiquidationBOld,globalVariablesBOld,

//             owner,user1,user2,user3,
//             provider,signer
//         }
//     }
    
//     async function deployer(){
//         [owner,owner1,owner2,user1,user2,user3] = await ethers.getSigners();
//         await loadFixture(deployerOld);
//         const { BorrowingContractAOld, CDSContractAOld,treasuryAOld,TokenA, usdtA, abondTokenA,
//             BorrowingContractBOld, CDSContractBOld, treasuryBOld,TokenB, usdtB, abondTokenB, TokenC
//         } = await loadFixture(deployerOld);

//         const EndpointV2Mock = await ethers.getContractFactory('EndpointV2Mock')
//         const mockEndpointV2A = await EndpointV2Mock.deploy(eidA)
//         const mockEndpointV2B = await EndpointV2Mock.deploy(eidB)
//         const mockEndpointV2C = await EndpointV2Mock.deploy(eidC)

//         // const USDaStablecoin = await ethers.getContractFactory("TestUSDaStablecoin");
//         // const TokenA = await upgrades.deployProxy(USDaStablecoin,[
//         //     await mockEndpointV2A.getAddress(),
//         //     await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         // const TokenB = await upgrades.deployProxy(USDaStablecoin,[
//         //     await mockEndpointV2B.getAddress(),
//         //     await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         // const TokenC = await upgrades.deployProxy(USDaStablecoin,[
//         //     await mockEndpointV2B.getAddress(),
//         //     await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         // const ABONDToken = await ethers.getContractFactory("TestABONDToken");
//         // const abondTokenA = await upgrades.deployProxy(ABONDToken, {initializer: 'initialize'}, {kind:'uups'});
//         // const abondTokenB = await upgrades.deployProxy(ABONDToken, {initializer: 'initialize'}, {kind:'uups'});

//         const MultiSign = await ethers.getContractFactory("MultiSign");
//         const multiSignA = await upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],2],{initializer:'initialize'},{kind:'uups'});
//         const multiSignB = await upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],2],{initializer:'initialize'},{kind:'uups'});

//         // const USDTToken = await ethers.getContractFactory("TestUSDT");
//         // const usdtA = await upgrades.deployProxy(USDTToken,[
//         //     await mockEndpointV2A.getAddress(),
//         //     await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});
//         // const usdtB = await upgrades.deployProxy(USDTToken,[
//         //     await mockEndpointV2B.getAddress(),
//         //     await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
//         const mockPriceFeedA = await MockPriceFeed.deploy(8,100000000000);
//         const mockPriceFeedB = await MockPriceFeed.deploy(8,100000000000);

//         const priceFeedAddressMainnetA = await mockPriceFeedA.getAddress();
//         const priceFeedAddressMainnetB = await mockPriceFeedB.getAddress();


//         const cdsLibFactory = await ethers.getContractFactory("CDSLib");
//         const cdsLib = await cdsLibFactory.deploy();

//         const CDS = await ethers.getContractFactory("CDSTest",{
//             libraries: {
//                 CDSLib:await cdsLib.getAddress()
//             }
//         });
//         const CDSContractA = await upgrades.deployProxy(CDS,[
//             await TokenA.getAddress(),
//             priceFeedAddressMainnetA,
//             await usdtA.getAddress(),
//             await multiSignA.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'})

//         const CDSContractB = await upgrades.deployProxy(CDS,[
//             await TokenB.getAddress(),
//             priceFeedAddressMainnetB,
//             await usdtB.getAddress(),
//             await multiSignB.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'})

//         const GlobalVariables = await ethers.getContractFactory("GlobalVariables");
//         const globalVariablesA = await upgrades.deployProxy(GlobalVariables,[
//             await TokenA.getAddress(),
//             await CDSContractA.getAddress(),
//             await mockEndpointV2A.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const globalVariablesB = await upgrades.deployProxy(GlobalVariables,[
//             await TokenB.getAddress(),
//             await CDSContractB.getAddress(),
//             await mockEndpointV2B.getAddress(),
//             await owner.getAddress()],{initializer:'initialize'},{kind:'uups'});

//         const borrowLibFactory = await ethers.getContractFactory("BorrowLib");
//         const borrowLib = await borrowLibFactory.deploy();

//         const Borrowing = await ethers.getContractFactory("BorrowingTest",{
//             libraries: {
//                 BorrowLib:await borrowLib.getAddress()
//             }
//         });

//         const BorrowingContractA = await upgrades.deployProxy(Borrowing,[
//             await TokenA.getAddress(),
//             await CDSContractA.getAddress(),
//             await abondTokenA.getAddress(),
//             await multiSignA.getAddress(),
//             priceFeedAddressMainnetA,
//             1,
//             await globalVariablesA.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'});

//         const BorrowingContractB = await upgrades.deployProxy(Borrowing,[
//             await TokenB.getAddress(),
//             await CDSContractB.getAddress(),
//             await abondTokenB.getAddress(),
//             await multiSignB.getAddress(),
//             priceFeedAddressMainnetB,
//             1,
//             await globalVariablesB.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'});

//         const BorrowLiq = await ethers.getContractFactory("BorrowLiquidation",{
//             libraries: {
//                 BorrowLib:await borrowLib.getAddress()
//             }
//         });

//         const BorrowingLiquidationA = await upgrades.deployProxy(BorrowLiq,[
//             await BorrowingContractA.getAddress(),
//             await CDSContractA.getAddress(),
//             await TokenA.getAddress(),
//             await globalVariablesA.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'}); 

//         const BorrowingLiquidationB = await upgrades.deployProxy(BorrowLiq,[
//             await BorrowingContractB.getAddress(),
//             await CDSContractB.getAddress(),
//             await TokenB.getAddress(),
//             await globalVariablesB.getAddress()
//         ],{initializer:'initialize',
//             unsafeAllowLinkedLibraries:true
//         },{kind:'uups'}); 

//         const Treasury = await ethers.getContractFactory("Treasury");
//         const treasuryA = await upgrades.deployProxy(Treasury,[
//             await BorrowingContractA.getAddress(),
//             await TokenA.getAddress(),
//             await abondTokenA.getAddress(),
//             await CDSContractA.getAddress(),
//             await BorrowingLiquidationA.getAddress(),
//             await usdtA.getAddress(),
//             await globalVariablesA.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});

//         const treasuryB = await upgrades.deployProxy(Treasury,[
//             await BorrowingContractB.getAddress(),
//             await TokenB.getAddress(),
//             await abondTokenB.getAddress(),
//             await CDSContractB.getAddress(),
//             await BorrowingLiquidationB.getAddress(),
//             await usdtB.getAddress(),
//             await globalVariablesB.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});

//         const Option = await ethers.getContractFactory("Options");
//         const optionsA = await upgrades.deployProxy(Option,[
//             await treasuryA.getAddress(),
//             await CDSContractA.getAddress(),
//             await BorrowingContractA.getAddress(),
//             await globalVariablesA.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});
//         const optionsB = await upgrades.deployProxy(Option,[
//             await treasuryB.getAddress(),
//             await CDSContractB.getAddress(),
//             await BorrowingContractB.getAddress(),
//             await globalVariablesB.getAddress()
//         ],{initializer:'initialize'},{kind:'uups'});

//         // await mockEndpointV2A.setDestLzEndpoint(await TokenB.getAddress(), mockEndpointV2B.getAddress())
//         // await mockEndpointV2A.setDestLzEndpoint(await TokenC.getAddress(), mockEndpointV2C.getAddress())
//         // await mockEndpointV2B.setDestLzEndpoint(await TokenA.getAddress(), mockEndpointV2A.getAddress())
//         // await mockEndpointV2B.setDestLzEndpoint(await TokenC.getAddress(), mockEndpointV2C.getAddress())
//         // await mockEndpointV2C.setDestLzEndpoint(await TokenA.getAddress(), mockEndpointV2A.getAddress())
//         // await mockEndpointV2C.setDestLzEndpoint(await TokenB.getAddress(), mockEndpointV2B.getAddress())

//         // await mockEndpointV2B.setDestLzEndpoint(await usdtA.getAddress(), mockEndpointV2A.getAddress())
//         // await mockEndpointV2A.setDestLzEndpoint(await usdtB.getAddress(), mockEndpointV2B.getAddress())

//         await mockEndpointV2A.setDestLzEndpoint(await globalVariablesB.getAddress(), mockEndpointV2B.getAddress())
//         await mockEndpointV2B.setDestLzEndpoint(await globalVariablesA.getAddress(), mockEndpointV2A.getAddress())

//         // await TokenA.connect(owner).setPeer(eidB, ethers.zeroPadValue(await TokenB.getAddress(), 32))
//         // await TokenA.connect(owner).setPeer(eidC, ethers.zeroPadValue(await TokenC.getAddress(), 32))
//         // await TokenB.connect(owner).setPeer(eidA, ethers.zeroPadValue(await TokenA.getAddress(), 32))
//         // await TokenB.connect(owner).setPeer(eidC, ethers.zeroPadValue(await TokenC.getAddress(), 32))
//         // await TokenC.connect(owner).setPeer(eidA, ethers.zeroPadValue(await TokenA.getAddress(), 32))
//         // await TokenC.connect(owner).setPeer(eidB, ethers.zeroPadValue(await TokenB.getAddress(), 32))

//         // await usdtA.connect(owner).setPeer(eidB, ethers.zeroPadValue(await usdtB.getAddress(), 32))
//         // await usdtB.connect(owner).setPeer(eidA, ethers.zeroPadValue(await usdtA.getAddress(), 32))

//         await globalVariablesA.connect(owner).setPeer(eidB, ethers.zeroPadValue(await globalVariablesB.getAddress(), 32))
//         await globalVariablesB.connect(owner).setPeer(eidA, ethers.zeroPadValue(await globalVariablesA.getAddress(), 32))

//         await abondTokenA.setNewBorrowingContract(await BorrowingContractA.getAddress());
//         await abondTokenB.setNewBorrowingContract(await BorrowingContractB.getAddress());

//         await multiSignA.connect(owner).approveSetterFunction([0,1,3,4,5,6,7,8,9]);
//         await multiSignA.connect(owner1).approveSetterFunction([0,1,3,4,5,6,7,8,9]);
//         await multiSignB.connect(owner).approveSetterFunction([0,1,3,4,5,6,7,8,9]);
//         await multiSignB.connect(owner1).approveSetterFunction([0,1,3,4,5,6,7,8,9]);

//         await BorrowingContractA.connect(owner).setAdmin(owner.getAddress());
//         await BorrowingContractB.connect(owner).setAdmin(owner.getAddress());

//         await CDSContractA.connect(owner).setAdmin(owner.getAddress());
//         await CDSContractB.connect(owner).setAdmin(owner.getAddress());

//         // await TokenA.setDstEid(eidB);
//         // await TokenB.setDstEid(eidA);

//         // await usdtA.setDstEid(eidB);
//         // await usdtB.setDstEid(eidA);

//         await globalVariablesA.setDstEid(eidB);
//         await globalVariablesB.setDstEid(eidA);

//         await globalVariablesA.setDstGlobalVariablesAddress(await globalVariablesB.getAddress());
//         await globalVariablesB.setDstGlobalVariablesAddress(await globalVariablesA.getAddress());

//         await globalVariablesA.setTreasury(await treasuryA.getAddress());
//         await globalVariablesB.setTreasury(await treasuryB.getAddress());

//         await globalVariablesA.setBorrowLiq(await BorrowingLiquidationA.getAddress());
//         await globalVariablesB.setBorrowLiq(await BorrowingLiquidationB.getAddress());        
        
//         await globalVariablesA.setBorrowing(await BorrowingContractA.getAddress());
//         await globalVariablesB.setBorrowing(await BorrowingContractB.getAddress());

//         await BorrowingContractA.connect(owner).setTreasury(await treasuryA.getAddress());
//         await BorrowingContractA.connect(owner).setOptions(await optionsA.getAddress());
//         await BorrowingContractA.connect(owner).setBorrowLiquidation(await BorrowingLiquidationA.getAddress());
//         await BorrowingContractA.connect(owner).setLTV(80);
//         await BorrowingContractA.connect(owner).setBondRatio(4);
//         await BorrowingContractA.connect(owner).setAPR(50,BigInt("1000000001547125957863212448"));
//         await BorrowingContractA.connect(owner).setOldBorrow(await BorrowingContractAOld.getAddress());
//         await BorrowingContractA.connect(owner).setOldTreasury(await treasuryAOld.getAddress());

//         await BorrowingContractB.connect(owner).setTreasury(await treasuryB.getAddress());
//         await BorrowingContractB.connect(owner).setOptions(await optionsB.getAddress());
//         await BorrowingContractB.connect(owner).setBorrowLiquidation(await BorrowingLiquidationB.getAddress());
//         await BorrowingContractB.connect(owner).setLTV(80);
//         await BorrowingContractB.connect(owner).setBondRatio(4);
//         await BorrowingContractB.connect(owner).setAPR(50,BigInt("1000000001547125957863212448"));
//         await BorrowingContractB.connect(owner).setOldBorrow(await BorrowingContractBOld.getAddress());
//         await BorrowingContractB.connect(owner).setOldTreasury(await treasuryBOld.getAddress());

//         await BorrowingLiquidationA.connect(owner).setTreasury(await treasuryA.getAddress());
//         await BorrowingLiquidationB.connect(owner).setTreasury(await treasuryB.getAddress());

//         await BorrowingLiquidationA.connect(owner).setAdmin(await owner.getAddress());
//         await BorrowingLiquidationB.connect(owner).setAdmin(await owner.getAddress());

//         await CDSContractA.connect(owner).setTreasury(await treasuryA.getAddress());
//         await CDSContractA.connect(owner).setBorrowingContract(await BorrowingContractA.getAddress());
//         await CDSContractA.connect(owner).setBorrowLiquidation(await BorrowingLiquidationA.getAddress());
//         await CDSContractA.connect(owner).setUSDaLimit(80);
//         await CDSContractA.connect(owner).setUsdtLimit(20000000000);
//         await CDSContractA.connect(owner).setGlobalVariables(await globalVariablesA.getAddress());
//         await CDSContractA.connect(owner).setOldCDS(await CDSContractAOld.getAddress());

//         await CDSContractB.connect(owner).setTreasury(await treasuryB.getAddress());
//         await CDSContractB.connect(owner).setBorrowingContract(await BorrowingContractB.getAddress());
//         await CDSContractB.connect(owner).setBorrowLiquidation(await BorrowingLiquidationB.getAddress());
//         await CDSContractB.connect(owner).setUSDaLimit(80);
//         await CDSContractB.connect(owner).setUsdtLimit(20000000000);
//         await CDSContractB.connect(owner).setGlobalVariables(await globalVariablesB.getAddress());
//         await CDSContractB.connect(owner).setOldCDS(await CDSContractBOld.getAddress());

//         await BorrowingContractA.calculateCumulativeRate();
//         await BorrowingContractB.calculateCumulativeRate();

//         await treasuryA.connect(owner).setExternalProtocolAddresses(
//             wethGatewayMainnet,
//             cometMainnet,
//             aavePoolAddressMainnet,
//             aTokenAddressMainnet,
//             wethAddressMainnet,
//         )
//         await treasuryA.connect(owner).setOldTreasury(await treasuryAOld.getAddress());

//         await treasuryB.connect(owner).setExternalProtocolAddresses(
//             wethGatewayMainnet,
//             cometMainnet,
//             aavePoolAddressMainnet,
//             aTokenAddressMainnet,
//             wethAddressMainnet,
//         )
//         await treasuryB.connect(owner).setOldTreasury(await treasuryBOld.getAddress());


//         const provider = new ethers.JsonRpcProvider(INFURA_URL_MAINNET);
//         const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",provider);

//         const aToken = new ethers.Contract(aTokenAddressMainnet,aTokenABI,signer);
//         const cETH = new ethers.Contract(cometMainnet,cETH_ABI,signer);

//         return {
//             TokenA,abondTokenA,usdtA,
//             CDSContractA,BorrowingContractA,
//             treasuryA,optionsA,multiSignA,
//             BorrowingLiquidationA,globalVariablesA,

//             TokenB,abondTokenB,usdtB,
//             CDSContractB,BorrowingContractB,
//             treasuryB,optionsB,multiSignB,
//             BorrowingLiquidationB,globalVariablesB,

//             owner,user1,user2,user3,
//             provider,signer,TokenC
//         }
//     }

//     describe("Minting tokens and transfering tokens", async function(){

//         it("Should check Trinity Token contract & Owner of contracts",async () => {
//             await loadFixture(deployerOld);
//             const{CDSContractA,TokenA} = await loadFixture(deployer);
//             expect(await CDSContractA.usda()).to.be.equal(await TokenA.getAddress());
//             expect(await CDSContractA.owner()).to.be.equal(await owner.getAddress());
//             expect(await TokenA.owner()).to.be.equal(await owner.getAddress());
//         })

//         it("Should Mint token", async function() {
//             const{TokenA} = await loadFixture(deployer);
//             await TokenA.mint(owner.getAddress(),ethers.parseEther("1"));
//             expect(await TokenA.balanceOf(owner.getAddress())).to.be.equal(ethers.parseEther("1"));
//         })

//         it("should deposit USDT into CDS",async function(){
//             const {CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA} = await loadFixture(deployer);

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
//             await CDSContractB.connect(user1).deposit(10000000000,0,false,10000000000, { value: nativeFee.toString()});
            
//             expect(await CDSContractB.totalCdsDepositedAmount()).to.be.equal(10000000000);

//             let tx = await CDSContractB.cdsDetails(user1.getAddress());
//             expect(tx.hasDeposited).to.be.equal(true);
//             expect(tx.index).to.be.equal(1);
//         })

//         it("should deposit USDT and USDa into CDS", async function(){
//             const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             await usdtA.mint(owner.getAddress(),30000000000);
//             await usdtA.connect(owner).approve(CDSContractA.getAddress(),30000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.deposit(20000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await TokenA.mint(owner.getAddress(),800000000)
//             await TokenA.connect(owner).approve(CDSContractA.getAddress(),800000000);

//             await CDSContractA.connect(owner).deposit(200000000,800000000,true,1000000000, { value: nativeFee.toString()});
//             expect(await CDSContractA.totalCdsDepositedAmount()).to.be.equal(21000000000);

//             let tx = await CDSContractA.cdsDetails(owner.getAddress());
//             expect(tx.hasDeposited).to.be.equal(true);
//             expect(tx.index).to.be.equal(2);
//         })
//     })

//     describe("Checking revert conditions", function(){

//         it("should revert if Liquidation amount can't greater than deposited amount", async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(owner).deposit(3000000000,700000000,true,ethers.parseEther("5000"))).to.be.revertedWith("Liquidation amount can't greater than deposited amount");
//         })

//         it("should revert if 0 USDT deposit into CDS", async function(){
//             const {CDSContractA,TokenA,usdtA} = await loadFixture(deployer);
//             await usdtA.mint(owner.getAddress(),10000000000);
//             await usdtA.connect(owner).approve(CDSContractA.getAddress(),10000000000);

//             expect(await usdtA.allowance(owner.getAddress(),CDSContractA.getAddress())).to.be.equal(10000000000);

//             await expect(CDSContractA.deposit(0,ethers.parseEther("1"),true,ethers.parseEther("0.5"))).to.be.revertedWith("100% of amount must be USDT");
//         })

//         it("should revert if USDT deposit into CDS is greater than 20%", async function(){
//             const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             await usdtA.mint(owner.getAddress(),30000000000);
//             await usdtA.connect(owner).approve(CDSContractA.getAddress(),30000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.deposit(20000000000,0,true,10000000000,{ value: nativeFee.toString()});

//             await TokenA.mint(owner.getAddress(),700000000)
//             await TokenA.connect(owner).approve(CDSContractA.getAddress(),700000000);

//             await expect(CDSContractA.connect(owner).deposit(3000000000,700000000,true,500000000,{ value: nativeFee.toString()})).to.be.revertedWith("Required USDa amount not met");
//         })

//         it("should revert if Insufficient USDa balance with msg.sender", async function(){
//             const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             await usdtA.mint(owner.getAddress(),30000000000);
//             await usdtA.connect(owner).approve(CDSContractA.getAddress(),30000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.deposit(20000000000,0,true,10000000000,{ value: nativeFee.toString()});

//             await TokenA.mint(owner.getAddress(),70000000)
//             await TokenA.connect(owner).approve(CDSContractA.getAddress(),70000000);

//             await expect(CDSContractA.connect(owner).deposit(200000000,800000000,true,500000000,{ value: nativeFee.toString()})).to.be.revertedWith("Insufficient USDa balance with msg.sender");
//         })

//         it("should revert Insufficient USDT balance with msg.sender", async function(){
//             const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             await usdtA.mint(owner.getAddress(),20100000000);
//             await usdtA.connect(owner).approve(CDSContractA.getAddress(),20100000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.deposit(20000000000,0,true,10000000000,{ value: nativeFee.toString()});

//             await TokenA.mint(owner.getAddress(),800000000)
//             await TokenA.connect(owner).approve(CDSContractA.getAddress(),800000000);


//             await expect(CDSContractA.connect(owner).deposit(200000000,800000000,true,500000000,{ value: nativeFee.toString()})).to.be.revertedWith("Insufficient USDT balance with msg.sender");
//         })

//         it("should revert Insufficient USDT balance with msg.sender", async function(){
//             const {CDSContractA,usdtA} = await loadFixture(deployer);
//             await usdtA.mint(owner.getAddress(),10000000000);
//             await usdtA.connect(owner).approve(CDSContractA.getAddress(),10000000000);

//             expect(await usdtA.allowance(owner.getAddress(),CDSContractA.getAddress())).to.be.equal(10000000000);

//             await expect(CDSContractA.deposit(20000000000,0,true,10000000000)).to.be.revertedWith("Insufficient USDT balance with msg.sender");
//         })

//         it("Should revert if zero balance is deposited in CDS",async () => {
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect( CDSContractA.connect(user1).deposit(0,0,true,ethers.parseEther("1"))).to.be.revertedWith("Deposit amount should not be zero");
//         })

//         it("Should revert if Input address is invalid",async () => {
//             const {CDSContractA} = await loadFixture(deployer);  
//             await expect( CDSContractA.connect(owner).setBorrowingContract(ethers.ZeroAddress)).to.be.revertedWith("Input address is invalid");
//             await expect( CDSContractA.connect(owner).setBorrowingContract(user1.getAddress())).to.be.revertedWith("Input address is invalid");
//         })

//         it("Should revert if the index is not valid",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).withdraw(1)).to.be.revertedWith("user doesn't have the specified index");
//         })

//         it("Should revert if the caller is not owner for setTreasury",async function(){
//             const {CDSContractA,treasuryA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).setTreasury(treasuryA.getAddress())).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the caller is not owner for setWithdrawTimeLimit",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).setWithdrawTimeLimit(1000)).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the caller is not owner for setBorrowingContract",async function(){
//             const {BorrowingContractA,CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).setBorrowingContract(BorrowingContractA.getAddress())).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the Treasury address is zero",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(owner).setTreasury(ZeroAddress)).to.be.revertedWith("Input address is invalid");
//         })

//         it("Should revert if the Treasury address is not contract address",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(owner).setTreasury(user2.getAddress())).to.be.revertedWith("Input address is invalid");
//         })

//         it("Should revert if the zero sec is given in setWithdrawTimeLimit",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(owner).setWithdrawTimeLimit(0)).to.be.revertedWith("Withdraw time limit can't be zero");
//         })

//         it("Should revert if USDa limit can't be zero",async () => {
//             const {CDSContractA} = await loadFixture(deployer);  
//             await expect( CDSContractA.connect(owner).setUSDaLimit(0)).to.be.revertedWith("USDa limit can't be zero");
//         })

//         it("Should revert if the caller is not owner for setUSDaLImit",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).setUSDaLimit(10)).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if USDT limit can't be zero",async () => {
//             const {CDSContractA} = await loadFixture(deployer);  
//             await expect( CDSContractA.connect(owner).setUsdtLimit(0)).to.be.revertedWith("USDT limit can't be zero");
//         })

//         it("Should revert if the caller is not owner for setUsdtLImit",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).setUsdtLimit(1000)).to.be.revertedWith("Caller is not an admin");
//         })

        
//         it("Should revert This function can only called by Borrowing contract",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).calculateCumulativeRate(1000)).to.be.revertedWith("This function can only called by Borrowing contract");
//         })
       
//         it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).updateLiquidationInfo(1,[0,1,2,3])).to.be.revertedWith("This function can only called by Global variables or Liquidation contract");
//         })        
//         it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).updateTotalAvailableLiquidationAmount(1000)).to.be.revertedWith("This function can only called by Global variables or Liquidation contract");
//         })        
//         it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).updateTotalCdsDepositedAmount(1000)).to.be.revertedWith("This function can only called by Global variables or Liquidation contract");
//         })        
//         it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).updateTotalCdsDepositedAmountWithOptionFees(1000)).to.be.revertedWith("This function can only called by Global variables or Liquidation contract");
//         })

//         it("should revert Surplus USDT amount",async function(){
//             const {CDSContractA,globalVariablesA,usdtA,usdtB} = await loadFixture(deployer);

//             await usdtA.connect(user1).mint(user1.getAddress(),30000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),30000000000);
//             const options = "0x00030100110100000000000000000000000000030d40";

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             const tx = CDSContractA.connect(user1).deposit(30000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await expect(tx).to.be.revertedWith("Surplus USDT amount");

//         })
//     })

//     describe("Should update variables correctly",function(){
//         it("Should update treasury correctly",async function(){
//             const {treasuryA,CDSContractA,multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approveSetterFunction([6]);
//             await multiSignA.connect(owner1).approveSetterFunction([6]);
//             await CDSContractA.connect(owner).setTreasury(treasuryA.getAddress());
//             expect (await CDSContractA.treasuryAddress()).to.be.equal(await treasuryA.getAddress());     
//         })
//         it("Should update withdrawTime correctly",async function(){
//             const {CDSContractA,multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approveSetterFunction([2]);
//             await multiSignA.connect(owner1).approveSetterFunction([2]);
//             await CDSContractA.connect(owner).setWithdrawTimeLimit(1500);
//             expect (await CDSContractA.withdrawTimeLimit()).to.be.equal(1500);     
//         })
//     })

//     describe("To check CDS withdrawl function",function(){
//         it("Should withdraw from cds,both chains have cds amount and eth deposit",async () => {
//             const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.mint(user2.getAddress(),20000000000)
//             await usdtA.mint(user1.getAddress(),50000000000)
//             await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000, { value: nativeFee.toString()});

//             await usdtB.mint(user2.getAddress(),20000000000)
//             await usdtB.mint(user1.getAddress(),50000000000)
//             await usdtB.connect(user2).approve(CDSContractB.getAddress(),20000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),50000000000);

//             await CDSContractB.connect(user1).deposit(2000000000,0,true,1500000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");
            
//             await BorrowingContractB.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
//             await BorrowingContractA.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
            
//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(3, optionsA, false);

//             await CDSContractA.connect(user2).withdraw(1, { value: nativeFee1});
//         })

//         it("Should withdraw from cds,both chains have cds amount and one chain have eth deposit",async () => {
//             const {BorrowingContractB,CDSContractA,CDSContractB,usdtA,usdtB,treasuryB,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.mint(user2.getAddress(),20000000000)
//             await usdtA.mint(user1.getAddress(),50000000000)
//             await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000, { value: nativeFee.toString()});

//             await usdtB.mint(user2.getAddress(),20000000000)
//             await usdtB.mint(user1.getAddress(),50000000000)
//             await usdtB.connect(user2).approve(CDSContractB.getAddress(),20000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),50000000000);

//             await CDSContractB.connect(user1).deposit(2000000000,0,true,1500000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");
            
//             await BorrowingContractB.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
            
//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(5, optionsA, false)

//             await CDSContractA.connect(user2).withdraw(1, { value: nativeFee1});
//         })

//         it("Should withdraw from cds,one chain have cds amount and both chains have eth deposit",async () => {
//             const {BorrowingContractB,BorrowingContractA,CDSContractA,usdtA,treasuryB,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.mint(user2.getAddress(),20000000000)
//             await usdtA.mint(user1.getAddress(),50000000000)
//             await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");;
            
//             await BorrowingContractB.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
//             await BorrowingContractA.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
            
//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(3, optionsA, false)

//             await CDSContractA.connect(user2).withdraw(1, { value: nativeFee1});
//             // await expect(tx).to.be.revertedWith("CDS: Not enough fund in CDS")

//         })

//         it("Should withdraw from cds,one chain have cds amount and one chain have eth deposit",async () => {
//             const {BorrowingContractB,CDSContractA,usdtA,treasuryB,treasuryA,globalVariablesA,TokenB,provider} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.mint(user2.getAddress(),20000000000)
//             await usdtA.mint(user1.getAddress(),50000000000)
//             await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");
            
//             await BorrowingContractB.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
            
//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(3, optionsA, false);
//             // console.log("LIQ FEES", nativeFee1);

//             const optionsB = Options.newOptions().addExecutorLzReceiveOption(11500000, 0).toHex().toString()
//             let nativeFee2 = 0
//             ;[nativeFee2] = await globalVariablesA.quote(5, optionsB, false)
//             console.log("CDS WITH FEES", nativeFee2);

//             await BorrowingContractB.connect(owner).liquidate(
//                 await user2.getAddress(),
//                 1,
//                 80000,
//                 {value: (nativeFee1).toString()})

//             await CDSContractA.connect(user2).withdraw(1, { value: nativeFee2});
//             // await expect(tx).to.be.revertedWith("CDS: Not enough fund in CDS")
//         })

//         it("Should withdraw from cds",async () => {
//             const {CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await CDSContractA.connect(user1).withdraw(1, { value: nativeFee.toString()});
//         })

//         it("Should revert Already withdrawn",async () => {
//             const {CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await CDSContractA.connect(user1).withdraw(1, { value: nativeFee.toString()});
//             const tx =  CDSContractA.connect(user1).withdraw(1, { value: nativeFee.toString()});
//             await expect(tx).to.be.revertedWith("Already withdrawn");
//         })

//         it("Should revert cannot withdraw before the withdraw time limit",async () => {
//             const {CDSContractA,usdtA,multiSignA,globalVariablesA} = await loadFixture(deployer);

//             await multiSignA.connect(owner).approveSetterFunction([2]);
//             await multiSignA.connect(owner1).approveSetterFunction([2]);
//             await CDSContractA.connect(owner).setWithdrawTimeLimit(1000);

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const tx =  CDSContractA.connect(user1).withdraw(1, { value: nativeFee.toString()});
//             await expect(tx).to.be.revertedWith("cannot withdraw before the withdraw time limit");
//         })
//     })

//     describe("Should redeem USDT correctly",function(){
//         it("Should redeem USDT correctly",async function(){
//             const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             await usdtA.mint(user1.getAddress(),20000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await CDSContractA.connect(user1).deposit(20000000000,0,true,10000000000,{ value: nativeFee.toString()});

//             await TokenA.mint(owner.getAddress(),800000000);
//             await TokenA.connect(owner).approve(CDSContractA.getAddress(),800000000);

//             await CDSContractA.connect(owner).redeemUSDT(800000000,1500,1000,{ value: nativeFee.toString()});

//             expect(await TokenA.totalSupply()).to.be.equal(20000000000);
//             expect(await usdtA.balanceOf(owner.getAddress())).to.be.equal(1200000000);
//         })

//         it("Should revert Amount should not be zero",async function(){
//             const {CDSContractA,globalVariablesA} = await loadFixture(deployer);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             const tx = CDSContractA.connect(owner).redeemUSDT(0,1500,1000,{ value: nativeFee.toString()});
//             await expect(tx).to.be.revertedWith("Amount should not be zero");
//         })

//         it("Should revert Insufficient USDa balance",async function(){
//             const {CDSContractA,TokenA,globalVariablesA} = await loadFixture(deployer);
//             await TokenA.mint(owner.getAddress(),80000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             const tx = CDSContractA.connect(owner).redeemUSDT(800000000,1500,1000,{ value: nativeFee.toString()});
//             await expect(tx).to.be.revertedWith("Insufficient balance");
//         })
//     })

//     describe("Should calculate value correctly",function(){
//         it("Should calculate value for no deposit in borrowing",async function(){
//             const {CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             await usdtA.mint(user1.getAddress(),20000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(20000000000,0,true,10000000000,{ value: nativeFee.toString()});
//         })

//         it("Should calculate value for no deposit in borrowing and 2 deposit in cds",async function(){
//             const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             await usdtA.mint(user1.getAddress(),20000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(20000000000,0,true,10000000000,{ value: nativeFee.toString()});

//             await TokenA.mint(user2.getAddress(),4000000000);
//             await TokenA.connect(user2).approve(CDSContractA.getAddress(),4000000000);
//             await CDSContractA.connect(user2).deposit(0,4000000000,true,4000000000,{ value: nativeFee.toString()});

//             await CDSContractA.connect(user1).withdraw(1,{ value: nativeFee.toString()});
//         })
        
//     })

//     describe("Should continue deposit index with previous", function(){
//         it("Should store the index correctly",async function(){
//             const {
//                 CDSContractAOld,globalVariablesAOld
//             } = await loadFixture(deployerOld);

//             const {
//                 CDSContractA,
//                 usdtA,
//                 treasuryA,globalVariablesA
//             } = await loadFixture(deployer);


//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractAOld.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesAOld.quote(1,options, false)
//             await CDSContractAOld.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             ;[nativeFee] = await globalVariablesA.quote(1,options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const tx = await CDSContractA.getCDSDepositDetails(await user1.getAddress(), 1);
//             expect(tx[1]).to.be.equal(2);
//         })

//         it("Should withdraw from previous",async function(){
//             const {
//                 CDSContractAOld,globalVariablesAOld
//             } = await loadFixture(deployerOld);

//             const {
//                 CDSContractA,
//                 usdtA,globalVariablesA
//             } = await loadFixture(deployer);

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractAOld.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesAOld.quote(1,options, false)
//             await CDSContractAOld.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             ;[nativeFee] = await globalVariablesA.quote(1,options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(3, optionsA, false);

//             await CDSContractA.connect(user1).withdraw(1, { value: nativeFee1});
//         })
//     })
// })
