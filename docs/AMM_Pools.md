# AMM Pools

## Adding new AMM pool

1. create new branch which would include pool name (`feat/xusd-rbtc-amm`), unless otherwise required use `master` branch as base.
2. if pool has new assets (that does not exist in portfolio yet), continue with step 2.1, otherwise skip to 2.6.

   2.1. add asset icon images to folder [/src/assets/images/tokens/](../src/assets/images/tokens/), use `svg` images if possible.

   2.2. Add new token to [/src/types/asset.ts](../src/types/asset.ts), key and value must be same: `XUSD = 'XUSD'`.

   2.3. Add mainnet token contract address to [/src/utils/blockchain/contracts.ts](../src/utils/blockchain/contracts.ts) and testnet address to [/src/utils/blockchain/contracts.ts](../src/utils/blockchain/contracts.testnet.ts) by creating new object with property which name is build from asset name and suffixed by \_token.

   Examples: `XUSD_token`, `RBTC_token`.

   ```typescript
   XUSD_token: {
       address: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
       abi: erc20TokenAbi,
   }
   ```

   2.4. Add token information to [/src/utils/dictionaries/assets-dictionary.ts](../src/utils/dictionaries/assets-dictionary.ts) assets map:

   ```typescript
   import usdtIcon from 'assets/images/tokens/usdt.svg';

   ...

     [
       Asset.XUSD,
       new AssetDetails(
         Asset.XUSD,
         'XUSD', // symbol
         'XUSD', // full name
         18, // token decimals
         3, // how much decimals platform should show (3 is ok for stablecoins, 8 is preferred for high value coins like BTC or ETH)
         xusdIcon, // ref to icon image
         true, // true when AMM exists for token (ensures frontend can use AMM to retrieve token price rates)
         false, // should token be hidden from portfolio if balance is 0. Most likely should be false.
       ),
     ],
   ```

   2.5. If asset doesn't have price oracle on Money-On-Chain, add it to `assetsWithoutOracle` array inside of [/src/app/hooks/price-feeds/usePriceFeeds_tradingPairRates.ts](../src/app/hooks/price-feeds/usePriceFeeds_tradingPairRates.ts)

   ```typescript
   [
       ...,
       Asset.XUSD,
   ]
   ```

   2.6. (Only if tokens were already decined in asset-dictionary):
   Open [/src/utils/dictionaries/assets-dictionary.ts](../src/utils/dictionaries/assets-dictionary.ts), find where token is defined and change `hasAmm` property in `AssetDetails` from `false` to `true`:

   ```typescript
   [
       Asset.XUSD,
       new AssetDetails(
         Asset.XUSD,
         'XUSD',
         'XUSD',
         18,
         3,
         xusdIcon,
         true, // <--- make sure this is true
         false,
       ),
     ],
   ```

   2.6. price feeds?

3. Add information about your pool to these arrays [/src/utils/dictionaries/amm/mainnet.ts](../src/utils/dictionaries/amm/mainnet.ts) (mainnet pool) and [/src/utils/dictionaries/amm/testnet.ts](../src/utils/dictionaries/amm/testnet.ts):

   3.1. If pool uses v1 converter (default):

   ```typescript
   [
     new AmmLiquidityPool(
       Asset.XUSD, // asset no. 1
       Asset.RBTC, // asset no. 2
       1, // converter version (1 or 2)
       AppMode.TESTNET, // on which network these contracts are deployed (AppMode.TESTNET or AppMode.MAINNET).
       '0xaBAABc2191A23D6Bb2cfa973892062c131cb7647', // converter contract address
       '0xdF298421CB18740a7059b0Af532167fAA45e7A98', // pool token address used by converter (note: it's not the same as token address)
     ).setSovRewards(true), // if pool does not give liquidity mining (SOV rewards) then this must be set to false. Default is true.
   ];
   ```

   3.2. If pool uses v2 converter, you will need extra to add additional pool token contract address for asset. no. 2:

   ```typescript
   [
     new AmmLiquidityPool(
       Asset.USDT,
       Asset.RBTC, // asset no. 2
       2,
       AppMode.TESTNET,
       '0x133eBE9c8bA524C9B1B601E794dF527f390729bF',
       '0x7274305BB36d66F70cB8824621EC26d52ABe9069',
       '0xfFBBF93Ecd27C8b500Bd35D554802F7F349A1E9B', // pool token address used by converter for asset no. 2.
     ),
   ];
   ```

