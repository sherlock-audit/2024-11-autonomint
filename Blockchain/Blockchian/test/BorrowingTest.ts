const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { it } = require("mocha")
import { ethers,upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { describe } from "node:test";
import { AbstractProvider, AddressLike, Contract, ZeroAddress } from 'ethers'
import { Options } from '@layerzerolabs/lz-v2-utilities'

import {
    INFURA_URL_MAINNET,
    ethAddressMainnet,
    priceFeedAddressWeEthToEthMode,
    priceFeedAddressRsEthToEthMode,
    ionicMode,
    wethAddressMode,
    odosRouterAddressMode
    } from "./utils/index"

describe("Borrowing Contract",function(){

    let owner: any;
    let owner1: any;
    let owner2: any;
    let user1: any;
    let user2: any;
    let user3: any;
    let TokenA: Contract
    let abondTokenA: Contract
    let usdtA: Contract
    let weETHA: Contract
    let wrsETHA: any
    let CDSContractA: Contract
    let BorrowingContractA: Contract
    let treasuryA: Contract
    let optionsA: Contract
    let multiSignA: Contract
    let BorrowingLiquidationA: Contract
    let globalVariablesA: Contract
    let priceFeedAddressMainnetA: string;

    let TokenB: Contract
    let abondTokenB: Contract
    let usdtB: Contract
    let weETHB: Contract
    let wrsETHB: any
    let CDSContractB: Contract
    let BorrowingContractB: Contract
    let treasuryB: Contract
    let optionsB: Contract
    let multiSignB: Contract
    let BorrowingLiquidationB: Contract
    let priceFeedAddressMainnetB: string;

    let globalVariablesB: Contract
    let TokenC: Contract
    let provider: AbstractProvider;
    let signer;
    const eidA = 1
    const eidB = 2
    const eidC = 3
    const ethVolatility = 50622665;
    
    async function deployer(){
        [owner,owner1,owner2,user1,user2,user3] = await ethers.getSigners();
        const EndpointV2Mock = await ethers.getContractFactory('EndpointV2Mock')
        const mockEndpointV2A = await EndpointV2Mock.deploy(eidA)
        const mockEndpointV2B = await EndpointV2Mock.deploy(eidB)
        const mockEndpointV2C = await EndpointV2Mock.deploy(eidC)

        const weETH = await ethers.getContractFactory("WEETH");
        weETHA = await upgrades.deployProxy(weETH,[
            await mockEndpointV2A.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        weETHB = await upgrades.deployProxy(weETH,[
            await mockEndpointV2B.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        const wrsETH = await ethers.getContractFactory("ERC20Mock");
        wrsETHA = await wrsETH.deploy();

        wrsETHB = await wrsETH.deploy();

        const rsETH = await ethers.getContractFactory("RSETH");
        const rsETHA = await upgrades.deployProxy(rsETH,[
            await mockEndpointV2A.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        const rsETHB = await upgrades.deployProxy(rsETH,[
            await mockEndpointV2B.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        const USDaStablecoin = await ethers.getContractFactory("TestUSDaStablecoin");
        TokenA = await upgrades.deployProxy(USDaStablecoin,[
            await mockEndpointV2A.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        TokenB = await upgrades.deployProxy(USDaStablecoin,[
            await mockEndpointV2B.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        TokenC = await upgrades.deployProxy(USDaStablecoin,[
            await mockEndpointV2C.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        const ABONDToken = await ethers.getContractFactory("TestABONDToken");
        abondTokenA = await upgrades.deployProxy(ABONDToken, {initializer: 'initialize',kind:'uups'});
        abondTokenB = await upgrades.deployProxy(ABONDToken, {initializer: 'initialize',kind:'uups'});

        const MultiSign = await ethers.getContractFactory("MultiSign");
        multiSignA = await upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],2],{initializer:'initialize',kind:'uups'});
        multiSignB = await upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],2],{initializer:'initialize',kind:'uups'});

        const USDTToken = await ethers.getContractFactory("TestUSDT");
        usdtA = await upgrades.deployProxy(USDTToken,[
            await mockEndpointV2A.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});
        usdtB = await upgrades.deployProxy(USDTToken,[
            await mockEndpointV2B.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
        const mockPriceFeedA = await MockPriceFeed.deploy(8,100000000000);
        const mockPriceFeedB = await MockPriceFeed.deploy(8,100000000000);

        priceFeedAddressMainnetA = await mockPriceFeedA.getAddress();
        priceFeedAddressMainnetB = await mockPriceFeedB.getAddress();

        // const chainLinkOracle = await ethers.getContractFactory("ChainlinkPriceOracleV2");
        // const redstoneETH = await ethers.getContractFactory("RedstoneAdapterPriceOracle");
        // const redstoneWeETH = await ethers.getContractFactory("RedstoneAdapterPriceOracleWeETH");
        // const redstoneWrsETH = await ethers.getContractFactory("RedstoneAdapterPriceOracleWrsETH");

        // const deployedChainLinkOracleA = await chainLinkOracle.deploy(
        //     [
        //         ethAddressMainnet,
        //         await weETHA.getAddress(),
        //         await rsETHA.getAddress()
        //     ],
        //     [
        //         "0xb7B9A39CC63f856b90B364911CC324dC46aC1770",
        //         "0xb4479d436DDa5c1A79bD88D282725615202406E3",
        //         "0x03fe94a215E3842deD931769F913d93FF33d0051"
        //     ]
        // )
        // const deployedChainLinkOracleB = await chainLinkOracle.deploy(
        //     [
        //         ethAddressMainnet,
        //         await weETHB.getAddress(),
        //         await rsETHB.getAddress()
        //     ],
        //     [
        //         "0xb7B9A39CC63f856b90B364911CC324dC46aC1770",
        //         "0xb4479d436DDa5c1A79bD88D282725615202406E3",
        //         "0x03fe94a215E3842deD931769F913d93FF33d0051"
        //     ]
        // )
        // const deployedRedstoneETH = await redstoneETH.deploy("0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256");
        // const deployedRedstoneWeETH = await redstoneWeETH.deploy("0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256");
        // const deployedRedstoneWrsETH = await redstoneWrsETH.deploy("0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256");

        const masterPriceOracle = await ethers.getContractFactory("MasterPriceOracle");
        const deployedMasterPriceOracleA = await masterPriceOracle.deploy(
            [
                ethAddressMainnet,
                await weETHA.getAddress(),
                await wrsETHA.getAddress()
            ],
            [
                // await deployedChainLinkOracleA.getAddress(),
                // await deployedChainLinkOracleA.getAddress(),
                // await deployedChainLinkOracleA.getAddress()

                // "0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256",
                // "0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256",
                // "0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256"

                // await deployedRedstoneETH.getAddress(), 
                // await deployedRedstoneWeETH.getAddress(), 
                // await deployedRedstoneWrsETH.getAddress()

                priceFeedAddressMainnetA,
                priceFeedAddressWeEthToEthMode,
                priceFeedAddressRsEthToEthMode
            ]
        );
        const deployedMasterPriceOracleB = await masterPriceOracle.deploy(
            [
                ethAddressMainnet,
                await weETHB.getAddress(),
                await wrsETHB.getAddress()
            ],
            [
                // await deployedChainLinkOracleB.getAddress(),
                // await deployedChainLinkOracleB.getAddress(),
                // await deployedChainLinkOracleB.getAddress()

                // "0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256",
                // "0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256",
                // "0x7C1DAAE7BB0688C9bfE3A918A4224041c7177256"

                // await deployedRedstoneETH.getAddress(), 
                // await deployedRedstoneWeETH.getAddress(), 
                // await deployedRedstoneWrsETH.getAddress()

                priceFeedAddressMainnetB,
                priceFeedAddressWeEthToEthMode,
                priceFeedAddressRsEthToEthMode
            ]
        );

        const cdsLibFactory = await ethers.getContractFactory("CDSLib");
        const cdsLib = await cdsLibFactory.deploy();

        const CDS = await ethers.getContractFactory("CDSTest",{
            libraries: {
                CDSLib:await cdsLib.getAddress()
            }
        });
        CDSContractA = await upgrades.deployProxy(CDS,[
            await TokenA.getAddress(),
            await deployedMasterPriceOracleA.getAddress(),
            await usdtA.getAddress(),
            await multiSignA.getAddress()
        ],{initializer:'initialize',
            unsafeAllowLinkedLibraries:true
        ,kind:'uups'})

        CDSContractB = await upgrades.deployProxy(CDS,[
            await TokenB.getAddress(),
            await deployedMasterPriceOracleB.getAddress(),
            await usdtB.getAddress(),
            await multiSignB.getAddress()
        ],{initializer:'initialize',
            unsafeAllowLinkedLibraries:true
        ,kind:'uups'})

        const GlobalVariables = await ethers.getContractFactory("GlobalVariables");
        globalVariablesA = await upgrades.deployProxy(GlobalVariables,[
            await TokenA.getAddress(),
            await CDSContractA.getAddress(),
            await mockEndpointV2A.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        globalVariablesB = await upgrades.deployProxy(GlobalVariables,[
            await TokenB.getAddress(),
            await CDSContractB.getAddress(),
            await mockEndpointV2B.getAddress(),
            await owner.getAddress()],{initializer:'initialize',kind:'uups'});

        const borrowLibFactory = await ethers.getContractFactory("BorrowLib");
        const borrowLib = await borrowLibFactory.deploy();

        const Borrowing = await ethers.getContractFactory("BorrowingTest",{
            libraries: {
                BorrowLib:await borrowLib.getAddress()
            }
        });

        BorrowingContractA = await upgrades.deployProxy(Borrowing,[
            await TokenA.getAddress(),
            await CDSContractA.getAddress(),
            await abondTokenA.getAddress(),
            await multiSignA.getAddress(),
            await deployedMasterPriceOracleA.getAddress(),
            [ethAddressMainnet,await weETHA.getAddress(),await wrsETHA.getAddress(), await rsETHA.getAddress()],
            [await TokenA.getAddress(), await abondTokenA.getAddress(), await usdtA.getAddress()],
            1,
            await globalVariablesA.getAddress()
        ],{initializer:'initialize',
            unsafeAllowLinkedLibraries:true
        ,kind:'uups'});

        BorrowingContractB = await upgrades.deployProxy(Borrowing,[
            await TokenB.getAddress(),
            await CDSContractB.getAddress(),
            await abondTokenB.getAddress(),
            await multiSignB.getAddress(),
            await deployedMasterPriceOracleB.getAddress(),
            [ethAddressMainnet,await weETHB.getAddress(),await wrsETHB.getAddress(), await rsETHB.getAddress()],
            [await TokenB.getAddress(), await abondTokenB.getAddress(), await usdtB.getAddress()],            
            1,
            await globalVariablesB.getAddress()
        ],{initializer:'initialize',
            unsafeAllowLinkedLibraries:true
        ,kind:'uups'});

        const BorrowLiq = await ethers.getContractFactory("BorrowLiquidation",{
            libraries: {
                BorrowLib:await borrowLib.getAddress()
            }
        });

        BorrowingLiquidationA = await upgrades.deployProxy(BorrowLiq,[
            await BorrowingContractA.getAddress(),
            await CDSContractA.getAddress(),
            await TokenA.getAddress(),
            await globalVariablesA.getAddress(),
            '0x4200000000000000000000000000000000000006',
            '0x1ea449185eE156A508A4AeA2affCb88ec400a95D',
            '0xCa1Da01A412150b00cAD52b426d65dAB38Ab3830',
            '0xC6F85E8Cc2F13521f909810d03Ca66397a813eDb'
        ],{initializer:'initialize',
            unsafeAllowLinkedLibraries:true
        ,kind:'uups'}); 

        BorrowingLiquidationB = await upgrades.deployProxy(BorrowLiq,[
            await BorrowingContractB.getAddress(),
            await CDSContractB.getAddress(),
            await TokenB.getAddress(),
            await globalVariablesB.getAddress(),
            '0x4200000000000000000000000000000000000006',
            '0x1ea449185eE156A508A4AeA2affCb88ec400a95D',
            '0xCa1Da01A412150b00cAD52b426d65dAB38Ab3830',
            '0xC6F85E8Cc2F13521f909810d03Ca66397a813eDb'
        ],{initializer:'initialize',
            unsafeAllowLinkedLibraries:true
        ,kind:'uups'}); 

        const Treasury = await ethers.getContractFactory("Treasury");
        treasuryA = await upgrades.deployProxy(Treasury,[
            await BorrowingContractA.getAddress(),
            await TokenA.getAddress(),
            await abondTokenA.getAddress(),
            await CDSContractA.getAddress(),
            await BorrowingLiquidationA.getAddress(),
            await usdtA.getAddress(),
            await globalVariablesA.getAddress()
        ],{initializer:'initialize',kind:'uups'});

        treasuryB = await upgrades.deployProxy(Treasury,[
            await BorrowingContractB.getAddress(),
            await TokenB.getAddress(),
            await abondTokenB.getAddress(),
            await CDSContractB.getAddress(),
            await BorrowingLiquidationB.getAddress(),
            await usdtB.getAddress(),
            await globalVariablesB.getAddress()
        ],{initializer:'initialize',kind:'uups'});

        const Option = await ethers.getContractFactory("Options");
        optionsA = await upgrades.deployProxy(Option,[
            await treasuryA.getAddress(),
            await CDSContractA.getAddress(),
            await BorrowingContractA.getAddress(),
            await globalVariablesA.getAddress()
        ],{initializer:'initialize',kind:'uups'});
        optionsB = await upgrades.deployProxy(Option,[
            await treasuryB.getAddress(),
            await CDSContractB.getAddress(),
            await BorrowingContractB.getAddress(),
            await globalVariablesB.getAddress()
        ],{initializer:'initialize',kind:'uups'});

        await mockEndpointV2A.setDestLzEndpoint(await TokenB.getAddress(), mockEndpointV2B.getAddress())
        await mockEndpointV2A.setDestLzEndpoint(await TokenC.getAddress(), mockEndpointV2C.getAddress())
        await mockEndpointV2B.setDestLzEndpoint(await TokenA.getAddress(), mockEndpointV2A.getAddress())
        await mockEndpointV2B.setDestLzEndpoint(await TokenC.getAddress(), mockEndpointV2C.getAddress())
        await mockEndpointV2C.setDestLzEndpoint(await TokenA.getAddress(), mockEndpointV2A.getAddress())
        await mockEndpointV2C.setDestLzEndpoint(await TokenB.getAddress(), mockEndpointV2B.getAddress())

        await mockEndpointV2B.setDestLzEndpoint(await usdtA.getAddress(), mockEndpointV2A.getAddress())
        await mockEndpointV2A.setDestLzEndpoint(await usdtB.getAddress(), mockEndpointV2B.getAddress())

        await mockEndpointV2B.setDestLzEndpoint(await weETHA.getAddress(), mockEndpointV2A.getAddress())
        await mockEndpointV2A.setDestLzEndpoint(await weETHB.getAddress(), mockEndpointV2B.getAddress())

        await mockEndpointV2B.setDestLzEndpoint(await rsETHA.getAddress(), mockEndpointV2A.getAddress())
        await mockEndpointV2A.setDestLzEndpoint(await rsETHB.getAddress(), mockEndpointV2B.getAddress())

        await mockEndpointV2A.setDestLzEndpoint(await globalVariablesB.getAddress(), mockEndpointV2B.getAddress())
        await mockEndpointV2B.setDestLzEndpoint(await globalVariablesA.getAddress(), mockEndpointV2A.getAddress())

        await TokenA.setPeer(eidB, ethers.zeroPadValue(await TokenB.getAddress(), 32))
        await TokenA.setPeer(eidC, ethers.zeroPadValue(await TokenC.getAddress(), 32))
        await TokenB.setPeer(eidA, ethers.zeroPadValue(await TokenA.getAddress(), 32))
        await TokenB.setPeer(eidC, ethers.zeroPadValue(await TokenC.getAddress(), 32))
        await TokenC.setPeer(eidA, ethers.zeroPadValue(await TokenA.getAddress(), 32))
        await TokenC.setPeer(eidB, ethers.zeroPadValue(await TokenB.getAddress(), 32))

        await usdtA.setPeer(eidB, ethers.zeroPadValue(await usdtB.getAddress(), 32))
        await usdtB.setPeer(eidA, ethers.zeroPadValue(await usdtA.getAddress(), 32))

        await weETHA.setPeer(eidB, ethers.zeroPadValue(await weETHB.getAddress(), 32))
        await weETHB.setPeer(eidA, ethers.zeroPadValue(await weETHA.getAddress(), 32))

        await rsETHA.setPeer(eidB, ethers.zeroPadValue(await rsETHB.getAddress(), 32))
        await rsETHB.setPeer(eidA, ethers.zeroPadValue(await rsETHA.getAddress(), 32))

        await globalVariablesA.setPeer(eidB, ethers.zeroPadValue(await globalVariablesB.getAddress(), 32))
        await globalVariablesB.setPeer(eidA, ethers.zeroPadValue(await globalVariablesA.getAddress(), 32))

        await abondTokenA.setBorrowingContract(await BorrowingContractA.getAddress());
        await abondTokenB.setBorrowingContract(await BorrowingContractB.getAddress());

        await multiSignA.approveSetterFunction([0,1,3,4,5,6,7,8,9]);
        await multiSignA.connect(owner1).approveSetterFunction([0,1,3,4,5,6,7,8,9]);
        await multiSignB.approveSetterFunction([0,1,3,4,5,6,7,8,9]);
        await multiSignB.connect(owner1).approveSetterFunction([0,1,3,4,5,6,7,8,9]);

        await BorrowingContractA.setAdmin(owner.getAddress());
        await BorrowingContractB.setAdmin(owner.getAddress());

        await CDSContractA.setAdmin(owner.getAddress());
        await CDSContractB.setAdmin(owner.getAddress());

        await TokenA.setDstEid(eidB);
        await TokenB.setDstEid(eidA);

        await usdtA.setDstEid(eidB);
        await usdtB.setDstEid(eidA);

        await globalVariablesA.setDstEid(eidB);
        await globalVariablesB.setDstEid(eidA);

        await TokenA.setBorrowingContract(await BorrowingContractA.getAddress());
        await TokenA.setCdsContract(await CDSContractA.getAddress());
        await TokenA.setTreasuryContract(await treasuryA.getAddress());

        await TokenB.setBorrowingContract(await BorrowingContractB.getAddress());
        await TokenB.setCdsContract(await CDSContractB.getAddress());
        await TokenB.setTreasuryContract(await treasuryB.getAddress());

        await globalVariablesA.setDstGlobalVariablesAddress(await globalVariablesB.getAddress());
        await globalVariablesB.setDstGlobalVariablesAddress(await globalVariablesA.getAddress());

        await globalVariablesA.setTreasury(await treasuryA.getAddress());
        await globalVariablesB.setTreasury(await treasuryB.getAddress());

        await globalVariablesA.setBorrowLiq(await BorrowingLiquidationA.getAddress());
        await globalVariablesB.setBorrowLiq(await BorrowingLiquidationB.getAddress());        
        
        await globalVariablesA.setBorrowing(await BorrowingContractA.getAddress());
        await globalVariablesB.setBorrowing(await BorrowingContractB.getAddress());

        await BorrowingContractA.setTreasury(await treasuryA.getAddress());
        await BorrowingContractA.setOptions(await optionsA.getAddress());
        await BorrowingContractA.setBorrowLiquidation(await BorrowingLiquidationA.getAddress());
        await BorrowingContractA.setLTV(80);
        await BorrowingContractA.setBondRatio(4);
        await BorrowingContractA.setAPR(50,BigInt("1000000001547125957863212448"));

        await BorrowingContractB.setTreasury(await treasuryB.getAddress());
        await BorrowingContractB.setOptions(await optionsB.getAddress());
        await BorrowingContractB.setBorrowLiquidation(await BorrowingLiquidationB.getAddress());
        await BorrowingContractB.setLTV(80);
        await BorrowingContractB.setBondRatio(4);
        await BorrowingContractB.setAPR(50,BigInt("1000000001547125957863212448"));

        await BorrowingLiquidationA.setTreasury(await treasuryA.getAddress());
        await BorrowingLiquidationB.setTreasury(await treasuryB.getAddress());

        await BorrowingLiquidationA.setAdmin(await owner.getAddress());
        await BorrowingLiquidationB.setAdmin(await owner.getAddress());

        await CDSContractA.setTreasury(await treasuryA.getAddress());
        await CDSContractA.setBorrowingContract(await BorrowingContractA.getAddress());
        await CDSContractA.setBorrowLiquidation(await BorrowingLiquidationA.getAddress());
        await CDSContractA.setUSDaLimit(80);
        await CDSContractA.setUsdtLimit(20000000000);
        await CDSContractA.setGlobalVariables(await globalVariablesA.getAddress());
        await CDSContractA.setAdminTwo(ethers.solidityPackedKeccak256(["address"], [await owner2.getAddress()]));
        await CDSContractB.setTreasury(await treasuryB.getAddress());
        await CDSContractB.setBorrowingContract(await BorrowingContractB.getAddress());
        await CDSContractB.setBorrowLiquidation(await BorrowingLiquidationB.getAddress());
        await CDSContractB.setUSDaLimit(80);
        await CDSContractB.setUsdtLimit(20000000000);
        await CDSContractB.setGlobalVariables(await globalVariablesB.getAddress());
        await CDSContractB.setAdminTwo(ethers.solidityPackedKeccak256(["address"], [await owner2.getAddress()]));

        await BorrowingContractA.calculateCumulativeRate();
        await BorrowingContractB.calculateCumulativeRate();

        await treasuryA.setExternalProtocolAddresses(
            ionicMode,
            wethAddressMode,
            odosRouterAddressMode
        )

        await treasuryB.setExternalProtocolAddresses(
            ionicMode,
            wethAddressMode,
            odosRouterAddressMode
        )

        provider = new ethers.JsonRpcProvider("https://mode.drpc.org");
        // provider = ethers.getDefaultProvider();
        const signer = new ethers.Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",provider);


        return {
            TokenA,abondTokenA,usdtA,weETHA,wrsETHA,borrowLib,
            CDSContractA,BorrowingContractA,
            treasuryA,optionsA,multiSignA,
            BorrowingLiquidationA,globalVariablesA,
            deployedMasterPriceOracleA,

            TokenB,abondTokenB,usdtB,weETHB,wrsETHB,
            CDSContractB,BorrowingContractB,
            treasuryB,optionsB,multiSignB,
            BorrowingLiquidationB,globalVariablesB,
            deployedMasterPriceOracleB,

            owner,user1,user2,user3,
            provider,signer,TokenC
        }
    }

    async function calculateUpsideToSwap(
        found:any,
        ethPrice: number,
        exchangeRate: number,
        inputTokenAddress: AddressLike,
        treasuryAddress: AddressLike,
        borrowAddress: AddressLike
    ) :Promise<{ odosData: any; odosSignData: any }>{
        
        if (ethPrice > Number(found.ethPriceAtDeposit)) {
            let priceDiff:any;
            const strikePrice = Number(found.strikePrice/found.depositedAmountInETH);
            if(ethPrice > strikePrice) {
                priceDiff = strikePrice - Number(found.ethPriceAtDeposit);
            }else {
                priceDiff = ethPrice - Number(found.ethPriceAtDeposit);
            }
            let upside = priceDiff * Number(found.depositedAmountInETH);
            upside = (upside / ethPrice) * 1e18;
            let upsideToSwap = (upside / exchangeRate).toString();
            upsideToSwap.slice(0, -1) + "0";
            const odosData = await fetchDataFromOdos(inputTokenAddress, treasuryAddress, upsideToSwap);
            const odosSignData = await signData(odosData, borrowAddress)
            return {odosData, odosSignData};
        } else {
            return { odosData: "0x", odosSignData: "0x"}
        }
      }
    
    async function fetchDataFromOdos(inputTokenAddress: AddressLike, treasuryAddress: AddressLike, swapAmount: string) {

    const usdtAddress = '0xf0F161fDA2712DB8b566946122a5af183995e2eD';
    const quoteUrl = 'https://api.odos.xyz/sor/quote/v2';
    const assembleUrl = 'https://api.odos.xyz/sor/assemble';

    const quoteRequestBody = {
        chainId: 34443, // Replace with desired chainId
        inputTokens: [
        {
            tokenAddress: inputTokenAddress, // checksummed input token address
            amount: swapAmount, // input amount as a string in fixed integer precision
        }
        ],
        outputTokens: [
        {
            tokenAddress: usdtAddress, // checksummed output token address
            proportion: 1
        }
        ],
        userAddr: treasuryAddress, // checksummed user address
        slippageLimitPercent: 0.3, // set your slippage limit percentage (1 = 1%),
        referralCode: 0, // referral code (recommended)
        disableRFQs: true,
        compact: true,
    };

    const response1 = await fetch(
        quoteUrl,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteRequestBody),
        });

    if (response1.status === 200) {
        const quote = await response1.json();
        const assembleRequestBody = {
        userAddr: treasuryAddress, // the checksummed address used to generate the quote
        pathId: quote.pathId, // Replace with the pathId from quote response in step 1
        // simulate: true, // this can be set to true if the user isn't doing their own estimate gas call for the transaction
        };

        const response2 = await fetch(
        assembleUrl,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assembleRequestBody),
        });

        if (response2.status === 200) {
        const assembledTransaction = await response2.json();
        return assembledTransaction.transaction.data;
        // handle Transaction Assembly response data
        } else {
        console.error('Error in Transaction Assembly:', response2);
        // handle quote failure cases
        }
        // handle quote response data
    } else {
        console.error('Error in Quote:', response1);
        // handle quote failure cases
    }
    }

    async function signData(odosData:string, borrowAddress: AddressLike) {

    const domain = {
        name: "Borrow",
        version: "1",
        chainId: 34443,
        verifyingContract: borrowAddress
    };
    
    const types = {
        OdosPermit: [ 
            { name: "odosExecutionData", type: "bytes" },
        ]
    };
    
    const message = { 
        odosExecutionData: odosData,
    };

    // Sign the hashed message
    const signature = await owner2.signTypedData(domain, types, message);

    return signature;
    }

    describe("Should deposit ETH and mint Trinity",function(){

        it("Should deposit ETH with two cds deposits",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("50");

            await BorrowingContractB.connect(user2).depositTokens(
                90000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            await expect(await treasuryB.getBalanceInTreasury()).to.be.equal(ethers.parseEther('25'))
        })

        it("Should deposit ETH in different chain with cds deposits",async function(){
            const {BorrowingContractB,CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0,options, false);
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("50");

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            await expect(await treasuryB.getBalanceInTreasury()).to.be.equal(ethers.parseEther('25'))

        })

        it("Should transfer USDa from A to B",async function(){
            const {TokenA} = await loadFixture(deployer);
            const initialAmount = ethers.parseEther('100')
            await TokenA.mint(await user1.getAddress(), initialAmount)
    
            const tokensToSend = ethers.parseEther('1')
    
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
    
            const sendParam = [
                eidB,
                ethers.zeroPadValue(await user2.getAddress(), 32),
                tokensToSend,
                tokensToSend,
                options,
                '0x',
                '0x',
            ]
    
            const [nativeFee] = await TokenA.quoteSend(sendParam, false)
    
            await TokenA.connect(user1).send(sendParam, [nativeFee, 0], await user1.getAddress(), { value: nativeFee })
            await expect(await TokenA.totalSupply()).to.be.equal(ethers.parseEther('99'));
            await expect(await TokenB.totalSupply()).to.be.equal(tokensToSend);
        })

        it("Should transfer USDa from A to C",async function(){
            const {TokenA} = await loadFixture(deployer);
            const initialAmount = ethers.parseEther('100')
            await TokenA.mint(await user1.getAddress(), initialAmount)
    
            const tokensToSend = ethers.parseEther('1')
    
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
    
            const sendParam = [
                eidC,
                ethers.zeroPadValue(await user2.getAddress(), 32),
                tokensToSend,
                tokensToSend,
                options,
                '0x',
                '0x',
            ]
    
            const [nativeFee] = await TokenA.quoteSend(sendParam, false)
    
            await TokenA.connect(user1).send(sendParam, [nativeFee, 0], await user1.getAddress(), { value: nativeFee });
            
            await expect(await TokenA.totalSupply()).to.be.equal(ethers.parseEther('99'));
            await expect(await TokenC.totalSupply()).to.be.equal(tokensToSend);
        })

        it("Should transfer USDa from B to C",async function(){
            const {TokenB} = await loadFixture(deployer);
            const initialAmount = ethers.parseEther('100')
            await TokenB.mint(await user1.getAddress(), initialAmount)
    
            const tokensToSend = ethers.parseEther('1')
    
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
    
            const sendParam = [
                eidC,
                ethers.zeroPadValue(await user2.getAddress(), 32),
                tokensToSend,
                tokensToSend,
                options,
                '0x',
                '0x',
            ]
    
            const [nativeFee] = await TokenB.quoteSend(sendParam, false)
    
            await TokenB.connect(user1).send(sendParam, [nativeFee, 0], await user1.getAddress(), { value: nativeFee })
            await expect(await TokenB.totalSupply()).to.be.equal(ethers.parseEther('99'));
            await expect(await TokenC.totalSupply()).to.be.equal(tokensToSend);
        })
    
        it("Should set APY",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approveSetterFunction([1]);
            await multiSignA.connect(owner1).approveSetterFunction([1]);
            await BorrowingContractA.setAPR(50,BigInt("1000000001547125957863212448"));
            await expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt("1000000001547125957863212448"));
        })

        it("Should called by only owner(setAPR)",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approveSetterFunction([1]);
            await multiSignA.connect(owner1).approveSetterFunction([1]);
            const tx = BorrowingContractA.connect(user1).setAPR(50,BigInt("1000000001547125957863212448"));
            await expect(tx).to.be.reverted;
        })
    
        it("Should revert if apr is zero",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approveSetterFunction([1]);
            await multiSignA.connect(owner1).approveSetterFunction([1]);
            const tx = BorrowingContractA.connect(owner).setAPR(0,1);
    
            await expect(tx).to.be.reverted;
        })

        it("Should revert if rate is zero",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approveSetterFunction([1]);
            await multiSignA.connect(owner1).approveSetterFunction([1]);
            const tx = BorrowingContractA.connect(owner).setAPR(1,0);
    
            await expect(tx).to.be.reverted;
        })
    
        it("Should revert if set APY without approval",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            const tx = BorrowingContractA.connect(owner).setAPR(50,BigInt("1000000001547125957863212448"));    
            await expect(tx).to.be.reverted;
        })
    
        it("Should get LTV",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(await BorrowingContractA.getLTV()).to.be.equal(80);
        })
    })

    describe("Should get the chainlink prices",function(){

        it("Should get ETH/USD price",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            const tx = await BorrowingContractA.getUSDValue(ethAddressMainnet);
            await expect(tx[0]).to.be.equal(BigInt("1000000000000000000"));
            await expect(tx[1]).to.be.equal(1e5);
        })

        it("Should get WeETH/ETH exchangeRate",async function(){
            const {BorrowingContractA,weETHA} = await loadFixture(deployer);
            const tx = await BorrowingContractA.getUSDValue(await weETHA.getAddress());
        })

        it("Should get rsETH/ETH exchangeRate",async function(){
            const {BorrowingContractA,wrsETHA} = await loadFixture(deployer);
            const tx = await BorrowingContractA.getUSDValue(await wrsETHA.getAddress());
        })
    })

    describe("Should revert errors",function(){
        it("Should revert if zero eth is deposited",async function(){
            const {CDSContractA,BorrowingContractA,globalVariablesA,usdtA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
 

            const tx = BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                0],      
                {value: (BigInt(0) +  BigInt(nativeFee))})
            await expect(tx).to.be.reverted;
        })

        it("Should revert if LTV set to zero",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approveSetterFunction([0]);
            await multiSignA.connect(owner1).approveSetterFunction([0]);
            const tx = BorrowingContractA.connect(owner).setLTV(0);          
            await expect(tx).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setTreasury",async function(){
            const {BorrowingContractA,treasuryA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(user1).setTreasury(await treasuryA.getAddress())).to.be.reverted;
        })

        it("Should revert if the Treasury address is zero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setTreasury(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the Treasury address is EOA",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setTreasury(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setBorrowLiquidation",async function(){
            const {BorrowingContractA,BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(user1).setBorrowLiquidation(await BorrowingLiquidationA.getAddress())).to.be.reverted;
        })

        it("Should revert if the BorrowLiquidation address is zero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setBorrowLiquidation(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the BorrowLiquidation address is EOA",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setBorrowLiquidation(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setBorrowLiquidation",async function(){
            const {CDSContractA,BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setBorrowLiquidation(await BorrowingLiquidationA.getAddress())).to.be.reverted;
        })

        it("Should revert if the BorrowLiquidation address is zero",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setBorrowLiquidation(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the BorrowLiquidation address is EOA",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setBorrowLiquidation(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setBondRatio",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(user1).setBondRatio(4)).to.be.reverted;
        })

        it("Should revert if the caller is not owner for updateRatePerSecByUSDaPrice",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(user1).updateRatePerSecByUSDaPrice(4)).to.be.reverted;
        })

        it("Should revert if the BOND RATIO is zero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setBondRatio(0)).to.be.reverted;
        })

        it("Should revert if the USDa price is zero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(0)).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setOptions",async function(){
            const {BorrowingContractA,optionsA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(user1).setOptions(await optionsA.getAddress())).to.be.reverted;
        })

        it("Should revert if the Options address is zero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setOptions(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the Options address is EOA",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setOptions(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setAdmin",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(user1).setAdmin(owner.getAddress())).to.be.reverted;
        })

        it("Should revert if the Admin address is zero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setAdmin(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the Treasury address is zero",async function(){
            const {BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingLiquidationA.connect(owner).setTreasury(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setAdmin",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setAdmin(owner.getAddress())).to.be.reverted;
        })

        it("Should revert if the Admin address is zero",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setAdmin(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the Admin address is Contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setAdmin(await treasuryA.getAddress())).to.be.reverted;
        })

        it("Should revert if caller is not owner(setLTV)",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            const tx = BorrowingContractA.connect(user1).setLTV(80);
            await expect(tx).to.be.reverted;
        })

        it("Should revert if ratio is not eligible",async function(){
            const {BorrowingContractB,CDSContractA,usdtA,treasuryA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await usdtA.connect(user1).mint(user1.getAddress(),100000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),100000000);
            await CDSContractA.connect(user1).deposit(100000000,0,true,50000000,100000, { value: nativeFee.toString()});

            const tx = BorrowingContractB.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
            await expect(tx).to.be.reverted;
        })

        it("Should return true if the address is contract address ",async function(){
            const {BorrowingContractA,treasuryA} = await loadFixture(deployer);
            const tx = await BorrowingContractA.isContract(await treasuryA.getAddress());
            await expect(tx).to.be.equal(true);
        })

        it("Should return false if the address is not contract address ",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            const tx = await BorrowingContractA.isContract(user1.getAddress());
            await expect(tx).to.be.equal(false);
        })

        it("Should revert if called by other than borrowing contract",async function(){
            const {treasuryA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            const tx =  treasuryA.connect(user1).deposit(
                user1.getAddress(),
                100000,
                timeStamp,
                0,
                ethers.parseEther("1"),
                {value: ethers.parseEther("1")});
            await expect(tx).to.be.reverted;
        })

        it("Should revert if called by other than borrowing contract",async function(){
            const {treasuryA} = await loadFixture(deployer);
            const tx =  treasuryA.connect(user1).withdraw(user1.getAddress(),user1.getAddress(),ethers.parseEther('1'),1,1);
            await expect(tx).to.be.reverted;
        })

        it("Should revert if called by other than CDS contract",async function(){
            const {treasuryA} = await loadFixture(deployer);
            const tx =  treasuryA.connect(user1).transferEthToCdsLiquidators(user1.getAddress(),1);
            await expect(tx).to.be.reverted;
        })

        it("Should revert if the address is zero",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(owner).withdrawInterest(ZeroAddress,0)).to.be.reverted;
        })

        it("Should revert if the caller is not owner",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).withdrawInterest(user1.getAddress(),100)).to.be.reverted;
        })

        it("Should revert if Treasury don't have enough interest",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(owner).withdrawInterest(await user1.getAddress(),100)).to.be.reverted;
        })

        it("Should withdraw interest",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,treasuryA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [2,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});
            const balBefore = await TokenA.balanceOf(await user1.getAddress());
            await treasuryA.connect(owner).withdrawInterest(await user1.getAddress(),100);
            const balAfter = await TokenA.balanceOf(await user1.getAddress());

            await expect(Number(balAfter)).to.be.equal(Number(balBefore) + 100);
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.withdrawFromExternalProtocol(await user1.getAddress(),100);
            await expect(tx).to.be.reverted;
        })
        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.calculateYieldsForExternalProtocol(await user1.getAddress(),100);
            await expect(tx).to.be.reverted;
        })        
        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateDepositDetails(
                await user1.getAddress(),
                1,
            [1,2,3,4,5,6,78,false,9,true,4,5,2,4,5,6,7,8,0,1,2,1]);
            await expect(tx).to.be.reverted;
        })
        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateHasBorrowed(await user1.getAddress(),true);
            await expect(tx).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateTotalBorrowedAmount(await user1.getAddress(),100);
            await expect(tx).to.be.reverted;
        })
        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateTotalInterest(100);
            await expect(tx).to.be.reverted;
        })
        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateTotalInterestFromLiquidation(100);
            await expect(tx).to.be.reverted;
        })
        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateAbondUSDaPool(100,true);
            await expect(tx).to.be.reverted;
        })
        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateUSDaGainedFromLiquidation(100,true);
            await expect(tx).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.updateInterestFromExternalProtocol(100);
            await expect(tx).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.approveTokens(1,await user1.getAddress(),100);
            await expect(tx).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const { treasuryA } = await loadFixture(deployer);
            const tx = treasuryA.transferEthToCdsLiquidators(await user1.getAddress(),100);
            await expect(tx).to.be.reverted;
        })

        it("Should revert If call initialize twice",async function(){
            const { BorrowingContractA,deployedMasterPriceOracleA } = await loadFixture(deployer);
            const tx = BorrowingContractA.initialize(
                await TokenA.getAddress(),
                await CDSContractA.getAddress(),
                await abondTokenA.getAddress(),
                await multiSignA.getAddress(),
                await deployedMasterPriceOracleA.getAddress(),
                [ethAddressMainnet,await weETHA.getAddress(),await wrsETHA.getAddress(),await wrsETHB.getAddress()],
                [await TokenA.getAddress(), await abondTokenA.getAddress(), await usdtA.getAddress()],
                1,
                await globalVariablesA.getAddress()
            );
            await expect(tx).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const { BorrowingContractA } = await loadFixture(deployer);
            const tx = BorrowingContractA.calculateRatio(10000,100);
            await expect(tx).to.be.reverted;
        })

        it("Should revert i dont have required approvals",async function(){
            const { BorrowingContractA } = await loadFixture(deployer);
            const tx = BorrowingContractA.connect(owner).setTreasury(await treasuryA.getAddress());
            await expect(tx).to.be.reverted;
        })

        it("Should revert i dont have required approvals",async function(){
            const { BorrowingContractA } = await loadFixture(deployer);
            const tx = BorrowingContractA.connect(owner).setTreasury(await treasuryA.getAddress());
            await expect(tx).to.be.reverted;
        })

        it("Should revert if the Admin address is contract",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.connect(owner).setAdmin(await TokenA.getAddress())).to.be.reverted;
        })

        it("Should revert if called initialize twice",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.initialize(
                await TokenA.getAddress(),
                await CDSContractA.getAddress(),
                await BorrowingContractA.getAddress(), // alternative address given 
                await owner.getAddress()
            )).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.setOmniChainData([
                1,1,1,1,11,1,11,1,1,1,1,1,11,1,1,1,1,11,1,1,1,1,1,11,11,1,1,1,1])).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.updateCollateralData(2, [1,1,1,1])).to.be.reverted;
        })

        it("Should revert This function can only called by owner only",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(user1).setDstEid(2)).to.be.reverted;
        })

        it("Should revert This function can only called by owner only",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(user1).setTreasury(await treasuryA.getAddress())).to.be.reverted;
        })

        it("Should revert This function can only called by owner only",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(user1).setBorrowing(await BorrowingContractA.getAddress())).to.be.reverted;
        })

        it("Should revert This function can only called by owner only",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(user1).setBorrowLiq(await BorrowingLiquidationA.getAddress())).to.be.reverted;
        })

        it("Should revert This function can only called by owner only",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(user1).setDstGlobalVariablesAddress(await globalVariablesA.getAddress())).to.be.reverted;
        })

        it("Should revert if the address is zero",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(owner).setTreasury(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the address is EOA",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(owner).setTreasury(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the address is zero",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(owner).setBorrowing(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the address is EOA",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(owner).setBorrowing(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the address is zero",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(owner).setBorrowLiq(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the address is EOA",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(owner).setBorrowLiq(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the address is zero",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(owner).setDstGlobalVariablesAddress(ZeroAddress)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(user1).send(
                2,
                1,
                [1,2],
                '0x',
                await user1.getAddress()
            )).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {globalVariablesA} = await loadFixture(deployer);
            await expect(globalVariablesA.connect(user1).sendForLiquidation(
                2,
                1,
                [1,1,1,1,1,1],
                1,
                [1,2],
                '0x',
                await user1.getAddress()
            )).to.be.reverted;
        })

        it("Should revert if called initialize twice",async function(){
            const {optionsA} = await loadFixture(deployer);
            await expect(optionsA.initialize(
                await treasuryA.getAddress(),
                await CDSContractA.getAddress(),
                await BorrowingContractA.getAddress(),
                await globalVariablesA.getAddress()
            )).to.be.reverted;
        })

        it("Should revert if called initialize twice",async function(){
            const {optionsA} = await loadFixture(deployer);
            await expect(optionsA.connect(user1).calculateStrikePriceGains(1,1,1)).to.be.reverted;
        })

        it("Should revert No borrowers in protocol",async function(){
            const {optionsA} = await loadFixture(deployer);
            await expect(optionsA.connect(user1).calculateOptionPrice(1,1,0,1)).to.be.reverted;
        })

        it("Should revert CDS Vault is zero",async function(){
            const {optionsA} = await loadFixture(deployer);
            await expect(optionsA.connect(user1).calculateOptionPrice(1,1,1,1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).withdrawFromExternalProtocolDuringLiq(
                await user1.getAddress(),1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).updateTotalVolumeOfBorrowersAmountinWei(1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).updateTotalVolumeOfBorrowersAmountinUSD(1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).updateDepositedCollateralAmountInWei(1,1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).updateDepositedCollateralAmountInUsd(1,1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).updateUsdaCollectedFromCdsWithdraw(1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).updateLiquidatedETHCollectedFromCdsWithdraw(1)).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).updateYieldsFromLiquidatedLrts(1)).to.be.reverted;
        })

        it("Should revert The user dont have any debts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).getBorrowing(
                await user1.getAddress(),1)).to.be.reverted;
        })

        it("Should revert This function can only called by owner",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).setExternalProtocolAddresses(
                ionicMode,
                wethAddressMode,
                odosRouterAddressMode
            )).to.be.reverted;
        })

        it("Should revert CantBeEOAOrZeroAddress",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).setExternalProtocolAddresses(
                await user1.getAddress(),
                wethAddressMode,
                odosRouterAddressMode
            )).to.be.reverted;
        })

        it("Should revert CantBeEOAOrZeroAddress",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(user1).setExternalProtocolAddresses(
                ZeroAddress,
                wethAddressMode,
                odosRouterAddressMode
            )).to.be.reverted;
        })

        it("Should revert This function can only called by Core contracts",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.connect(owner).transferFundsToGlobal([1,1,1,1])).to.be.reverted;
        })

        it("Should revert if called initialize twice",async function(){
            const {treasuryA} = await loadFixture(deployer);
            await expect(treasuryA.initialize(
                await BorrowingContractA.getAddress(),
                await TokenA.getAddress(),
                await abondTokenA.getAddress(),
                await CDSContractA.getAddress(),
                await BorrowingLiquidationA.getAddress(),
                await usdtA.getAddress(),
                await globalVariablesA.getAddress()
            )).to.be.reverted;
        })

        it("Should revert if called initialize twice",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.initialize(
                [await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],2
            )).to.be.reverted;
        })

        it("Should revert if called initialize twice",async function(){
            const {BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingLiquidationA.initialize(
                await BorrowingContractA.getAddress(),
                await CDSContractA.getAddress(),
                await TokenA.getAddress(),
                await globalVariablesA.getAddress(),
                '0x4200000000000000000000000000000000000006',
                '0x1ea449185eE156A508A4AeA2affCb88ec400a95D',
                '0xCa1Da01A412150b00cAD52b426d65dAB38Ab3830',
                '0xC6F85E8Cc2F13521f909810d03Ca66397a813eDb'
            )).to.be.reverted;
        })

        it("Should revert Owners required",async function(){
            const MultiSign = await ethers.getContractFactory("MultiSign");
            await expect(
                upgrades.deployProxy(MultiSign,[[],2],{initializer:'initialize',kind:'uups'})
            ).to.be.reverted;
        })

        it("Should revert Number of owners should be below maximum owners limit",async function(){
            const MultiSign = await ethers.getContractFactory("MultiSign");
            await expect(
                upgrades.deployProxy(MultiSign,[
                    [
                        "0x0000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000002",
                        "0x0000000000000000000000000000000000000003",
                        "0x0000000000000000000000000000000000000004",
                        "0x0000000000000000000000000000000000000005",
                        "0x0000000000000000000000000000000000000006",
                        "0x0000000000000000000000000000000000000007",
                        "0x0000000000000000000000000000000000000008",
                        "0x0000000000000000000000000000000000000009",
                        "0x000000000000000000000000000000000000000a",
                        "0x000000000000000000000000000000000000000b"
                      ],2],{initializer:'initialize',kind:'uups'})
            ).to.be.reverted;
        })

        it("Should revert Invalid number of required approvals",async function(){
            const MultiSign = await ethers.getContractFactory("MultiSign");
            await expect(
                upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],0],{initializer:'initialize',kind:'uups'})
            ).to.be.reverted;
        })

        it("Should revert Invalid number of required approvals",async function(){
            const MultiSign = await ethers.getContractFactory("MultiSign");
            await expect(
                upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner1.getAddress(),await owner2.getAddress()],4],{initializer:'initialize',kind:'uups'})
            ).to.be.reverted;
        })

        it("Should revert Invalid owner",async function(){
            const MultiSign = await ethers.getContractFactory("MultiSign");
            await expect(
                upgrades.deployProxy(MultiSign,[[ZeroAddress,await owner1.getAddress(),await owner2.getAddress()],2],{initializer:'initialize',kind:'uups'})
            ).to.be.reverted;
        })

        it("Should revert Duplicate owner",async function(){
            const MultiSign = await ethers.getContractFactory("MultiSign");
            await expect(
                upgrades.deployProxy(MultiSign,[[await owner.getAddress(),await owner.getAddress(),await owner2.getAddress()],2],{initializer:'initialize',kind:'uups'})
            ).to.be.reverted;
        })

        it("Should revert Empty array",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(owner1).approvePause([])).to.be.reverted;
        })

        it("Should revert only owner can call",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).approveSetterFunction([1,2])).to.be.reverted;
        })

        it("Should revert Empty array",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(owner1).approveSetterFunction([])).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveSetterFunction([1,2])
            await expect(multiSignA.connect(owner1).approveSetterFunction([1,2])).to.be.reverted;
        })

        it("Should revert Empty array",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(owner1).approveUnPause([])).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([1,2])
            await expect(multiSignA.connect(owner1).approveUnPause([1,2])).to.be.reverted;
        })

        it("Should revert Empty array",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(owner1).pauseFunction([])).to.be.reverted;
        })

        it("Should revert Empty array",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(owner1).unpauseFunction([])).to.be.reverted;
        })

        it("Should approve borrowing pause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveBorrowingPause()
            await expect(await multiSignA.pauseApproved(0,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.pauseApproved(1,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.pauseApproved(2,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.pauseApproved(3,await owner1.getAddress())).to.be.equal(true);
        })

        it("Should approve CDS pause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveCDSPause();
            await expect(await multiSignA.pauseApproved(4,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.pauseApproved(5,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.pauseApproved(6,await owner1.getAddress())).to.be.equal(true);
        })

        it("Should approve borrowing unpause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveBorrowingUnPause()
            await expect(await multiSignA.unpauseApproved(0,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.unpauseApproved(1,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.unpauseApproved(2,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.unpauseApproved(3,await owner1.getAddress())).to.be.equal(true);
        })

        it("Should approve CDS unpause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveCDSUnPause()
            await expect(await multiSignA.unpauseApproved(4,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.unpauseApproved(5,await owner1.getAddress())).to.be.equal(true);
            await expect(await multiSignA.unpauseApproved(6,await owner1.getAddress())).to.be.equal(true);
        })

        it("Should revert if others called approve borrowing pause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).approveBorrowingPause()).to.be.reverted;
        })

        it("Should revert if others called approve CDS pause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).approveCDSPause()).to.be.reverted;
        })

        it("Should revert if others called approve borrowing unpause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).approveBorrowingUnPause()).to.be.reverted;
        })

        it("Should revert if others called approve CDS unpause",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).approveCDSUnPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([0])
            await expect(multiSignA.connect(owner1).approveBorrowingPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([1])
            await expect(multiSignA.connect(owner1).approveBorrowingPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([2])
            await expect(multiSignA.connect(owner1).approveBorrowingPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([3])
            await expect(multiSignA.connect(owner1).approveBorrowingPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([4])
            await expect(multiSignA.connect(owner1).approveCDSPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([5])
            await expect(multiSignA.connect(owner1).approveCDSPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([6])
            await expect(multiSignA.connect(owner1).approveCDSPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([0])
            await expect(multiSignA.connect(owner1).approveBorrowingUnPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([1])
            await expect(multiSignA.connect(owner1).approveBorrowingUnPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([2])
            await expect(multiSignA.connect(owner1).approveBorrowingUnPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([3])
            await expect(multiSignA.connect(owner1).approveBorrowingUnPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([4])
            await expect(multiSignA.connect(owner1).approveCDSUnPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([5])
            await expect(multiSignA.connect(owner1).approveCDSUnPause()).to.be.reverted;
        })

        it("Should revert Already approved",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([6])
            await expect(multiSignA.connect(owner1).approveCDSUnPause()).to.be.reverted;
        })

        it("Should pause borrowing",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([0,1,2,3]);
            await multiSignA.connect(owner).approvePause([0,1,2,3])
            await multiSignA.connect(owner1).pauseBorrowing();
            await expect(await multiSignA.functionState(0)).to.be.equal(true);
            await expect(await multiSignA.functionState(1)).to.be.equal(true);
            await expect(await multiSignA.functionState(2)).to.be.equal(true);
            await expect(await multiSignA.functionState(3)).to.be.equal(true);
        })

        it("Should pause CDS",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([4,5,6]);
            await multiSignA.connect(owner).approvePause([4,5,6])
            await multiSignA.connect(owner1).pauseCDS()
            await expect(await multiSignA.functionState(4)).to.be.equal(true);
            await expect(await multiSignA.functionState(5)).to.be.equal(true);
            await expect(await multiSignA.functionState(6)).to.be.equal(true);
        })

        it("Should unpause borrowing",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([0,1,2,3]);
            await multiSignA.connect(owner).approveUnPause([0,1,2,3])
            await multiSignA.connect(owner1).unpauseBorrowing()
            await expect(await multiSignA.functionState(0)).to.be.equal(false);
            await expect(await multiSignA.functionState(1)).to.be.equal(false);
            await expect(await multiSignA.functionState(2)).to.be.equal(false);
            await expect(await multiSignA.functionState(3)).to.be.equal(false);
        })

        it("Should unpause CDS",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([4,5,6]);
            await multiSignA.connect(owner).approveUnPause([4,5,6])
            await multiSignA.connect(owner1).unpauseCDS()
            await expect(await multiSignA.functionState(4)).to.be.equal(false);
            await expect(await multiSignA.functionState(5)).to.be.equal(false);
            await expect(await multiSignA.functionState(6)).to.be.equal(false);
        })

        it("Should revert only owner can call",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).pauseBorrowing()).to.be.reverted;
        })

        it("Should revert only owner can call",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).pauseCDS()).to.be.reverted;
        })

        it("Should revert only owner can call",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).unpauseBorrowing()).to.be.reverted;
        })

        it("Should revert only owner can call",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).unpauseCDS()).to.be.reverted;
        })

        it("Should revert Requied approvals not met",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([0,1,2]);
            await multiSignA.connect(owner).approvePause([0,1,2])
            await expect(multiSignA.connect(owner1).pauseBorrowing()).to.be.reverted;
        })

        it("Should revert Requied approvals not metS",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approvePause([4,5]);
            await multiSignA.connect(owner).approvePause([4,5])
            await expect(multiSignA.connect(owner1).pauseCDS()).to.be.reverted;
        })

        it("Should revert Requied approvals not met",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([0,1,2]);
            await multiSignA.connect(owner).approveUnPause([0,1,2])
            await expect(multiSignA.connect(owner1).unpauseBorrowing()).to.be.reverted;
        })

        it("Should revert Requied approvals not met",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner1).approveUnPause([4,5]);
            await multiSignA.connect(owner).approveUnPause([4,5])
            await expect(multiSignA.connect(owner1).unpauseCDS()).to.be.reverted;
        })

    })

    describe("Should update all state changes correctly",function(){
        it("Should update deposited amount",async function(){
            const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesB.quote(1,0, options, false)
 

            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [4,
                110000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
            const tx = await treasuryA.borrowing(user1.getAddress());
            await expect(tx[0]).to.be.equal(ethers.parseEther("1"))
        })

        it("Should update depositedAmount correctly if deposited multiple times",async function(){
            const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesB.quote(1,0, options, false)
 
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [0,
                105000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("2")],
                {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("3")],
                {value: (ethers.parseEther("3") +  BigInt(nativeFee))})                    
            const tx = await treasuryA.borrowing(user1.getAddress());
            await expect(tx[0]).to.be.equal(ethers.parseEther("6"))
        })

        it("Should update hasDeposited or not",async function(){
            const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesB.quote(1,0, options, false)
 
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
            const tx = await treasuryA.borrowing(user1.getAddress());
            await expect(tx[3]).to.be.equal(true);
        })

        it("Should update borrowerIndex",async function(){
            const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
 
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
            const tx = await treasuryA.borrowing(user1.getAddress());
            const tx3 = await treasuryA.getBorrowing(user1.getAddress(), tx[4]);
            const tx4 = await CDSContractA.cdsDetails(user1.getAddress());
            const tx5 = await CDSContractA.getCDSDepositDetails(user1.getAddress(), tx4[0]);
            await expect(tx[4]).to.be.equal(1);
        })

        it("Should update borrowerIndex correctly if deposited multiple times",async function(){
            const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
 
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("1")],
                {value: (ethers.parseEther("1") +  BigInt(nativeFee))})                    
            const tx = await treasuryA.borrowing(user1.getAddress());
            await expect(tx[4]).to.be.equal(3);
        })

        it("Should update totalVolumeOfBorrowersinUSD",async function(){
            const {BorrowingContractA,treasuryA,usdtB,CDSContractB,globalVariablesB} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesB.quote(1,0, options, false)
 
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("2")],
                {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
            await expect(await treasuryA.totalVolumeOfBorrowersAmountinUSD()).to.be.equal(ethers.parseEther("200000"));
        })

        it("Should update totalVolumeOfBorrowersinUSD if multiple users deposit in different ethPrice",async function(){
            const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
 
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("2")],
                {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
            await BorrowingContractA.connect(user2).depositTokens(
                150000,
                timeStamp,
                [1,
                165000,
                ethVolatility,1,
                ethers.parseEther("2")],
                {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
            await expect(await treasuryA.totalVolumeOfBorrowersAmountinUSD()).to.be.equal(ethers.parseEther("500000"));
        })

        it("Should update totalVolumeOfBorrowersinWei",async function(){
            const {BorrowingContractA,treasuryA,usdtA,CDSContractA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
 
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("2")],
                {value: (ethers.parseEther("2") +  BigInt(nativeFee))})
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                ethers.parseEther("3")],
                {value: (ethers.parseEther("3") +  BigInt(nativeFee))})
            await expect(await treasuryA.totalVolumeOfBorrowersAmountinWei()).to.be.equal(ethers.parseEther("5"));
        })

    })

    describe("Should withdraw ETH from protocol",function(){
        it("Should withdraw ETH (between 0.8 and 1)",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [2,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});
            const tx = await treasuryA.getBorrowing(
                    await user1.getAddress(), 1)
            await expect(tx[1].withdrawed).to.be.equal(true);

        })

        it("Should withdraw ETH(>1)",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtB,CDSContractB} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtB.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));

            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                120000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                120000,
                timeStamp,
                {value: nativeFee});
            const tx = await treasuryA.getBorrowing(
                    await user1.getAddress(), 1)
            await expect(tx[1].withdrawed).to.be.equal(true);

        })

        it("Should withdraw ETH(=1)",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

 

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [3,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                100000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                100000,
                timeStamp,
                {value: nativeFee});
            const tx = await treasuryA.getBorrowing(
                    await user1.getAddress(), 1)
            await expect(tx[1].withdrawed).to.be.equal(true);

        })

        it("Should revert BorrowHealthLow",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [2,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                70000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await expect(BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                70000,
                timeStamp,
                {value: nativeFee})).to.be.reverted;

        })

        it("Should revert To address is zero",async function(){
            const {BorrowingContractA,treasuryA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            const tx = BorrowingContractA.connect(user1).withDraw(ZeroAddress,1,"0x","0x",99900,timeStamp);
            await expect(tx).to.be.reverted;
        })

        it("Should revert To address is contract address",async function(){
            const {BorrowingContractA,treasuryA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            const tx1 = BorrowingContractA.connect(user1).withDraw(await treasuryA.getAddress(),1,"0x","0x",99900,timeStamp);
            await expect(tx1).to.be.reverted;
        })

        it("Should revert if User doens't have the perticular index",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const tx = BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                2,
                "0x",
                "0x",
                99900,
                timeStamp,
                {value: nativeFee});
            await expect(tx).to.be.reverted;
        })

        it("Should revert if BorrowingHealth is Low",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                80000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            const tx = BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                80000,
                timeStamp,
                {value: nativeFee});
            await expect(tx).to.be.reverted;
        })

        it("Should revert if User already withdraw entire amount",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});

            const tx = BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});
            await expect(tx).to.be.reverted;
        })

        it("Should revert User balance is less than required",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            const tx =  BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});
            await expect(tx).to.be.reverted;
        })
    })

    describe("Should Liquidate ETH from protocol",function(){

        it("Should Liquidate ETH in same chain",async function(){
            const {BorrowingContractA,CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [4,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false)
            await BorrowingContractA.connect(owner).liquidate(
                await user2.getAddress(),
                1,
                80000,
                1,
                {value: nativeFee1})
            const tx = await treasuryA.getBorrowing(
                    await user2.getAddress(), 1)
            await expect(tx[1].liquidated).to.be.equal(true);
        })

        it("Should revert Don't have enough USDa in CDS to liquidate",async function(){
            const {BorrowingContractB,CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,false,0,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("1");

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [4,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false)
            await expect(BorrowingContractB.connect(owner).liquidate(
                await user2.getAddress(),
                1,
                80000,
                1,
                {value: nativeFee1})).to.be.reverted;
        })

        it("Should revert if other than admin tried to Liquidate",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            
            const tx = BorrowingContractA.connect(user2).liquidate(user1.getAddress(),1,80000,1);
            await expect(tx).to.be.reverted;
        })

        it("Should revert To address is zero",async function(){
            const {BorrowingContractA,globalVariablesA,treasuryB} = await loadFixture(deployer);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            const tx = BorrowingContractA.connect(owner).liquidate(ethers.ZeroAddress,1,100000,1,{value: nativeFee});
            await expect(tx).to.be.reverted;
        })

        it("Should revert You cannot liquidate your own assets!",async function(){
            const {BorrowingContractA,globalVariablesA,treasuryB} = await loadFixture(deployer);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(600000, 0).toHex().toString()

            const tx = BorrowingContractA.connect(owner).liquidate(owner.getAddress(),1,100000,1,{value: nativeFee});
            await expect(tx).to.be.reverted;
        })

        it("Should revert You cannot liquidate",async function(){
            const {BorrowingContractB,CDSContractA,usdtA,globalVariablesA,treasuryB} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("1");

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(600000, 0).toHex().toString()
            
            const tx = BorrowingContractB.connect(owner).liquidate(
                await user2.getAddress(),
                1,
                100000,
                1,
                {value: nativeFee})
            await expect(tx).to.be.reverted;
        })

        it("Should revert only owner can call",async function(){
            const {BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingLiquidationA.connect(user1).setTreasury(await treasuryA.getAddress())).to.be.reverted;
        })

        it("Should revert only owner can call",async function(){
            const {BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingLiquidationA.connect(user1).setAdmin(await owner.getAddress())).to.be.reverted;
        })

        it("Should revert Admin can't be zero address and contract address",async function(){
            const {BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingLiquidationA.connect(owner).setAdmin(ZeroAddress)).to.be.reverted;
        }) 
               
        it("Should revert Admin can't be zero address and contract address",async function(){
            const {BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingLiquidationA.connect(owner).setAdmin(await treasuryA.getAddress())).to.be.reverted;
        })

        it("Should revert only borrowing contract can call",async function(){
            const {BorrowingLiquidationA} = await loadFixture(deployer);
            await expect(BorrowingLiquidationA.connect(user1).liquidateBorrowPosition(
                await user1.getAddress(),
                1,
                80000,
                1,
                10000
            )).to.be.reverted;
        })

    })

    describe("Should revert multisign errors",function(){
        it("Should revert if non owner tried to approve pausing",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).approvePause([0])).to.be.reverted;
        })

        it("Should revert if non owner tried to approve unpausing",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await expect(multiSignA.connect(user1).approveUnPause([2])).to.be.reverted;
        })

        it("Should revert if tried to approve pausing twice ",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approvePause([0]);
            await expect(multiSignA.connect(owner).approvePause([0])).to.be.reverted;
        })

        it("Should revert caller is not the owner if tried to pause Borrowing",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approvePause([1]);
            await multiSignA.connect(owner1).approvePause([1]);
            await expect(multiSignA.connect(user1).pauseFunction([1])).to.be.reverted;
        })

        it("Should revert caller is not the owner if tried to unpause Borrowing",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approveUnPause([0]);
            await multiSignA.connect(owner1).approveUnPause([0]);
            await expect(multiSignA.connect(user1).unpauseFunction([1])).to.be.reverted;
        })

        it("Should revert if tried to pause before attaining required approvals",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approvePause([1]);
            await expect(multiSignA.connect(owner).pauseFunction([1])).to.be.reverted;
        })

        it("Should revert if tried to unpause before attaining required approvals",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approveUnPause([1]);
            await expect(multiSignA.connect(owner).unpauseFunction([1])).to.be.reverted;
        })

        it("Should revert if tried to unpause Borrowing before attaining required approvals",async function(){
            const {multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approvePause([1]);
            await multiSignA.connect(owner1).approvePause([1]);
            await multiSignA.connect(owner).pauseFunction([1]);

            await multiSignA.connect(owner).approveUnPause([1]);
            await expect(multiSignA.connect(owner).unpauseFunction([1])).to.be.reverted;
        })

        it("Should revert if tried to deposit ETH in borrowing when it is paused",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await multiSignA.connect(owner).approvePause([0]);
            await multiSignA.connect(owner1).approvePause([0]);
            await multiSignA.connect(owner).pauseFunction([0]);

            const tx = BorrowingContractA.connect(user2).depositTokens(100000,timeStamp,
                [1,110000,ethVolatility,1,ethers.parseEther("1")],{value: ethers.parseEther("1")});
            expect(tx).to.be.reverted;
        })//!

        it("Should r]evert if tried to deposit USDT or USDa in CDS when it is paused",async function(){
            const {CDSContractA,multiSignA,usdtA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approvePause([4]);
            await multiSignA.connect(owner1).approvePause([4]);
            await multiSignA.connect(owner).pauseFunction([4]);

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const tx = CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000);
            await expect(tx).to.be.reverted;
        })

        it("Should revert if tried to redeem USDT in cds when it is paused",async function(){
            const {CDSContractA,multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approvePause([6]);
            await multiSignA.connect(owner1).approvePause([6]);
            await multiSignA.connect(owner).pauseFunction([6]);

            const tx = CDSContractA.connect(user2).redeemUSDT(ethers.parseEther("800"),1500,1000);
            await expect(tx).to.be.reverted;
        })

        it("Should revert if tried to setAPR in borrow when it is paused",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            await multiSignA.connect(owner).approvePause([3]);
            await multiSignA.connect(owner1).approvePause([3]);
            await multiSignA.connect(owner).pauseFunction([3]);

            const tx = BorrowingContractA.connect(owner).setAPR(50,BigInt("1000000001547125957863212448"));
            await expect(tx).to.be.reverted;
        })

        it("Should revert if tried to withdraw ETH in borrowing when it is paused",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await multiSignA.connect(owner).approvePause([1]);
            await multiSignA.connect(owner1).approvePause([1]);
            await multiSignA.connect(owner).pauseFunction([1]);
            const tx = BorrowingContractA.connect(user2).withDraw(user2.getAddress(),1,"0x","0x",99900,timeStamp);
            await expect(tx).to.be.reverted;
        })

        it("Should revert if tried to withdraw USDa in CDS when it is paused",async function(){
            const {CDSContractA,multiSignA} = await loadFixture(deployer);

            await multiSignA.connect(owner).approvePause([5]);
            await multiSignA.connect(owner1).approvePause([5]);
            await multiSignA.connect(owner).pauseFunction([5]);
            
            const tx = CDSContractA.connect(user1).withdraw(1,1000000,0,1,"0x");

            await expect(tx).to.be.reverted;
        })

        it("Should revert if tried to Liquidate in borrowing when it is paused",async function(){
            const {BorrowingContractA,multiSignA} = await loadFixture(deployer);
            
            await multiSignA.connect(owner).approvePause([2]);
            await multiSignA.connect(owner1).approvePause([2]);
            await multiSignA.connect(owner).pauseFunction([2]);
            
            const tx = BorrowingContractA.liquidate(user1.getAddress(),1,80000,1);
            await expect(tx).to.be.reverted;
        })
    })

    describe("Should ABOND be fungible",function(){
        it("Should store genesis cumulative rate correctly",async function(){
            const {
                globalVariablesA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("50");

 

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            const tx = await abondTokenB.userStatesAtDeposits(user2.address, 1);
            await expect(tx[0]).to.be.equal(1000000000000000000000000000n)
        })
            
        it("Should store eth backed during deposit correctly",async function(){
            const {
                globalVariablesA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("1");

 

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            const tx = await abondTokenB.userStatesAtDeposits(user2.address, 1);
            await expect(tx[1]).to.be.equal(500000000000000000n);
        })

        it("Should store cumulative rate and eth backed after withdraw correctly",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,abondTokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

 

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});

            const tx = await abondTokenA.userStates(user1.address);
            await expect(tx[0]).to.be.equal(1000000000000000000000000000n);
            const abondBalance = ((500000000000000000 * 999 * 0.8)/4);
            const ethBackedPerAbond = BigInt(500000000000000000 * 1e18/abondBalance);
            await expect(tx[2]).to.be.equal(BigInt(abondBalance));
            await expect(tx[1]).to.be.equal(ethBackedPerAbond);
            await expect(tx[0]).to.be.equal(1000000000000000000000000000n)
        })

        it("Should redeem abond",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,abondTokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});

            await abondTokenA.connect(user1).approve(await BorrowingContractA.getAddress(), await abondTokenA.balanceOf(user1.address));
            await BorrowingContractA.connect(user1).redeemYields(await user1.getAddress(), await abondTokenA.balanceOf(await user1.getAddress()));
        })

        it("Should get withdraw amount",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA,abondTokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})
            
            const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
            const latestBlock = await ethers.provider.getBlock(blockNumber);
            const latestTimestamp1 = latestBlock.timestamp;
            await time.increaseTo(latestTimestamp1 + 2592000);
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});

            const tx = await BorrowingContractA.getAbondYields(user1.getAddress(), await abondTokenA.balanceOf(user1.getAddress()));
        })

        it("Should revert NeedsMoreThanZero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.getAbondYields(
                user1.getAddress(), 0)).to.be.reverted;
        })

        it("Should revert InsufficientBalance",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.getAbondYields(
                user1.getAddress(), 1)).to.be.reverted;
        })

        it("Should revert NeedsMoreThanZero",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.redeemYields(
                user1.getAddress(), 0)).to.be.reverted;
        })

        it("Should revert InsufficientBalance",async function(){
            const {BorrowingContractA} = await loadFixture(deployer);
            await expect(BorrowingContractA.redeemYields(
                user1.getAddress(), 1)).to.be.reverted;
        })

        it("Should transfer abond",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [2,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});
            const tx = await abondTokenA.connect(user1).transfer(
                await user2.getAddress(), await abondTokenA.balanceOf(await user1.getAddress()))

        })

        it("Should transferFrom abond",async function(){
            const {BorrowingContractA,TokenA,globalVariablesA,usdtA,CDSContractA} = await loadFixture(deployer);
            const timeStamp = await time.latest();
            await usdtA.connect(user1).mint(user1.getAddress(),10000000000)
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [2,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount +  BigInt(nativeFee))})

            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),80000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});

            await abondTokenA.connect(user1).approve(
                await user2.getAddress(), await abondTokenA.balanceOf(await user1.getAddress())
            )
            const tx = await abondTokenA.connect(user2).transferFrom(
                await user1.getAddress(), await user2.getAddress(), await abondTokenA.balanceOf(await user1.getAddress())
            )

        })

        it("Should pause abond",async function(){
            const {abondTokenA} = await loadFixture(deployer);
            await abondTokenA.connect(owner).pause();
            await expect(await abondTokenA.paused()).to.be.equal(true);
        })

        it("Should unpause abond",async function(){
            const {abondTokenA} = await loadFixture(deployer);
            await abondTokenA.connect(owner).pause();
            await abondTokenA.connect(owner).unpause();
            await expect(await abondTokenA.paused()).to.be.equal(false);
        })
    })

    describe("Should change apr based on USDa price", function(){
        it("Should change the apr $0.90",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9000);
            expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000007075835619725814915'));
        })
        it("Should change the apr for $0.95",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9500);
            expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000004431822129783699001'));
        })
        it("Should change the apr $0.975",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9750);
            expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000003022265980097387650'));
        })
        it("Should change the apr $0.985",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(9850);
            expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000002293273137447730714'));
        })
        it("Should change the apr $1.00",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(10000);
            expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000001547125957863212448'));
        })
        it("Should change the apr $1.015",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(10150);
            expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000001243680656318820312'));
        })
        it("Should change the apr $1.045",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(10450);
            expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000000782997609082909351'));
        })
        it("Should change the apr $1.1",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,
                treasuryA,abondTokenB
            } = await loadFixture(deployer);

            await BorrowingContractA.connect(owner).updateRatePerSecByUSDaPrice(11000);
            await expect(await BorrowingContractA.ratePerSec()).to.be.equal(BigInt('1000000000158153903837946257'));
        })
    })

    describe("Should able to deposit different collaterals", function(){
        it("Should deposit WeETH in Borrow",async function(){
            const {
                BorrowingContractA,weETHA,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await weETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)})
            await expect(
                await weETHA.balanceOf(await treasuryA.getAddress())
            ).to.be.equal(ethers.parseEther('0.5'))

        })

        it("Should withdraw WeETH in Borrow",async function(){
            const {
                BorrowingContractA,weETHA,
                CDSContractA,
                usdtA,treasuryA,TokenA
                ,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await weETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user2.getAddress(),80000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});
            const tx = await treasuryA.getBorrowing(
                    await user2.getAddress(), 1)
            await expect(tx[1].withdrawed).to.be.equal(true);
        })

    })

    describe("Should renew options", function(){
        it("Should renew options",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,TokenB,
                treasuryA,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("50");

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})

            const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
            const latestBlock = await ethers.provider.getBlock(blockNumber);
            const latestTimestamp1 = latestBlock.timestamp;
            await time.increaseTo(latestTimestamp1 + 1382400);

            const tx = await BorrowingContractB.connect(user2).getOptionFeesToPay(1);

            await TokenB.connect(user2).approve(await BorrowingContractB.getAddress(), Number(tx) + 1000000);

            await BorrowingContractB.connect(user2).renewOptions(1, {value:nativeFee});
            const tx1 = await treasuryB.getBorrowing(
                await user2.getAddress(), 1)
        })

        it("Should revert AlreadyWithdrewOrLiquidated",async function(){
            const {
                BorrowingContractA,
                CDSContractA,
                usdtA,TokenB
                ,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("5");

            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(user1.getAddress(),8000000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(user1.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user1.getAddress(), 1))[1],
                99900,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user1).withDraw(
                await user1.getAddress(), 
                1,
                odosData,
                odosSignData,
                99900,
                timeStamp,
                {value: nativeFee});
            const tx =await  BorrowingContractA.connect(user1).getOptionFeesToPay(1);
            // await expect(tx).to.be.reverted;

        })

        it("Should revert DeadlinePassed",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,TokenB,
                treasuryA,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("50");

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})

            const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
            const latestBlock = await ethers.provider.getBlock(blockNumber);
            const latestTimestamp1 = latestBlock.timestamp;
            await time.increaseTo(latestTimestamp1 + 138240000);

            const tx =await  BorrowingContractB.connect(user2).getOptionFeesToPay(1);
            // await expect(tx).to.be.reverted;

        })

        it("Should revert InsufficientBalance",async function(){
            const {
                BorrowingContractA,BorrowingContractB,
                CDSContractA,CDSContractB,
                usdtA,usdtB,TokenB,
                treasuryA,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            await CDSContractB.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            const depositAmount = ethers.parseEther("50");

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})

            const blockNumber = await ethers.provider.getBlockNumber(); // Get latest block number
            const latestBlock = await ethers.provider.getBlock(blockNumber);
            const latestTimestamp1 = latestBlock.timestamp;
            await time.increaseTo(latestTimestamp1 + 1382400);

            const tx = await BorrowingContractB.connect(user2).getOptionFeesToPay(1);

            await TokenB.connect(user2).approve(await BorrowingContractB.getAddress(), Number(tx) + 1000000);
            await TokenB.connect(user2).transfer(await user1.getAddress(), await TokenB.balanceOf(await user2.getAddress()));

            const tx1 = BorrowingContractB.connect(user2).renewOptions(1, {value:nativeFee});
            await expect(tx1).to.be.reverted;
        })
    })





    describe("Minting tokens and transfering tokens", async function(){

        it("Should check Trinity Token contract & Owner of contracts",async () => {
            const{CDSContractA,TokenA} = await loadFixture(deployer);
            expect(await CDSContractA.usda()).to.be.equal(await TokenA.getAddress());
            expect(await CDSContractA.owner()).to.be.equal(await owner.getAddress());
            expect(await TokenA.owner()).to.be.equal(await owner.getAddress());
        })

        it("Should Mint token", async function() {
            const{TokenA} = await loadFixture(deployer);
            await TokenA.mint(owner.getAddress(),ethers.parseEther("1"));
            expect(await TokenA.balanceOf(owner.getAddress())).to.be.equal(ethers.parseEther("1"));
        })

        it("should deposit USDT into CDS",async function(){
            const {CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA} = await loadFixture(deployer);

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await usdtB.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),10000000000);
            await CDSContractB.connect(user1).deposit(10000000000,0,false,10000000000,100000, { value: nativeFee.toString()});
            
            expect(await CDSContractB.totalCdsDepositedAmount()).to.be.equal(10000000000);

            let tx = await CDSContractB.cdsDetails(user1.getAddress());
            expect(tx.hasDeposited).to.be.equal(true);
            expect(tx.index).to.be.equal(1);
        })

        it("should deposit USDT and USDa into CDS", async function(){
            const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
            await usdtA.mint(owner.getAddress(),30000000000);
            await usdtA.connect(owner).approve(CDSContractA.getAddress(),30000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.deposit(20000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await TokenA.mint(owner.getAddress(),800000000)
            await TokenA.connect(owner).approve(CDSContractA.getAddress(),800000000);

            await CDSContractA.connect(owner).deposit(200000000,800000000,true,1000000000,90000, { value: nativeFee.toString()});
            expect(await CDSContractA.totalCdsDepositedAmount()).to.be.equal(21000000000);

            let tx = await CDSContractA.cdsDetails(owner.getAddress());
            expect(tx.hasDeposited).to.be.equal(true);
            expect(tx.index).to.be.equal(2);
        })
    })

    describe("Checking revert conditions", function(){

        it("should revert if Liquidation amount can't greater than deposited amount", async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).deposit(
                3000000000,700000000,true,ethers.parseEther("5000"),100000)).to.be.reverted;
        })

        it("should revert if eth price is zero", async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).deposit(
                3000000000,700000000,true,1000000000,0)).to.be.reverted;
        })

        it("should revert if 0 USDT deposit into CDS", async function(){
            const {CDSContractA,TokenA,usdtA} = await loadFixture(deployer);
            await usdtA.mint(owner.getAddress(),10000000000);
            await usdtA.connect(owner).approve(CDSContractA.getAddress(),10000000000);

            expect(await usdtA.allowance(owner.getAddress(),CDSContractA.getAddress())).to.be.equal(10000000000);
            await expect(CDSContractA.deposit(
                0,ethers.parseEther("1"),true,ethers.parseEther("0.5"),100000)).to.be.reverted;
        })

        it("should revert if USDT deposit into CDS is greater than 20%", async function(){
            const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
            await usdtA.mint(owner.getAddress(),30000000000);
            await usdtA.connect(owner).approve(CDSContractA.getAddress(),30000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.deposit(20000000000,0,true,10000000000,100000,{ value: nativeFee.toString()});

            await TokenA.mint(owner.getAddress(),700000000)
            await TokenA.connect(owner).approve(CDSContractA.getAddress(),700000000);

            await expect(CDSContractA.connect(owner).deposit(3000000000,700000000,true,500000000,100000,{ value: nativeFee.toString()})).to.be.reverted;
        })

        it("should revert if Insufficient USDa balance with msg.sender", async function(){
            const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
            await usdtA.mint(owner.getAddress(),30000000000);
            await usdtA.connect(owner).approve(CDSContractA.getAddress(),30000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.deposit(20000000000,0,true,10000000000,100000,{ value: nativeFee.toString()});

            await TokenA.mint(owner.getAddress(),70000000)
            await TokenA.connect(owner).approve(CDSContractA.getAddress(),70000000);

            await expect(CDSContractA.connect(owner).deposit(200000000,800000000,true,500000000,100000,{ value: nativeFee.toString()})).to.be.reverted;
        })

        it("should revert Insufficient USDT balance with msg.sender", async function(){
            const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
            await usdtA.mint(owner.getAddress(),20100000000);
            await usdtA.connect(owner).approve(CDSContractA.getAddress(),20100000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.deposit(20000000000,0,true,10000000000,100000,{ value: nativeFee.toString()});

            await TokenA.mint(owner.getAddress(),800000000)
            await TokenA.connect(owner).approve(CDSContractA.getAddress(),800000000);


            await expect(CDSContractA.connect(owner).deposit(200000000,800000000,true,500000000,100000,{ value: nativeFee.toString()})).to.be.reverted;
        })

        it("should revert Insufficient USDT balance with msg.sender", async function(){
            const {CDSContractA,usdtA} = await loadFixture(deployer);
            await usdtA.mint(owner.getAddress(),10000000000);
            await usdtA.connect(owner).approve(CDSContractA.getAddress(),10000000000);

            expect(await usdtA.allowance(owner.getAddress(),CDSContractA.getAddress())).to.be.equal(10000000000);

            await expect(CDSContractA.deposit(20000000000,0,true,10000000000,100000)).to.be.reverted;
        })

        it("Should revert if zero balance is deposited in CDS",async () => {
            const {CDSContractA} = await loadFixture(deployer);
            await expect( CDSContractA.connect(user1).deposit(0,0,true,ethers.parseEther("1"),100000)).to.be.reverted;
        })

        it("Should revert if Input address is invalid",async () => {
            const {CDSContractA} = await loadFixture(deployer);  
            await expect( CDSContractA.connect(owner).setBorrowingContract(ethers.ZeroAddress)).to.be.reverted;
        })

        it("Should revert if Input address is invalid",async () => {
            const {CDSContractA} = await loadFixture(deployer);  
            await expect( CDSContractA.connect(owner).setBorrowingContract(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the index is not valid",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x")).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setTreasury",async function(){
            const {CDSContractA,treasuryA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setTreasury(treasuryA.getAddress())).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setWithdrawTimeLimit",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setWithdrawTimeLimit(1000)).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setGlobalVariables",async function(){
            const {CDSContractA,globalVariablesA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setGlobalVariables(await globalVariablesA.getAddress())).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setBorrowingContract",async function(){
            const {BorrowingContractA,CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setBorrowingContract(BorrowingContractA.getAddress())).to.be.reverted;
        })

        it("Should revert if the Treasury address is zero",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setTreasury(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the Global address is zero",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setGlobalVariables(ZeroAddress)).to.be.reverted;
        })

        it("Should revert if the Global address is EOA",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setGlobalVariables(await user1.getAddress())).to.be.reverted;
        })

        it("Should revert if the Treasury address is not contract address",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setTreasury(user2.getAddress())).to.be.reverted;
        })

        it("Should revert if the zero sec is given in setWithdrawTimeLimit",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(owner).setWithdrawTimeLimit(0)).to.be.reverted;
        })

        it("Should revert if USDa limit can't be zero",async () => {
            const {CDSContractA} = await loadFixture(deployer);  
            await expect( CDSContractA.connect(owner).setUSDaLimit(0)).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setUSDaLImit",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setUSDaLimit(10)).to.be.reverted;
        })

        it("Should revert if USDT limit can't be zero",async () => {
            const {CDSContractA} = await loadFixture(deployer);  
            await expect( CDSContractA.connect(owner).setUsdtLimit(0)).to.be.reverted;
        })

        it("Should revert if the caller is not owner for setUsdtLImit",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).setUsdtLimit(1000)).to.be.reverted;
        })

        
        it("Should revert This function can only called by Borrowing contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).calculateCumulativeRate(1000)).to.be.reverted;
        })
       
        it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).updateLiquidationInfo(1,[0,1,2,3,1,2])).to.be.reverted;
        })        
        it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).updateTotalAvailableLiquidationAmount(1000)).to.be.reverted;
        })        
        it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).updateTotalCdsDepositedAmount(1000)).to.be.reverted;
        })        
        it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).updateTotalCdsDepositedAmountWithOptionFees(1000)).to.be.reverted;
        })

        it("should revert Surplus USDT amount",async function(){
            const {CDSContractA,globalVariablesA,usdtA,usdtB} = await loadFixture(deployer);

            await usdtA.connect(user1).mint(user1.getAddress(),30000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),30000000000);
            const options = "0x00030100110100000000000000000000000000030d40";

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            const tx = CDSContractA.connect(user1).deposit(30000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await expect(tx).to.be.reverted;

        })
        it("Should revert This function can only called by Global variables or Liquidation contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);
            await expect(CDSContractA.connect(user1).updateTotalCdsDepositedAmountWithOptionFees(1000)).to.be.reverted;
        })

        it("Should revert CDS: Not enough fund in CDS during withdraw from cds",async () => {
            const {BorrowingContractA,CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            const tx = CDSContractA.connect(user2).withdraw(1,100000,0,1,"0x", { value: nativeFee1});
            await expect(tx).to.be.reverted;

        })

        it("Should revert if called initialize twice",async function(){
            const {CDSContractA} = await loadFixture(deployer);

            const tx = CDSContractA.initialize(
                await TokenA.getAddress(),
                priceFeedAddressMainnetA,
                await usdtA.getAddress(),
                await multiSignA.getAddress()
            )
            await expect(tx).to.be.reverted;
        })

        it("Should revert called if calculateCumulativeValue called by other than borrowing contract",async function(){
            const {CDSContractA} = await loadFixture(deployer);

            const tx = CDSContractA.connect(user1).calculateCumulativeValue(1,2,3);
            await expect(tx).to.be.reverted;
        })

    })

    describe("To check CDS withdrawl function",function(){
        it("Should withdraw from cds,both chains have cds amount and eth deposit",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});

            await usdtB.mint(user2.getAddress(),20000000000)
            await usdtB.mint(user1.getAddress(),50000000000)
            await usdtB.connect(user2).approve(CDSContractB.getAddress(),20000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),50000000000);

            await CDSContractB.connect(user1).deposit(2000000000,0,true,1500000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractB.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            await CDSContractA.connect(user2).withdraw(1,100000,0,1,"0x", { value: nativeFee1});
            const tx = await CDSContractA.getCDSDepositDetails(
                await user2.getAddress(), 1);
            await expect(tx[0].withdrawed).to.be.equal(true);
        })

        it("Should withdraw from cds,both chains have cds amount and eth deposit the cds user not opted for liq gains",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,false,0,100000, { value: nativeFee.toString()});

            await usdtB.mint(user2.getAddress(),20000000000)
            await usdtB.mint(user1.getAddress(),50000000000)
            await usdtB.connect(user2).approve(CDSContractB.getAddress(),20000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),50000000000);

            await CDSContractB.connect(user1).deposit(2000000000,0,false,0,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractB.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            await CDSContractA.connect(user2).withdraw(1,100000,0,1,"0x", { value: nativeFee1});
            const tx = await CDSContractA.getCDSDepositDetails(
                await user2.getAddress(), 1);
            await expect(tx[0].withdrawed).to.be.equal(true);
        })

        it("Should withdraw from cds,both chains have cds amount and one chain have eth deposit",async () => {
            const {BorrowingContractB,CDSContractA,CDSContractB,usdtA,usdtB,treasuryB,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});

            await usdtB.mint(user2.getAddress(),20000000000)
            await usdtB.mint(user1.getAddress(),50000000000)
            await usdtB.connect(user2).approve(CDSContractB.getAddress(),20000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),50000000000);

            await CDSContractB.connect(user1).deposit(2000000000,0,true,1500000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractB.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(5,0, optionsA, false)

            await CDSContractA.connect(user2).withdraw(1,100000,0,1,"0x", { value: nativeFee1});
            const tx = await CDSContractA.getCDSDepositDetails(
                await user2.getAddress(), 1);
            await expect(tx[0].withdrawed).to.be.equal(true);
        })

        it("Should withdraw from cds,one chain have cds amount and both chains have eth deposit",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,usdtA,treasuryB,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});
            await CDSContractA.connect(user1).deposit(5000000000,0,true,5000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");;
            
            await BorrowingContractB.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false)

            await CDSContractA.connect(user2).withdraw(1,100000,0,1,"0x", { value: nativeFee1});
            const tx = await CDSContractA.getCDSDepositDetails(
                await user2.getAddress(), 1);
            await expect(tx[0].withdrawed).to.be.equal(true);
        })

        it("Should withdraw from cds",async () => {
            const {CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await CDSContractA.connect(user1).withdraw(1,90000,0,1,"0x", { value: nativeFee.toString()});
            const tx = await CDSContractA.getCDSDepositDetails(
                await user1.getAddress(), 1);
            await expect(tx[0].withdrawed).to.be.equal(true);
        })

        it("Should revert eth price is zero",async () => {
            const {CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await expect(CDSContractA.connect(user1).withdraw(1,0,0,1,"0x", { value: nativeFee.toString()})).to.be.reverted;
        })

        it("Should revert Already withdrawn",async () => {
            const {CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee.toString()});
            const tx =  CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee.toString()});
            await expect(tx).to.be.reverted;
        })

        it("Should revert cannot withdraw before the withdraw time limit",async () => {
            const {CDSContractA,usdtA,multiSignA,globalVariablesA} = await loadFixture(deployer);

            await multiSignA.connect(owner).approveSetterFunction([2]);
            await multiSignA.connect(owner1).approveSetterFunction([2]);
            await CDSContractA.connect(owner).setWithdrawTimeLimit(1000);

            await usdtA.connect(user1).mint(user1.getAddress(),10000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),10000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const tx =  CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee.toString()});
            await expect(tx).to.be.reverted;
        })

        it("Should withdraw from cds,both chains have cds amount and eth deposit",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});

            await CDSContractA.calculateLiquidatedETHTogiveToUser(await user2.getAddress(), 1)
        })
    })

    describe("Should redeem USDT correctly",function(){
        it("Should redeem USDT correctly",async function(){
            const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
            await usdtA.mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user1).deposit(20000000000,0,true,10000000000,100000,{ value: nativeFee.toString()});

            await TokenA.mint(owner.getAddress(),800000000);
            await TokenA.connect(owner).approve(CDSContractA.getAddress(),800000000);

            await CDSContractA.connect(owner).redeemUSDT(800000000,1500,1000,{ value: nativeFee.toString()});

            expect(await TokenA.totalSupply()).to.be.equal(20000000000);
            expect(await usdtA.balanceOf(owner.getAddress())).to.be.equal(1200000000);
        })

        it("Should revert Amount should not be zero",async function(){
            const {CDSContractA,globalVariablesA} = await loadFixture(deployer);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            const tx = CDSContractA.connect(owner).redeemUSDT(0,1500,1000,{ value: nativeFee.toString()});
            await expect(tx).to.be.reverted;
        })

        it("Should revert Insufficient USDa balance",async function(){
            const {CDSContractA,TokenA,globalVariablesA} = await loadFixture(deployer);
            await TokenA.mint(owner.getAddress(),80000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            const tx = CDSContractA.connect(owner).redeemUSDT(800000000,1500,1000,{ value: nativeFee.toString()});
            await expect(tx).to.be.reverted;
        })
    })

    describe("Should calculate value correctly",function(){
        it("Should calculate value for no deposit in borrowing",async function(){
            const {CDSContractA,usdtA,globalVariablesA} = await loadFixture(deployer);
            await usdtA.mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(20000000000,0,true,10000000000,100000,{ value: nativeFee.toString()});
        })

        it("Should calculate value for no deposit in borrowing and 2 deposit in cds",async function(){
            const {CDSContractA,TokenA,usdtA,globalVariablesA} = await loadFixture(deployer);
            await usdtA.mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()
            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)
            await CDSContractA.connect(user1).deposit(20000000000,0,true,10000000000,100000,{ value: nativeFee.toString()});

            await TokenA.mint(user2.getAddress(),4000000000);
            await TokenA.connect(user2).approve(CDSContractA.getAddress(),4000000000);
            await CDSContractA.connect(user2).deposit(0,4000000000,true,4000000000,100000,{ value: nativeFee.toString()});

            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x",{ value: nativeFee.toString()});
        })
        
    })

    describe("CDS users should able to deposit and withdraw, if different collaterals deposited in Borrow", function(){
        it("Should able to deposit, if WeETH deposited in this chain borrow after initial deposit",async function(){
            const {
                BorrowingContractA,weETHA,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await weETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
        })

        it("Should able to deposit, if WeETH is deposited in other chain borrow after initial deposit",async function(){
            const {
                BorrowingContractB,weETHB,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA,
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await weETHB.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHB.connect(user2).approve(await BorrowingContractB.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
        })

        it("Should able to withdraw, if WeETH is deposited in this chain borrow after initial deposit",async function(){
            const {
                BorrowingContractA,weETHA,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await weETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee1.toString()});
        })

        it("Should able to withdraw, if WeETH is deposited in other chain borrow after initial deposit",async function(){
            const {
                BorrowingContractB,weETHB,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA,
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await weETHB.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHB.connect(user2).approve(await BorrowingContractB.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee1.toString()});
        })

        it("Should able to withdraw, if WeETH is liquidated in this chain borrow after initial deposit",async function(){
            const {
                BorrowingContractA,weETHA,
                CDSContractA,
                usdtA,
                globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await weETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            const optionsB = Options.newOptions().addExecutorLzReceiveOption(12500000, 0).toHex().toString()
            let nativeFee2 = 0
            ;[nativeFee2] = await globalVariablesA.quote(5,0, optionsB, false)

            await BorrowingContractA.connect(owner).liquidate(
                await user2.getAddress(),
                1,
                80000,
                1,
                {value: (nativeFee1).toString()})
            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee2.toString()});
        })

        it("Should able to deposit, if WrsETH deposited in this chain borrow after initial deposit",async function(){
            const {
                BorrowingContractA,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await wrsETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await wrsETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                3,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
        })

        it("Should able to deposit, if WrsETH is deposited in other chain borrow after initial deposit",async function(){
            const {
                BorrowingContractB,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA,
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await wrsETHB.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await wrsETHB.connect(user2).approve(await BorrowingContractB.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                3,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
        })

        it("Should able to withdraw, if WrsETH is deposited in this chain borrow after initial deposit",async function(){
            const {
                BorrowingContractA,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await wrsETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await wrsETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                3,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee1.toString()});
        })

        it("Should able to withdraw, if WrsETH is deposited in other chain borrow after initial deposit",async function(){
            const {
                BorrowingContractB,
                CDSContractA,
                usdtA,treasuryA
                ,globalVariablesA,
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await wrsETHB.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await wrsETHB.connect(user2).approve(await BorrowingContractB.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractB.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                3,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )
            
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee1.toString()});
        })

        it("Should able to withdraw, if WrsETH is liquidated in this chain borrow after initial deposit",async function(){
            const {
                BorrowingContractA,
                CDSContractA,
                usdtA,
                globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});
            
            await wrsETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await wrsETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                3,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            const optionsB = Options.newOptions().addExecutorLzReceiveOption(12500000, 0).toHex().toString()
            let nativeFee2 = 0
            ;[nativeFee2] = await globalVariablesA.quote(5,0, optionsB, false)

            await BorrowingContractA.connect(owner).liquidate(
                await user2.getAddress(),
                1,
                80000,
                1,
                {value: (nativeFee1).toString()})
            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee2.toString()});
        })

        it("Should able to withdraw, if more than one type of collateral is liquidated in this chain borrow after initial deposit",async function(){
            const {
                BorrowingContractA,weETHA,
                CDSContractA,
                usdtA,
                globalVariablesA
            } = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.connect(user1).mint(user1.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),20000000000);
            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,1,options, false)
            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            await BorrowingContractA.connect(user3).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                ethers.parseEther("1")],
                {value: ethers.parseEther("1") + BigInt(nativeFee)}
            )
            
            await weETHA.connect(user2).mint(user2.getAddress(),ethers.parseEther('10'));
            await weETHA.connect(user2).approve(await BorrowingContractA.getAddress(), ethers.parseEther("0.5"));

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                2,
                ethers.parseEther("0.5")],
                {value: BigInt(nativeFee)}
            )

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            const optionsB = Options.newOptions().addExecutorLzReceiveOption(12500000, 0).toHex().toString()
            let nativeFee2 = 0
            ;[nativeFee2] = await globalVariablesA.quote(5,0, optionsB, false)

            await BorrowingContractA.connect(owner).liquidate(
                await user2.getAddress(),
                1,
                80000,
                1,
                {value: (nativeFee1).toString()})

            await BorrowingContractA.connect(owner).liquidate(
                await user3.getAddress(),
                1,
                80000,
                1,
                {value: (nativeFee1).toString()})
            await CDSContractA.connect(user1).withdraw(1,100000,0,1,"0x", { value: nativeFee2.toString()});
        })

    })

    describe("Check cumulative value", function(){
        it("Checking cumulative value, deposits in same chain, 1 borrower 1 cds ",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA,TokenB,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
                const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
                let nativeFee1 = 0
                ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

                await BorrowingContractA.calculateCumulativeRate();
                await TokenA.mint(await user2.getAddress(),80000000);
                await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
                const {odosData, odosSignData} = await calculateUpsideToSwap(
                    (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                    120000,
                    1e18,
                    ZeroAddress,
                    await treasuryA.getAddress(),
                    await BorrowingContractA.getAddress()
                )
                await BorrowingContractA.connect(user2).withDraw(
                    await user2.getAddress(), 
                    1,
                    odosData,odosSignData,
                    120000,
                    timeStamp,
                    {value: nativeFee1});

            await CDSContractA.connect(user2).deposit(5000000000,0,true,5000000000,100000, { value: nativeFee.toString()});

            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})

            await CDSContractA.connect(user2).withdraw(1,130000,0,1,"0x", { value: nativeFee1});
        })

        it("Checking cumulative value, deposits in same chain, 2 borrower 1 cds ",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA,TokenB,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            await BorrowingContractA.connect(user1).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user2.getAddress(),80000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                90000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,odosSignData,
                90000,
                timeStamp,
                {value: nativeFee1});

            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user1.getAddress(),90000000);
            await TokenA.connect(user1).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user1.getAddress()));

            await expect(CDSContractA.connect(user2).withdraw(1,82000,0,1,"0x", { value: nativeFee1})).to.be.reverted;
        })

        it("Checking cumulative value, deposits in same chain, 1 borrower 2 cds ",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA,TokenB,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});
            await CDSContractA.connect(user1).deposit(5000000000,0,true,5000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user2.getAddress(),80000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                90000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,odosSignData,
                90000,
                timeStamp,
                {value: nativeFee1});

            await CDSContractA.connect(user2).withdraw(1,90000,0,1,"0x", { value: nativeFee1});
            await CDSContractA.connect(user1).withdraw(1,90000,0,1,"0x", { value: nativeFee1});

        })

        it("Checking cumulative value, deposits in same chain, 1 borrower 2 cds ",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA,TokenB,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user2).deposit(12000000000,0,true,12000000000,100000, { value: nativeFee.toString()});
            await CDSContractA.connect(user1).deposit(5000000000,0,true,5000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})

            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user2.getAddress(),80000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                90000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,odosSignData,
                90000,
                timeStamp,
                {value: nativeFee1});

            await CDSContractA.connect(user2).withdraw(1,90000,0,1,"0x", { value: nativeFee1});
            await CDSContractA.connect(user1).withdraw(1,90000,0,1,"0x", { value: nativeFee1});

        })

        it("Checking cumulative value, deposits in different chain, 1 borrower 1 cds ",async () => {
            const {BorrowingContractB,BorrowingContractA,CDSContractA,CDSContractB,usdtA,usdtB,globalVariablesA,TokenB,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await usdtB.mint(user2.getAddress(),20000000000)
            await usdtB.mint(user1.getAddress(),50000000000)
            await usdtB.connect(user2).approve(CDSContractB.getAddress(),20000000000);
            await usdtB.connect(user1).approve(CDSContractB.getAddress(),50000000000);

            await CDSContractB.connect(user1).deposit(2000000000,0,true,1500000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [1,
                110000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))})
            
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1200000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user2.getAddress(),100000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                90000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,odosSignData,
                90000,
                timeStamp,
                {value: nativeFee1});

            await CDSContractB.connect(user1).withdraw(1,85000,0,1,"0x", { value: nativeFee1});
        })

        it("Checking cumulative value, deposits borrower and cds in same chain",async () => {
            const {BorrowingContractA,CDSContractA,usdtA,globalVariablesA,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [0,
                105000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            await BorrowingContractA.connect(user2).depositTokens(
                102000,
                timeStamp,
                [0,
                107100,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            await BorrowingContractA.connect(user2).depositTokens(
                104000,
                timeStamp,
                [0,
                109200,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            await CDSContractA.connect(user1).deposit(1000000000,0,true,1000000000,110000, { value: nativeFee.toString()});

            await BorrowingContractA.connect(user2).depositTokens(
                105000,
                timeStamp,
                [1,
                110250,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                107000,
                timeStamp,
                [1,
                112350,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                102000,
                timeStamp,
                [1,
                107100,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                105000,
                timeStamp,
                [1,
                110250,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            const domain = {
                name: "CDS",
                version: "1",
                chainId: 11155111,
                verifyingContract: await CDSContractA.getAddress()
            };
            
            const types = {
                Permit: [ 
                  { name: "excessProfitCumulativeValue", type: "uint256" },
                  { name: "nonce", type: "uint256"}
              ]
            };
            const cumulativeValue = 79090909;
            const nonce = await owner2.getNonce();
            const message = { 
              excessProfitCumulativeValue: Math.abs(cumulativeValue),
              nonce: nonce
            };
            // Sign the hashed message
            const signature = await owner2.signTypedData(domain, types, message);
            await CDSContractA.connect(user1).withdraw(
                2,
                105000,
                79090909,
                nonce,
                signature,
                { value: nativeFee1}
            );
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user2.getAddress(),80000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                104000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,
                odosSignData,
                104000,
                timeStamp,
                {value: nativeFee1}
            );
        })

        it("Checking cumulative value, deposits borrower and cds in same chain",async () => {
            const {BorrowingContractA,CDSContractA,usdtA,globalVariablesA,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [0,
                105000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            await BorrowingContractA.connect(user2).depositTokens(
                102000,
                timeStamp,
                [0,
                107100,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            await BorrowingContractA.connect(user2).depositTokens(
                104000,
                timeStamp,
                [0,
                109200,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            await CDSContractA.connect(user1).deposit(1000000000,0,true,1000000000,110000, { value: nativeFee.toString()});

            await BorrowingContractA.connect(user2).depositTokens(
                105000,
                timeStamp,
                [1,
                110250,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                107000,
                timeStamp,
                [1,
                112350,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                102000,
                timeStamp,
                [1,
                107100,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                105000,
                timeStamp,
                [1,
                110250,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user2.getAddress(),80000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                104000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,odosSignData,
                104000,
                timeStamp,
                {value: nativeFee1}
            );
            const domain = {
                name: "CDS",
                version: "1",
                chainId: 11155111,
                verifyingContract: await CDSContractA.getAddress()
            };
            
            const types = {
                Permit: [ 
                  { name: "excessProfitCumulativeValue", type: "uint256" },
                  { name: "nonce", type: "uint256"}
              ]
            };
            const cumulativeValue = 79090909;
            const message = { 
              excessProfitCumulativeValue: Math.abs(cumulativeValue),
              nonce: await owner2.getNonce()
            };

            // Sign the hashed message
            const signature = await owner2.signTypedData(domain, types, message);
            await CDSContractA.connect(user1).withdraw(
                2,
                105000,
                79090909,
                1,
                signature,
                { value: nativeFee1}
            );

            await CDSContractA.connect(user1).withdraw(
                1,
                104000,
                79090909,
                1,
                signature,
                { value: nativeFee1}
            );
        })

        it("Checking cds upside value, deposits borrower and cds in same chain",async () => {
            const {BorrowingContractA,CDSContractA,usdtA,globalVariablesA,TokenA} = await loadFixture(deployer);
            const timeStamp = await time.latest();

            await usdtA.mint(user2.getAddress(),20000000000)
            await usdtA.mint(user1.getAddress(),50000000000)
            await usdtA.connect(user2).approve(CDSContractA.getAddress(),20000000000);
            await usdtA.connect(user1).approve(CDSContractA.getAddress(),50000000000);

            const options = Options.newOptions().addExecutorLzReceiveOption(400000, 0).toHex().toString()

            let nativeFee = 0
            ;[nativeFee] = await globalVariablesA.quote(1,0, options, false)

            await CDSContractA.connect(user1).deposit(10000000000,0,true,10000000000,100000, { value: nativeFee.toString()});

            const depositAmount = ethers.parseEther("1");
            
            await BorrowingContractA.connect(user2).depositTokens(
                100000,
                timeStamp,
                [0,
                105000,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            await BorrowingContractA.connect(user2).depositTokens(
                102000,
                timeStamp,
                [0,
                107100,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            await BorrowingContractA.connect(user2).depositTokens(
                104000,
                timeStamp,
                [0,
                109200,
                ethVolatility,
                1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            const optionsA = Options.newOptions().addExecutorLzReceiveOption(1100000, 0).toHex().toString()
            let nativeFee1 = 0
            ;[nativeFee1] = await globalVariablesA.quote(3,0, optionsA, false);

            await CDSContractA.connect(user1).deposit(1000000000,0,true,1000000000,110000, { value: nativeFee.toString()});

            await BorrowingContractA.connect(user2).depositTokens(
                105000,
                timeStamp,
                [1,
                110250,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                107000,
                timeStamp,
                [1,
                112350,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            
            await BorrowingContractA.calculateCumulativeRate();
            await TokenA.mint(await user2.getAddress(),80000000);
            await TokenA.connect(user2).approve(await BorrowingContractA.getAddress(),await TokenA.balanceOf(await user2.getAddress()));
            const {odosData, odosSignData} = await calculateUpsideToSwap(
                (await treasuryA.getBorrowing(await user2.getAddress(), 1))[1],
                104000,
                1e18,
                ZeroAddress,
                await treasuryA.getAddress(),
                await BorrowingContractA.getAddress()
            )
            await BorrowingContractA.connect(user2).withDraw(
                await user2.getAddress(), 
                1,
                odosData,odosSignData,
                104000,
                timeStamp,
                {value: nativeFee1}
            );
            await BorrowingContractA.connect(user2).depositTokens(
                102000,
                timeStamp,
                [1,
                107100,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )
            await BorrowingContractA.connect(user2).depositTokens(
                105000,
                timeStamp,
                [1,
                110250,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            const domain = {
                name: "CDS",
                version: "1",
                chainId: 11155111,
                verifyingContract: await CDSContractA.getAddress()
            };
            
            const types = {
                Permit: [ 
                  { name: "excessProfitCumulativeValue", type: "uint256" },
                  { name: "nonce", type: "uint256"}
              ]
            };
            const cumulativeValue = 79090909;
            const message = { 
              excessProfitCumulativeValue: Math.abs(cumulativeValue),
              nonce: await owner2.getNonce()
            };
            // Sign the hashed message
            const signature = await owner2.signTypedData(domain, types, message);
            await CDSContractA.connect(user1).withdraw(
                2,
                105000,
                79090909,
                1,
                signature,
                { value: nativeFee1}
            );

            await BorrowingContractA.connect(user2).depositTokens(
                105000,
                timeStamp,
                [1,
                110250,
                ethVolatility,1,
                depositAmount],
                {value: (depositAmount + BigInt(nativeFee))}
            )

            await expect(CDSContractA.connect(user1).withdraw(
                1,
                104000,
                79090909,
                1,
                signature,
                { value: nativeFee1}
            )).to.be.reverted;
        })
    })
})