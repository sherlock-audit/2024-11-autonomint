// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { expect } = require("chai");
// const { it } = require("mocha")
// import { ethers,upgrades } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
// import { describe } from "node:test";
// import { BorrowLib } from "../typechain-types";
// import { Contract, ContractFactory,ZeroAddress } from 'ethers'
// import { Options } from '@layerzerolabs/lz-v2-utilities'

// import {
//     wethGatewayMainnet,wethGatewaySepolia,
//     priceFeedAddressEthToUsdMainnet,priceFeedAddressWeEthToEthMainnet,
//     priceFeedAddressRsEthToEthMainnet,priceFeedAddressSepolia,
//     aTokenAddressMainnet,aTokenAddressSepolia,
//     aavePoolAddressMainnet,aavePoolAddressSepolia,
//     cometMainnet,cometSepolia,
//     INFURA_URL_MAINNET,INFURA_URL_SEPOLIA,
//     aTokenABI,
//     cETH_ABI,
//     wethAddressMainnet,wethAddressSepolia,
//     endPointAddressMainnet,endPointAddressPolygon,
//     } from "./utils/index"
// import { signer } from "@layerzerolabs/devtools-evm-hardhat";

// describe("Borrowing Contract",function(){

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
//             priceFeedAddressEthToUsdMainnet,
//             priceFeedAddressWeEthToEthMainnet,
//             priceFeedAddressRsEthToEthMainnet,
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
//             priceFeedAddressEthToUsdMainnet,
//             priceFeedAddressWeEthToEthMainnet,
//             priceFeedAddressRsEthToEthMainnet,
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
//             priceFeedAddressEthToUsdMainnet,
//             priceFeedAddressWeEthToEthMainnet,
//             priceFeedAddressRsEthToEthMainnet,
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
//             priceFeedAddressEthToUsdMainnet,
//             priceFeedAddressWeEthToEthMainnet,
//             priceFeedAddressRsEthToEthMainnet,
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

//         // await abondTokenA.setNewBorrowingContract(await BorrowingContractA.getAddress());
//         // await abondTokenB.setNewBorrowingContract(await BorrowingContractB.getAddress());

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

//     describe("Should deposit ETH and mint Trinity",function(){

//         it("Should deposit ETH with two cds deposits",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,globalVariablesA
//             } = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1,options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("50");

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
//         })

//         it("Should deposit ETH in different chain with cds deposits",async function(){
//             const {BorrowingContractB,CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1,options, false);
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("50");

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount + BigInt(nativeFee))})
//         })

//         it("Should transfer USDa from A to B",async function(){
//             const {TokenA} = await loadFixture(deployer);
//             const initialAmount = ethers.parseEther('100')
//             await TokenA.mint(await user1.getAddress(), initialAmount)
    
//             const tokensToSend = ethers.parseEther('1')
    
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
    
//             const sendParam = [
//                 eidB,
//                 ethers.zeroPadValue(await user2.getAddress(), 32),
//                 tokensToSend,
//                 tokensToSend,
//                 options,
//                 '0x',
//                 '0x',
//             ]
    
//             const [nativeFee] = await TokenA.quoteSend(sendParam, false)
    
//             await TokenA.connect(user1).send(sendParam, [nativeFee, 0], await user1.getAddress(), { value: nativeFee })
//         })

//         it("Should transfer USDa from A to C",async function(){
//             const {TokenA} = await loadFixture(deployer);
//             const initialAmount = ethers.parseEther('100')
//             await TokenA.mint(await user1.getAddress(), initialAmount)
    
//             const tokensToSend = ethers.parseEther('1')
    
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
    
//             const sendParam = [
//                 eidC,
//                 ethers.zeroPadValue(await user2.getAddress(), 32),
//                 tokensToSend,
//                 tokensToSend,
//                 options,
//                 '0x',
//                 '0x',
//             ]
    
//             const [nativeFee] = await TokenA.quoteSend(sendParam, false)
    
//             await TokenA.connect(user1).send(sendParam, [nativeFee, 0], await user1.getAddress(), { value: nativeFee })
//         })

//         it("Should transfer USDa from B to C",async function(){
//             const {TokenB} = await loadFixture(deployer);
//             const initialAmount = ethers.parseEther('100')
//             await TokenB.mint(await user1.getAddress(), initialAmount)
    
//             const tokensToSend = ethers.parseEther('1')
    
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
    
//             const sendParam = [
//                 eidC,
//                 ethers.zeroPadValue(await user2.getAddress(), 32),
//                 tokensToSend,
//                 tokensToSend,
//                 options,
//                 '0x',
//                 '0x',
//             ]
    
//             const [nativeFee] = await TokenB.quoteSend(sendParam, false)
    
//             await TokenB.connect(user1).send(sendParam, [nativeFee, 0], await user1.getAddress(), { value: nativeFee })
//         })
    