4. Enable new pairs for spot trading (hopefully it will be automated soon):

   4.1. Open [/src/app/pages/SpotTradingPage/types.ts](../src/app/pages/SpotTradingPage/types.ts)

   4.2. Add new enum constants for pairs you want to be supported to `SpotPairType`:

   ```typescript
   [
       ....
       // RIF
       RIF_RBTC = 'RIF_RBTC',
       RIF_SOV = 'RIF_SOV',
       RIF_XUSD = 'RIF_XUSD',
       RIF_USDT = 'RIF_USDT',
       RIF_DOC = 'RIF_DOC',
       RIF_ETH = 'RIF_ETH',
       RIF_BNB = 'RIF_BNB',
       RIF_FISH = 'RIF_FISH',
   ]
   ```

   4.3. Add these pairs to `pairs` array:

   ```typescript
   [
       ...
       // RIF
       [SpotPairType.RIF_RBTC]: [Asset.RIF, Asset.RBTC],
       [SpotPairType.RIF_SOV]: [Asset.RIF, Asset.SOV],
       [SpotPairType.RIF_XUSD]: [Asset.RIF, Asset.XUSD],
       [SpotPairType.RIF_USDT]: [Asset.RIF, Asset.USDT],
       [SpotPairType.RIF_DOC]: [Asset.RIF, Asset.DOC],
       [SpotPairType.RIF_ETH]: [Asset.RIF, Asset.ETH],
       [SpotPairType.RIF_BNB]: [Asset.RIF, Asset.BNB],
       [SpotPairType.RIF_FISH]: [Asset.RIF, Asset.FISH],
   ]
   ```

   4.4. And to `pairList` too:

   ```typescript
   [
     ...// RIF
     SpotPairType.RIF_RBTC,
     SpotPairType.RIF_SOV,
     SpotPairType.RIF_XUSD,
     SpotPairType.RIF_USDT,
     SpotPairType.RIF_DOC,
     SpotPairType.RIF_ETH,
     SpotPairType.RIF_BNB,
     SpotPairType.RIF_FISH,
   ];
   ```

## Updating existing AMM pool

From time to time AMM pool contract upgrades happen and we need to change contract addresses in the frontend.

To do this we need to change it in the [/src/utils/dictionaries/amm/mainnet.ts](../src/utils/dictionaries/amm/mainnet.ts) (mainnet pool) and / or [/src/utils/dictionaries/amm/testnet.ts](../src/utils/dictionaries/amm/testnet.ts) files.

Open pools array file for network you need to upgrade and find pool you would you need:

```typescript
new AmmLiquidityPool(
  Asset.MOC,
  Asset.RBTC,
  1,
  AppMode.MAINNET,
  '0x34031D1cd14e2C80B0268B47eFf49643375aFaeb', // add new converter address there
  '0x7Fef930ebaA90B2f8619722adc55e3f1D965B79b',
).setPreviousConverters([
  '0x34031D1cd14e2C80B0268B47eFf49643375aFaee',
  '0x34031D1cd14e2C80B0268B47eFf49643375aFaed', // put old converter address at the end of this array
]);
```

To upgrade you will need to copy old `converter` address and put it to the end of the array in `.setPreviousConverters([])` and then add new `converter` address to `AmmLiquidityPool`'s `converter` property.

Moving old converters to `setPreviousConverters` ensures that users will not loose their deposit, withdrawal and swapping history.
