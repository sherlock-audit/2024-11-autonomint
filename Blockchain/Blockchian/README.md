# Autonomint

This repository contains the smart contracts source code for Autonomint Protocol. The repository uses Hardhat as development environment for compilation, uint testing, deployment tasks and Foundry for invariant testing.

## Smart Contracts Explanation
- [Borrowing](#borrowing)
- [CDS](#cds)
- [Treasury](#treasury)
- [Options](#options)

### Borrowing
- [depositTokens](#deposit-tokens)
- [withDraw](#withdraw)
- [liquidate](#liquidate)
- [redeemYields](#redeem-yields)

#### Deposit Tokens
This function takes
- *_strikePercent* percentage increase of eth price
- *_strikePrice* strike price which the user opted
- *_volatility* eth volatility

as params.After ratio and [option fees](#options) calculation,half of the ETH is deposited to external protocol.The amints are minted to the user with option fees deducted.

#### Withdraw
Withdraws 50% of the deposited ETH from the protocol after user pays the debt amount.The 50% of the deposited amount is credited to the user with strike price gains and for the remaining they are given with ABond token which is fungible.Later they can use the Abond tokens to redeem yields from external protocol and 50% of the deposited ETH.

#### Liquidate
Liquidates the positions whose collateral value becomes 80%.The amints are provided by CDS users.Then during withdraw in CDS the profits and liquidated ETH are given to the users based on there proportions.

#### Redeem Yields
The user provides ABond tokens to redeem yields from external protocol.Based on the eth backed and cumulative rate of that ABond token the yield is calculated.

### CDS
- [deposit](#deposit-cds)
- [withdraw](#withdraw-cds)
- [redeemUSDT](#redeem-usdt)

#### Deposit CDS
The user provides the USDT and AMint to deposit and choose the amount of total depositing amount for liquidations in borrowing.If the USDT in CDS is less than 20K then, the user can deposit USDT only.After it reaches 20K, in the cumulative depositing amount, AMint must be above or equal to 80%.

#### Withdraw CDS
Withdraw the user amount with price change P/L, option fees, gains from [liquidation](#liquidate) and liquidated ETH amounts.

#### Redeem USDT
The user can provide AMint and get the equivalent amount of USDT.

### Options
- [calculateStrikePriceGains](#calculate-strike-price-gains)
- [calculateOptionPrice](#calculate-option-fees)

#### Calculate strike price gains
Calculates the strike price gains by if the current eth price greater than equal to strike price chose by user during [deposit](#deposit-tokens) else no gains.

#### Calculate option fees
Calculates the option fees based on the eth price, eth volatility, strike price chose.
