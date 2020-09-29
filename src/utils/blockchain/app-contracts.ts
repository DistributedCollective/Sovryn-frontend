import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeeds.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';

export const appContracts = {
  sovrynProtocol: {
    address: '0x217d65Efe40e2d396519C9d094a6Cc87F5B8670b',
    abi: bzxAbi,
    watchEvents: ['Borrow', 'Burn', 'Mint', 'Transfer', 'Approval'],
  },
  // AMM liquidity protocol
  liquidityProtocol: {
    address: '0x2c89d28602D27F1f6acEb3Dfb1f1C8B820191898',
    abi: LiquidityPoolV2Converter,
  },
  priceFeed: {
    address: '0x1afB9aA36Db759A6F08a1f138112B34f359e90b2',
    abi: priceFeedsAbi,
  },
};