//         it("Should set APY",async function(){
//             const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approveSetterFunction([1]);
//             await multiSignA.connect(owner1).approveSetterFunction([1]);
//             await BorrowingContractA.setAPR(50,BigInt("1000000001547125957863212448"));
//             await expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt("1000000001547125957863212448"));
//         })

//         it("Should called by only owner(setAPR)",async function(){
//             const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approveSetterFunction([1]);
//             await multiSignA.connect(owner1).approveSetterFunction([1]);
//             const tx = BorrowingContractA.connect(user1).setAPR(50,BigInt("1000000001547125957863212448"));
//             await expect(tx).to.be.revertedWith("Caller is not an admin");
//         })
    
//         it("Should revert if rate is zero",async function(){
//             const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approveSetterFunction([1]);
//             await multiSignA.connect(owner1).approveSetterFunction([1]);
//             const tx = BorrowingContractA.connect(owner).setAPR(0,0);
    
//             await expect(tx).to.be.revertedWith("Rate should not be zero");
//         })
    
//         it("Should revert if set APY without approval",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = BorrowingContractA.connect(owner).setAPR(50,BigInt("1000000001547125957863212448"));    
//             await expect(tx).to.be.revertedWith("Required approvals not met");
//         })
    
//         it("Should get LTV",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(await BorrowingContractA.getLTV()).to.be.equal(80);
//         })
//     })

//     describe("Should get the chainlink prices",function(){
//         it("Should get ETH/USD price",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = await BorrowingContractA.getUSDValue();
//             expect(tx).to.be.equal(100000);
//         })

//         it.only("Should get ETH/USD price",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = await BorrowingContractA.getUSDValue();
//             console.log(tx);
//         })

//         it.only("Should get WeETH/USD price",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = await BorrowingContractA.getWeEthUSDValue();
//             console.log(tx);
//         })

//         it.only("Should get rsETH/USD price",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = await BorrowingContractA.getRsEthUSDValue();
//             console.log(tx);
//         })
//     })

//     describe("Should revert errors",function(){
//         it("Should revert if zero eth is deposited",async function(){
//             const {CDSContractA,BorrowingContractA,globalVariablesA,usdtA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
 

//             const tx = BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 0,
//                 {value: (BigInt(0) +  BigInt(nativeFee))})
//             await expect(tx).to.be.revertedWith("Cannot deposit zero tokens");
//         })

//         // it("Should revert if LTV set to zero value before providing loans",async function(){
//         //     const {BorrowingContractA,CDSContractA,treasuryA,usdtA} = await loadFixture(deployer);
//         //     await BorrowingContractA.setLTV(0);          
//         //     const timeStamp = await time.latest();
//         //     const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//         //     let nativeFee = 0
//         //     ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//         //     let nativeFee1 = 0
//         //     ;[nativeFee1] = await BorrowingContractA.quote(eidB, [5,10,15,20,25,30,35,40],options, false)
//         //     let nativeFee2 = 0
//         //     ;[nativeFee2] = await treasuryA.quote(eidB,1, [ZeroAddress,0],[ZeroAddress,0],options, false)

//         //     await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//         //     await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//         //     await CDSContractA.connect(user1).deposit(10000000000,0,false,0, { value: nativeFee.toString()});

//         //     const tx =  BorrowingContractA.connect(user1).depositTokens(
//         //         100000,
//         //         timeStamp,
//         //         1,
//         //         110000,
//         //         ethVolatility,
//         //         ethers.parseEther("1"),
//         //         {value: (ethers.parseEther("1") +  BigInt(nativeFee))})

//         //     await expect(tx).to.be.revertedWith("LTV must be set to non-zero value before providing loans");
//         // })

//         it("Should revert if LTV set to zero",async function(){
//             const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approveSetterFunction([0]);
//             await multiSignA.connect(owner1).approveSetterFunction([0]);
//             const tx = BorrowingContractA.connect(owner).setLTV(0);          
//             await expect(tx).to.be.revertedWith("LTV can't be zero");
//         })

//         it("Should revert if the caller is not owner for setTreasury",async function(){
//             const {BorrowingContractA,treasuryA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(user1).setTreasury(await treasuryA.getAddress())).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the Treasury address is zero",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(owner).setTreasury(ZeroAddress)).to.be.revertedWith("Treasury must be contract address & can't be zero address");
//         })

//         it("Should revert if the caller is not owner for setBorrowLiquidation",async function(){
//             const {BorrowingContractA,BorrowingLiquidationA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(user1).setBorrowLiquidation(await BorrowingLiquidationA.getAddress())).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the BorrowLiquidation address is zero",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(owner).setBorrowLiquidation(ZeroAddress)).to.be.revertedWith("Borrow Liquidation must be contract address & can't be zero address");
//         })

