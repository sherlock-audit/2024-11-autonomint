// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.22;

interface LiquidityPool {
    function deposit() external payable returns (uint256);
}
