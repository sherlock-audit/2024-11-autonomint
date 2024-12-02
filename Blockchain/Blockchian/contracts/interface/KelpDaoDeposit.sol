// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.22;

interface ILRTDepositPool {
    function depositETH(
        uint256 minRSETHAmountExpected,
        string calldata referralId
    ) external payable;
}