//         it("Should revert if the caller is not owner for setBorrowLiquidation",async function(){
//             const {CDSContractA,BorrowingLiquidationA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).setBorrowLiquidation(await BorrowingLiquidationA.getAddress())).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the BorrowLiquidation address is zero",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(owner).setBorrowLiquidation(ZeroAddress)).to.be.revertedWith("Input address is invalid");
//         })

//         it("Should revert if the caller is not owner for setBondRatio",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(user1).setBondRatio(4)).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the BOND RATIO is zero",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(owner).setBondRatio(0)).to.be.revertedWith("Bond Ratio can't be zero");
//         })

//         it("Should revert if the caller is not owner for setOptions",async function(){
//             const {BorrowingContractA,optionsA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(user1).setOptions(await optionsA.getAddress())).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if the Options address is zero",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(owner).setOptions(ZeroAddress)).to.be.revertedWith("Options must be contract address & can't be zero address");
//         })

//         it("Should revert if the caller is not owner for setAdmin",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(user1).setAdmin(owner.getAddress())).to.be.revertedWith("Ownable: caller is not the owner");
//         })

//         it("Should revert if the Admin address is zero",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             await expect(BorrowingContractA.connect(owner).setAdmin(ZeroAddress)).to.be.revertedWith("Admin can't be contract address & zero address");
//         })

//         it("Should revert if the Treasury address is zero",async function(){
//             const {BorrowingLiquidationA} = await loadFixture(deployer);
//             await expect(BorrowingLiquidationA.connect(owner).setTreasury(ZeroAddress)).to.be.revertedWith("Treasury must be contract address & can't be zero address");
//         })

//         it("Should revert if the caller is not owner for setAdmin",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(user1).setAdmin(owner.getAddress())).to.be.revertedWith("Ownable: caller is not the owner");
//         })

//         it("Should revert if the Admin address is zero",async function(){
//             const {CDSContractA} = await loadFixture(deployer);
//             await expect(CDSContractA.connect(owner).setAdmin(ZeroAddress)).to.be.revertedWith("Admin can't be contract address & zero address");
//         })

//         it("Should revert if caller is not owner(setLTV)",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = BorrowingContractA.connect(user1).setLTV(80);
//             await expect(tx).to.be.revertedWith("Caller is not an admin");
//         })

//         it("Should revert if caller is not treasury(updateLastEthVaultValue)",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = BorrowingContractA.connect(user1).updateLastEthVaultValue(100);
//             await expect(tx).to.be.revertedWith("Function should only be called by treasury");
//         })

//         it("Should revert if ratio is not eligible",async function(){
//             const {BorrowingContractB,CDSContractA,usdtA,treasuryA,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             await usdtA.connect(user1).mint(user1.getAddress(),100000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),100000000);
//             await CDSContractA.connect(user1).deposit(100000000,0,true,50000000, { value: nativeFee.toString()});

//             const tx = BorrowingContractB.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
//             await expect(tx).to.be.revertedWith("Not enough fund in CDS");
//         })

//         it("Should return true if the address is contract address ",async function(){
//             const {BorrowingContractA,treasuryA} = await loadFixture(deployer);
//             const tx = await BorrowingContractA.isContract(await treasuryA.getAddress());
//             await expect(tx).to.be.equal(true);
//         })

//         it("Should return false if the address is not contract address ",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
//             const tx = await BorrowingContractA.isContract(user1.getAddress());
//             await expect(tx).to.be.equal(false);
//         })

//         it("Should revert if called by other than borrowing contract",async function(){
//             const {treasuryA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             const tx =  treasuryA.connect(user1).deposit(
//                 user1.getAddress(),
//                 100000,
//                 timeStamp,
//                 {value: ethers.parseEther("1")});
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");    
//         })

//         it("Should revert if called by other than borrowing contract",async function(){
//             const {treasuryA} = await loadFixture(deployer);
//             const tx =  treasuryA.connect(user1).withdraw(user1.getAddress(),user1.getAddress(),1000,1);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");    
//         })

//         it("Should revert if called by other than CDS contract",async function(){
//             const {treasuryA} = await loadFixture(deployer);
//             const tx =  treasuryA.connect(user1).transferEthToCdsLiquidators(user1.getAddress(),1);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");    
//         })

//         it("Should revert if the address is zero",async function(){
//             const {treasuryA} = await loadFixture(deployer);
//             await expect(treasuryA.connect(owner).withdrawInterest(ZeroAddress,0)).to.be.revertedWith("Input address or amount is invalid");
//         })

//         it("Should revert if the caller is not owner",async function(){
//             const {treasuryA} = await loadFixture(deployer);
//             await expect(treasuryA.connect(user1).withdrawInterest(user1.getAddress(),100)).to.be.revertedWith("Ownable: caller is not the owner");
//         })

//         it("Should revert if Treasury don't have enough interest",async function(){
//             const {treasuryA} = await loadFixture(deployer);
//             await expect(treasuryA.connect(owner).withdrawInterest(user1.getAddress(),100)).to.be.revertedWith("Treasury don't have enough interest");
//         })

