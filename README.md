
# Autonomint contest details

- Join [Sherlock Discord](https://discord.gg/MABEWyASkp)
- Submit findings using the issue page in your private contest repo (label issues as med or high)
- [Read for more details](https://docs.sherlock.xyz/audits/watsons)

# Q&A

### Q: On what chains are the smart contracts going to be deployed?
Optimism and Mode
___

### Q: If you are integrating tokens, are you allowing only whitelisted tokens to work with the codebase or any complying with the standard? Are they assumed to have certain properties, e.g. be non-reentrant? Are there any types of [weird tokens](https://github.com/d-xo/weird-erc20) you want to integrate?
We are allowing only whitelisted tokens like wrsEth, weETH, ETH and USDa(Our own token) in borrowing contracts. And in dCDS we are allowing tokens like USDa(Our own token), USDT and Abond(Our own token) for redeeming.

___

### Q: Are there any limitations on values set by admins (or other roles) in the codebase, including restrictions on array lengths?
 In Borrowing.sol
> setTreasury() can be called only by Admin and the input can't be any EOA accounts and zero address. Another restriction is that admin should have 
  approval from multisig for setting the treasury address.
> setOptions(), setBorrowLiquidation(), liquidate()  can be called only by Admin and the input can't be any EOA accounts and zero address. 
  executeOrdersInSynthetix(), closeThePositionInSynthetix() can be called only by Admin
> setLTV() can be called only by Admin and the input can't be zero value. Another restriction is that admin should have approval from multisig for 
  setting the LTV.
> setBondRatio()  can be called only by Admin and the input can't be zero value. Another restriction is that admin should have approval from multisig 
  for setting the bond ratio
> setAPR() can be called only by Admin and the input can't be zero value. Another restriction is that admin should have approval from multisig for 
  setting the bond APR.
> updateRatePerSecByUSDaPrice() can be called only by Admin and the input can't be zero value.

   In CDS.sol
> setAdminTwo(), setUsdtLimit(), setUSDaLimit() can be called only by Admin and the input can't be zero value.
> setWithdrawTimeLimit() setTreasury() can be called only by Admin and the input can't be zero value. Another restriction is that admin should have 
 approval from multisig for setting it
> setGlobalVariables(), setBorrowingContract(), setBorrowLiquidation() can be called only by Admin and the input can't be any EOA accounts and 
 zero address.

___

### Q: Are there any limitations on values set by admins (or other roles) in protocols you integrate with, including restrictions on array lengths?
Yes

https://github.com/ionicprotocol/ionic-token/blob/096f316af0cae878430b0d0d784f5aa8b76cc14e/src/IonicToken.sol#L87 Variables in this function are been used in the function which we have integrated with. 

___

### Q: Is the codebase expected to comply with any specific EIPs?
We have used EIP-712 for verifying sign
___

### Q: Are there any off-chain mechanisms involved in the protocol (e.g., keeper bots, arbitrage bots, etc.)? We assume these mechanisms will not misbehave, delay, or go offline unless otherwise specified.
 In borrowing.sol contract
	we are getting eth volatility as one of the param in depositToken function. 
	In withdraw function we are getting odosAssembledData in the form of bytes. 
	In liquidation we have 2 types of mechanisms first will be
  
In cds.sol contract 
	excess profit cumulative value and signature for cds withdraw


___

### Q: What properties/invariants do you want to hold even if breaking them has a low/unknown impact?
The properties/invariants which we would like to hold are:

New Borrows cannot mint new stablecoin if cds/borrow ratio is below 0.2 and cds users cannot withdraw. This might have a user experience issue.

___

### Q: Please discuss any design choices you made.
In cds.sol in withdraw function there is a variable called "currentValue". WE are getting this variable value from subtracting 1 wei from the output "cdsAmountToReturn()" function. We are subtracting 1 wei because of the precision loss. Because of this, user are losing 0.000001 dollar.

___

### Q: Please provide links to previous audits (if any).
None, this is our first audit. 
___

### Q: Please list any relevant protocol resources.
Website: https://www.autonomint.com/
Docs: https://docs.autonomint.com/autonomint
Tech docs: https://app.gitbook.com/o/KKBcUPmU8gGyXUz2WZem/s/cXD7zFiifJmGoAaDLBHP/core-contracts

___



# Audit scope


[Blockchain @ 70eb6cd7456348ce01f8ba02b79b2dd964da10df](https://github.com/Autonomint/Blockchain/tree/70eb6cd7456348ce01f8ba02b79b2dd964da10df)
- [Blockchain/Blockchian/contracts/Core_logic/CDS.sol](Blockchain/Blockchian/contracts/Core_logic/CDS.sol)
- [Blockchain/Blockchian/contracts/Core_logic/GlobalVariables.sol](Blockchain/Blockchian/contracts/Core_logic/GlobalVariables.sol)
- [Blockchain/Blockchian/contracts/Core_logic/Options.sol](Blockchain/Blockchian/contracts/Core_logic/Options.sol)
- [Blockchain/Blockchian/contracts/Core_logic/Treasury.sol](Blockchain/Blockchian/contracts/Core_logic/Treasury.sol)
- [Blockchain/Blockchian/contracts/Core_logic/borrowLiquidation.sol](Blockchain/Blockchian/contracts/Core_logic/borrowLiquidation.sol)
- [Blockchain/Blockchian/contracts/Core_logic/borrowing.sol](Blockchain/Blockchian/contracts/Core_logic/borrowing.sol)
- [Blockchain/Blockchian/contracts/Core_logic/multiSign.sol](Blockchain/Blockchian/contracts/Core_logic/multiSign.sol)
- [Blockchain/Blockchian/contracts/Token/Abond_Token.sol](Blockchain/Blockchian/contracts/Token/Abond_Token.sol)
- [Blockchain/Blockchian/contracts/Token/USDa.sol](Blockchain/Blockchian/contracts/Token/USDa.sol)
- [Blockchain/Blockchian/contracts/interface/CDSInterface.sol](Blockchain/Blockchian/contracts/interface/CDSInterface.sol)
- [Blockchain/Blockchian/contracts/interface/IAbond.sol](Blockchain/Blockchian/contracts/interface/IAbond.sol)
- [Blockchain/Blockchian/contracts/interface/IBorrowLiquidation.sol](Blockchain/Blockchian/contracts/interface/IBorrowLiquidation.sol)
- [Blockchain/Blockchian/contracts/interface/IBorrowing.sol](Blockchain/Blockchian/contracts/interface/IBorrowing.sol)
- [Blockchain/Blockchian/contracts/interface/IGlobalVariables.sol](Blockchain/Blockchian/contracts/interface/IGlobalVariables.sol)
- [Blockchain/Blockchian/contracts/interface/IMultiSign.sol](Blockchain/Blockchian/contracts/interface/IMultiSign.sol)
- [Blockchain/Blockchian/contracts/interface/IOptions.sol](Blockchain/Blockchian/contracts/interface/IOptions.sol)
- [Blockchain/Blockchian/contracts/interface/ITreasury.sol](Blockchain/Blockchian/contracts/interface/ITreasury.sol)
- [Blockchain/Blockchian/contracts/interface/IUSDa.sol](Blockchain/Blockchian/contracts/interface/IUSDa.sol)
- [Blockchain/Blockchian/contracts/interface/IonicInterface.sol](Blockchain/Blockchian/contracts/interface/IonicInterface.sol)
- [Blockchain/Blockchian/contracts/interface/Synthetix/IPerpsV2MarketBaseTypes.sol](Blockchain/Blockchian/contracts/interface/Synthetix/IPerpsV2MarketBaseTypes.sol)
- [Blockchain/Blockchian/contracts/interface/Synthetix/IPerpsV2MarketConsolidated.sol](Blockchain/Blockchian/contracts/interface/Synthetix/IPerpsV2MarketConsolidated.sol)
- [Blockchain/Blockchian/contracts/lib/BorrowLib.sol](Blockchain/Blockchian/contracts/lib/BorrowLib.sol)
- [Blockchain/Blockchian/contracts/lib/CDSLib.sol](Blockchain/Blockchian/contracts/lib/CDSLib.sol)
- [Blockchain/Blockchian/contracts/lib/Colors.sol](Blockchain/Blockchian/contracts/lib/Colors.sol)
- [Blockchain/Blockchian/contracts/oracles/BasePriceOracle.sol](Blockchain/Blockchian/contracts/oracles/BasePriceOracle.sol)
- [Blockchain/Blockchian/contracts/oracles/MasterPriceOracle.sol](Blockchain/Blockchian/contracts/oracles/MasterPriceOracle.sol)
- [Blockchain/Blockchian/contracts/oracles/defaultOracles/IRedSToneOracle.sol](Blockchain/Blockchian/contracts/oracles/defaultOracles/IRedSToneOracle.sol)

