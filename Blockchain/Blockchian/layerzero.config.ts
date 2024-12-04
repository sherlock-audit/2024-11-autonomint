import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'USDaStablecoin',
}

const modeContract: OmniPointHardhat = {
    eid: EndpointId.MODE_V2_TESTNET,
    contractName: 'USDaStablecoin',
}

const baseSepoliaContract: OmniPointHardhat = {
    eid: EndpointId.BASESEP_V2_TESTNET,
    contractName: 'USDaStablecoin',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: sepoliaContract,
        },
        {
            contract: baseSepoliaContract,
        },
        {
            contract: modeContract,
        },
    ],
    connections: [
        {
            from: sepoliaContract,
            to: modeContract,
        },
        {
            from: sepoliaContract,
            to: baseSepoliaContract,
        },
        {
            from: baseSepoliaContract,
            to: sepoliaContract,
        },
        {
            from: baseSepoliaContract,
            to: modeContract,
        },
        {
            from: modeContract,
            to: sepoliaContract,
        },
        {
            from: modeContract,
            to: baseSepoliaContract,
        },
    ],
}

export default config