//         it("Should revert if msg.value is less than depositing amount in borrow deposit",async function(){
//             const {
//                 globalVariablesA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA
//             } = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
            
//             const depositAmount = ethers.parseEther("50");

 

//             const tx =  BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 (depositAmount + depositAmount),
//                 {value: (depositAmount +  BigInt(nativeFee))})
//             await expect(tx).to.be.revertedWith("Borrowing: Don't have enough LZ fee");
//         })

//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.withdrawFromExternalProtocol(await user1.getAddress(),100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.calculateYieldsForExternalProtocol(await user1.getAddress(),100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })        
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateDepositDetails(
//                 await user1.getAddress(),
//                 1,
//             [1,2,3,4,5,6,78,false,9,true,4,5,2,4,5,6,7,8]);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateHasBorrowed(await user1.getAddress(),true);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateTotalDepositedAmount(await user1.getAddress(),100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateTotalBorrowedAmount(await user1.getAddress(),100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateTotalInterest(100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateTotalInterestFromLiquidation(100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateAbondUSDaPool(100,true);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateUSDaGainedFromLiquidation(100,true);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         // it("Should revert This function can only called by Core contracts",async function(){
//         //     const { treasuryA } = await loadFixture(deployer);
//         //     const tx = treasuryA.updateEthProfitsOfLiquidators(100,true);
//         //     await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         // })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.updateInterestFromExternalProtocol(100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.getExternalProtocolCumulativeRate(true);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.approveUSDa(await user1.getAddress(),100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.approveUsdt(await user1.getAddress(),100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })

//         it("Should revert This function can only called by Core contracts",async function(){
//             const { treasuryA } = await loadFixture(deployer);
//             const tx = treasuryA.transferEthToCdsLiquidators(await user1.getAddress(),100);
//             await expect(tx).to.be.revertedWith("This function can only called by Core contracts");
//         })
//     })

//     describe("Should update all state changes correctly",function(){
//         it("Should update deposited amount",async function(){
//             const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesB.quote(1, options, false)
 

//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
//             const tx = await treasuryA.borrowing(user1.getAddress());
//             await expect(tx[0]).to.be.equal(ethers.parseEther("1"))
//         })

//         it("Should update depositedAmount correctly if deposited multiple times",async function(){
//             const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesB.quote(1, options, false)
 
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("2"),
//                 {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("3"),
//                 {value: (ethers.parseEther("3") +  BigInt(nativeFee))})                    
//             const tx = await treasuryA.borrowing(user1.getAddress());
//             await expect(tx[0]).to.be.equal(ethers.parseEther("6"))
//         })

//         it("Should update hasDeposited or not",async function(){
//             const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesB.quote(1, options, false)
 
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
//             const tx = await treasuryA.borrowing(user1.getAddress());
//             await expect(tx[3]).to.be.equal(true);
//         })

//         it("Should update borrowerIndex",async function(){
//             const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
 
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
//             const tx = await treasuryA.borrowing(user1.getAddress());
//             const tx3 = await treasuryA.getBorrowing(user1.getAddress(), tx[4]);
//             console.log(tx3);
//             const tx4 = await CDSContractA.cdsDetails(user1.getAddress());
//             console.log(tx4);
//             const tx5 = await CDSContractA.getCDSDepositDetails(user1.getAddress(), tx4[0]);
//             console.log(tx5);
//             await expect(tx[4]).to.be.equal(1);
//         })

//         it("Should update borrowerIndex correctly if deposited multiple times",async function(){
//             const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
 
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("1"),
//                 {value: (ethers.parseEther("1") +  BigInt(nativeFee))})                    
//             const tx = await treasuryA.borrowing(user1.getAddress());
//             await expect(tx[4]).to.be.equal(3);
//         })

//         it("Should update totalVolumeOfBorrowersinUSD",async function(){
//             const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesB.quote(1, options, false)
 
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("2"),
//                 {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
//             await expect(await treasuryA.totalVolumeOfBorrowersAmountinUSD()).to.be.equal(ethers.parseEther("200000"));
//         })

//         it("Should update totalVolumeOfBorrowersinUSD if multiple users deposit in different ethPrice",async function(){
//             const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
 
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("2"),
//                 {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
//             await BorrowingContractA.connect(user2).depositTokens(
//                 150000,
//                 timeStamp,
//                 1,
//                 165000,
//                 ethVolatility,
//                 ethers.parseEther("2"),
//                 {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
//             await expect(await treasuryA.totalVolumeOfBorrowersAmountinUSD()).to.be.equal(ethers.parseEther("500000"));
//         })

//         it("Should update totalVolumeOfBorrowersinWei",async function(){
//             const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
 
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("2"),
//                 {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
//             await BorrowingContractA.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 ethers.parseEther("3"),
//                 {value: (ethers.parseEther("3") +  BigInt(nativeFee))})
//             await expect(await treasuryA.totalVolumeOfBorrowersAmountinWei()).to.be.equal(ethers.parseEther("5"));
//         })

//     })

//     describe("Should withdraw ETH from protocol",function(){
//         it("Should withdraw ETH (between 0.8 and 1)",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});

//         })

//         it("Should withdraw ETH(>1)",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 110000,
//                 timeStamp,
//                 {value: nativeFee});

//         })

//         it("Should withdraw ETH(=1)",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 100000,
//                 timeStamp,
//                 {value: nativeFee});

//         })

//         it("Should revert To address is zero and contract address",async function(){
//             const {BorrowingContractA,treasuryA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             const tx = BorrowingContractA.connect(user1).withDraw(ZeroAddress,1,99900,timeStamp);
//             await expect(tx).to.be.revertedWith("To address cannot be a zero and contract address");

//             const tx1 = BorrowingContractA.connect(user1).withDraw(await treasuryA.getAddress(),1,99900,timeStamp);
//             await expect(tx1).to.be.revertedWith("To address cannot be a zero and contract address");
//         })

//         it("Should revert if User doens't have the perticular index",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             const tx =  BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 2,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});
//             await expect(tx).to.be.revertedWith("User doens't have the perticular index");
//         })

//         it("Should revert if BorrowingHealth is Low",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             const tx = BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 80000,
//                 timeStamp,
//                 {value: nativeFee});
//             await expect(tx).to.be.revertedWith("BorrowingHealth is Low");
//         })

//         it("Should revert if User already withdraw entire amount",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});

//             const tx = BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});
//             await expect(tx).to.be.revertedWith("User already withdraw entire amount");
//         })

//         it("Should revert if User amount has been liquidated",async function(){
//             const {BorrowingContractB,CDSContractA,globalVariablesA,usdtA,treasuryB} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("1");

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})

//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);

//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(3, optionsA, false)
//             await BorrowingContractB.connect(owner).liquidate(
//                 await user2.getAddress(),
//                 1,
//                 80000,
//                 {value: nativeFee1})
//             const tx = BorrowingContractB.connect(user2).withDraw(
//                 await user2.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee1});            
//             await expect(tx).to.be.revertedWith("User amount has been liquidated");
//         })

//         it("Should revert User balance is less than required",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             const tx =  BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});
//             await expect(tx).to.be.revertedWith("User balance is less than required");
//         })
//     })

//     describe("Should Liquidate ETH from protocol",function(){
//         it("Should Liquidate ETH",async function(){
//             const {BorrowingContractB,CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("1");

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})

//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);

//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(3, optionsA, false)
//             await BorrowingContractB.connect(owner).liquidate(
//                 await user2.getAddress(),
//                 1,
//                 80000,
//                 {value: nativeFee1})
//         })

//         it("Should revert Already liquidated",async function(){
//             const {BorrowingContractB,CDSContractA,usdtA,globalVariablesA,treasuryB} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("1");

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})

//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);

//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(1000000, 0).toHex().toString()
//             let nativeFee1 = 0
//             ;[nativeFee1] = await globalVariablesA.quote(3, optionsA, false)
//             await BorrowingContractB.connect(owner).liquidate(
//                 await user2.getAddress(),
//                 1,
//                 80000,
//                 {value: nativeFee1})

//             const tx = BorrowingContractB.connect(owner).liquidate(
//                 await user2.getAddress(),
//                 1,
//                 80000,
//                 {value: nativeFee1})
//             await expect(tx).to.be.revertedWith('Already Liquidated');
//         })

//         it("Should revert if other than admin tried to Liquidate",async function(){
//             const {BorrowingContractA} = await loadFixture(deployer);
            
//             const tx = BorrowingContractA.connect(user2).liquidate(user1.getAddress(),1,80000);
//             await expect(tx).to.be.revertedWith('Caller is not an admin');
//         })

//         it("Should revert To address is zero",async function(){
//             const {BorrowingContractA,globalVariablesA,treasuryB} = await loadFixture(deployer);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             const tx = BorrowingContractA.connect(owner).liquidate(ethers.ZeroAddress,1,100000,{value: nativeFee});
//             await expect(tx).to.be.revertedWith("To address cannot be a zero address");
//         })

//         it("Should revert You cannot liquidate your own assets!",async function(){
//             const {BorrowingContractA,globalVariablesA,treasuryB} = await loadFixture(deployer);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)

//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(600000, 0).toHex().toString()

//             const tx = BorrowingContractA.connect(owner).liquidate(owner.getAddress(),1,100000,{value: nativeFee});
//             await expect(tx).to.be.revertedWith("You cannot liquidate your own assets!");
//         })

//         it("Should revert You cannot liquidate",async function(){
//             const {BorrowingContractB,CDSContractA,usdtA,globalVariablesA,treasuryB} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("1");

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})

//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);

//             const optionsA = Options.newOptions().addExecutorLzReceiveOption(600000, 0).toHex().toString()
            
//             const tx = BorrowingContractB.connect(owner).liquidate(
//                 await user2.getAddress(),
//                 1,
//                 100000,
//                 {value: nativeFee})
//             await expect(tx).to.be.revertedWith("You cannot liquidate, ratio is greater than 0.8");
//         })
//     })

//     describe("Should revert multisign errors",function(){
//         it("Should revert if non owner tried to approve pausing",async function(){
//             const {multiSignA} = await loadFixture(deployer);
//             await expect(multiSignA.connect(user1).approvePause([0])).to.be.revertedWith("Not an owner");
//         })

//         it("Should revert if non owner tried to approve unpausing",async function(){
//             const {multiSignA} = await loadFixture(deployer);
//             await expect(multiSignA.connect(user1).approveUnPause([2])).to.be.revertedWith("Not an owner");
//         })

//         it("Should revert if tried to approve pausing twice ",async function(){
//             const {multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approvePause([0]);
//             await expect(multiSignA.connect(owner).approvePause([0])).to.be.revertedWith('Already approved');
//         })

//         it("Should revert caller is not the owner if tried to pause Borrowing",async function(){
//             const {multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approvePause([1]);
//             await multiSignA.connect(owner1).approvePause([1]);
//             await expect(multiSignA.connect(user1).pauseFunction([1])).to.be.revertedWith("Not an owner");
//         })

//         it("Should revert caller is not the owner if tried to unpause Borrowing",async function(){
//             const {multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approveUnPause([0]);
//             await multiSignA.connect(owner1).approveUnPause([0]);
//             await expect(multiSignA.connect(user1).unpauseFunction([1])).to.be.revertedWith("Not an owner");
//         })

//         it("Should revert if tried to pause Borrowing before attaining required approvals",async function(){
//             const {multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approvePause([1]);
//             await expect(multiSignA.connect(owner).pauseFunction([1])).to.be.revertedWith('Required approvals not met');
//         })

//         it("Should revert if tried to unpause Borrowing before attaining required approvals",async function(){
//             const {multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approvePause([1]);
//             await multiSignA.connect(owner1).approvePause([1]);
//             await multiSignA.connect(owner).pauseFunction([1]);

//             await multiSignA.connect(owner).approveUnPause([1]);
//             await expect(multiSignA.connect(owner).unpauseFunction([1])).to.be.revertedWith('Required approvals not met');
//         })

//         it("Should revert if tried to deposit ETH in borrowing when it is paused",async function(){
//             const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await multiSignA.connect(owner).approvePause([0]);
//             await multiSignA.connect(owner1).approvePause([0]);
//             await multiSignA.connect(owner).pauseFunction([0]);

//             const tx = BorrowingContractA.connect(user2).depositTokens(100000,timeStamp,1,110000,ethVolatility,ethers.parseEther("1"),{value: ethers.parseEther("1")});
//             await expect(tx).to.be.revertedWith('Paused');
//         })

//         it("Should revert if tried to deposit USDT or USDa in CDS when it is paused",async function(){
//             const {CDSContractA,multiSignA,usdtA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approvePause([4]);
//             await multiSignA.connect(owner1).approvePause([4]);
//             await multiSignA.connect(owner).pauseFunction([4]);

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const tx = CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000);
//             await expect(tx).to.be.revertedWith('Paused');
//         })

//         it("Should revert if tried to redeem USDT in cds when it is paused",async function(){
//             const {CDSContractA,multiSignA} = await loadFixture(deployer);
//             await multiSignA.connect(owner).approvePause([6]);
//             await multiSignA.connect(owner1).approvePause([6]);
//             await multiSignA.connect(owner).pauseFunction([6]);

//             const tx = CDSContractA.connect(user2).redeemUSDT(ethers.parseEther("800"),1500,1000);
//             await expect(tx).to.be.revertedWith('Paused');
//         })

//         it("Should revert if tried to withdraw ETH in borrowing when it is paused",async function(){
//             const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await multiSignA.connect(owner).approvePause([1]);
//             await multiSignA.connect(owner1).approvePause([1]);
//             await multiSignA.connect(owner).pauseFunction([1]);
//             const tx = BorrowingContractA.connect(user2).withDraw(user2.getAddress(),1,99900,timeStamp);
//             await expect(tx).to.be.revertedWith('Paused');
//         })

//         it("Should revert if tried to withdraw USDa in CDS when it is paused",async function(){
//             const {CDSContractA,multiSignA} = await loadFixture(deployer);

//             await multiSignA.connect(owner).approvePause([5]);
//             await multiSignA.connect(owner1).approvePause([5]);
//             await multiSignA.connect(owner).pauseFunction([5]);
            
//             const tx = CDSContractA.connect(user1).withdraw(1);

//             await expect(tx).to.be.revertedWith('Paused');
//         })

//         it("Should revert if tried to Liquidate in borrowing when it is paused",async function(){
//             const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            
//             await multiSignA.connect(owner).approvePause([2]);
//             await multiSignA.connect(owner1).approvePause([2]);
//             await multiSignA.connect(owner).pauseFunction([2]);
            
//             const tx = BorrowingContractA.liquidate(user1.getAddress(),1,80000);
//             await expect(tx).to.be.revertedWith('Paused');
//         })
//     })

//     describe("Should ABOND be fungible",function(){
//         it("Should store genesis cumulative rate correctly",async function(){
//             const {
//                 globalVariablesA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("50");

 

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})

//             const tx = await abondTokenB.userStatesAtDeposits(user2.address, 1);
//             await expect(tx[0]).to.be.equal(1000000000000000000000000000n)
//         })
            
//         it("Should store eth backed during deposit correctly",async function(){
//             const {
//                 globalVariablesA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);
//             const timeStamp = await time.latest();

//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()

//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractB.connect(user2).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const tx = await abondTokenB.userStatesAtDeposits(user2.address, 1);
//             await expect(tx[1]).to.be.equal(500000000000000000n);
//         })

//         it("Should store cumulative rate and eth backed after withdraw correctly",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,abondTokenA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});

//             const tx = await abondTokenA.userStates(user1.address);
//             await expect(tx[0]).to.be.equal(1000000000000000000000000000n);
//             const abondBalance = ((500000000000000000 * 999 * 0.8)/4);
//             const ethBackedPerAbond = BigInt(500000000000000000 * 1e18/abondBalance);
//             await expect(tx[2]).to.be.equal(BigInt(abondBalance));
//             await expect(tx[1]).to.be.equal(ethBackedPerAbond);
//             await expect(tx[0]).to.be.equal(1000000000000000000000000000n)
//         })

//         it("Should store cumulative rate and eth backed for multiple index correctly",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,abondTokenA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
                
//             const blockNumber1 = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock1 = await ethers.provider.getBlock(blockNumber1);
//             const latestTimestamp2 = latestBlock1.timestamp;
//             await time.increaseTo(latestTimestamp2 + 2592000);
                
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
    
//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 2,
//                 99500,
//                 timeStamp,
//                 {value: nativeFee});

//             const tx = await abondTokenA.userStates(user1.address);

//             const abondBalance1 = ((500000000000000000 * 999 * 0.8)/4);
//             const abondBalance2 = ((500000000000000000 * 995 * 0.8)/4);

//             await expect(tx[2]).to.be.equal(BigInt(abondBalance1+abondBalance2));
//         })

//         it("Should redeem abond",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,abondTokenA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});

//             await abondTokenA.connect(user1).approve(await BorrowingContractA.getAddress(), await abondTokenA.balanceOf(user1.address));
//             await BorrowingContractA.connect(user1).redeemYields(await user1.getAddress(), await abondTokenA.balanceOf(await user1.getAddress()));
//         })

//         // it("Should store cumulative rate and eth backed for multiple transfers correctly",async function(){
//         //     const {BorrowingContract,Token,usdt,CDSContract} = await loadFixture(deployer);
//         //     const timeStamp = await time.latest();
//         //     await usdt.connect(user1).mint(user1.getAddress(),10000000000)
//         //     await usdt.connect(user1).approve(CDSContract.getAddress(),10000000000);
//         //     await CDSContract.connect(user1).deposit(10000000000,0,true,10000000000);

//         //     await BorrowingContract.connect(user1).depositTokens(100000,timeStamp,1,110000,ethVolatility,{value: ethers.parseEther("1")});
            
//         //     const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//         //     const latestBlock = await ethers.provider.getBlock(blockNumber);
//         //     const latestTimestamp1 = latestBlock.timestamp;
//         //     await time.increaseTo(latestTimestamp1 + 2592000);

//         //     await BorrowingContract.calculateCumulativeRate();
//         //     await Token.connect(user1).mint(user1.address, 50000000);
//         //     await Token.connect(user1).approve(await BorrowingContract.getAddress(),await Token.balanceOf(user1.getAddress()));
//         //     await BorrowingContract.connect(user1).withDraw(user1.getAddress(),1,99900,timeStamp);

//         //     await BorrowingContract.connect(user1).depositTokens(100000,timeStamp,1,110000,ethVolatility,{value: ethers.parseEther("1")});

//         //     const blockNumber1 = await ethers.provider.getBlockNumber(); // Get latest block number
//         //     const latestBlock1 = await ethers.provider.getBlock(blockNumber1);
//         //     const latestTimestamp2 = latestBlock1.timestamp;
//         //     await time.increaseTo(latestTimestamp2 + 2592000);

//         //     await BorrowingContract.calculateCumulativeRate();
//         //     await Token.connect(user1).mint(user1.address, 5000000);
//         //     await Token.connect(user1).approve(await BorrowingContract.getAddress(),await Token.balanceOf(user1.getAddress()));
//         //     await BorrowingContract.connect(user1).withDraw(user1.getAddress(),2,99000,timeStamp);

//         //     // await abondToken.connect(user1).approve(await BorrowingContract.getAddress(), await abondToken.balanceOf(user1.address));
//         //     // await BorrowingContract.connect(user1).redeemYields(await user1.getAddress(), await abondToken.balanceOf(await user1.getAddress()));
//         // })

//         it("Should get withdraw amount",async function(){
//             const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,abondTokenA} = await loadFixture(deployer);
//             const timeStamp = await time.latest();
//             await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
//             await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

//             const options = Options.newOptions().addExecutorLzReceiveOption(250000, 0).toHex().toString()
//             let nativeFee = 0
//             ;[nativeFee] = await globalVariablesA.quote(1, options, false)
//             await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});

//             const depositAmount = ethers.parseEther("1");

 

//             await BorrowingContractA.connect(user1).depositTokens(
//                 100000,
//                 timeStamp,
//                 1,
//                 110000,
//                 ethVolatility,
//                 depositAmount,
//                 {value: (depositAmount +  BigInt(nativeFee))})
            
//             const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
//             const latestBlock = await ethers.provider.getBlock(blockNumber);
//             const latestTimestamp1 = latestBlock.timestamp;
//             await time.increaseTo(latestTimestamp1 + 2592000);
            
//             await BorrowingContractA.calculateCumulativeRate();
//             await TokenA.mint(user1.getAddress(),80000000);
//             await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

//             await BorrowingContractA.connect(user1).withDraw(
//                 await user1.getAddress(), 
//                 1,
//                 99900,
//                 timeStamp,
//                 {value: nativeFee});

//             const tx = await BorrowingContractA.getAbondYields(user1.getAddress(), await abondTokenA.balanceOf(user1.getAddress()));
//             console.log(tx);
//         })

//     })

//     describe("Should change apr based on USDa price", function(){
//         it("Should change the apr $0.90",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9000);
//             expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000007075835619725814915'));
//         })
//         it("Should change the apr for $0.95",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9500);
//             expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000004431822129783699001'));
//         })
//         it("Should change the apr $0.975",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9750);
//             expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000003022265980097387650'));
//         })
//         it("Should change the apr $0.985",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9850);
//             expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000002293273137447730714'));
//         })
//         it("Should change the apr $1.00",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(10000);
//             expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000001547125957863212448'));
//         })
//         it("Should change the apr $1.015",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(10150);
//             expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000001243680656318820312'));
//         })
//         it("Should change the apr $1.045",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(10450);
//             expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000000782997609082909351'));
//         })
//         it("Should change the apr $1.1",async function(){
//             const {
//                 BorrowingContractA,BorrowingContractB,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,abondTokenB
//             } = await loadFixture(deployer);

//             await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(11000);
//             await expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000000158153903837946257'));
//         })
//     })

//     describe("Should continue deposit index with previous", function(){
//         it("Should store the index correctly",async function(){
//             const {
//                 BorrowingContractAOld,CDSContractAOld,globalVariablesAOld
//             } = await loadFixture(deployerOld);

//             const {
//                 BorrowingContractA,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,globalVariablesA
//             } = await loadFixture(deployer);

//             const timeStamp = await time.latest();

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

//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("50");

//             await BorrowingContractAOld.connect(user2).depositTokens(
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

//             const tx = await treasuryA.getBorrowing(await user2.getAddress(), 1);
//             expect(tx[0]).to.be.equal(2);
//         })

//         it("Should withdraw from previous",async function(){
//             const {
//                 BorrowingContractAOld,CDSContractAOld,globalVariablesAOld,TokenA,
//             } = await loadFixture(deployerOld);

//             const {
//                 BorrowingContractA,
//                 CDSContractA,CDSContractB,
//                 usdtA,usdtB,
//                 treasuryA,globalVariablesA
//             } = await loadFixture(deployer);


//             const timeStamp = await time.latest();

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

//             await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
//             await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
//             await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000, { value: nativeFee.toString()});
            
//             const depositAmount = ethers.parseEther("1");

//             await BorrowingContractAOld.connect(user2).depositTokens(
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

//             const tx = await treasuryA.getBorrowing(await user2.getAddress(), 1);
//             expect(tx[0]).to.be.equal(2);

//             await BorrowingContractAOld.calculateCumulativeRate();
//             await TokenA.mint(user2.getAddress(),80000000);
//             await TokenA.connect(user2).approve(await BorrowingContractAOld.getAddress(),await TokenA.balanceOf(user2.getAddress()));
            
//             await BorrowingContractA.connect(user2).withDraw(
//                 await user2.getAddress(), 
//                 1,
//                 110000,
//                 timeStamp,
//                 {value: nativeFee});
//         })
//     })
// })
