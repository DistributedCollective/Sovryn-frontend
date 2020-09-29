import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import tokenAbi from './abi/abiTestToken.json';

export const appContracts = {
  sovrynProtocol: {
    address: '0x217d65Efe40e2d396519C9d094a6Cc87F5B8670b',
    abi: bzxAbi,
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
  BTC_poolToken: {
    address: '0x5683AbcBDa5E5EeAcfE38ca4e0B461750052f122',
    abi: tokenAbi,
  },
  DOC_poolToken: {
    address: '0x4160f0a3CC64B0EfFB9695285E934Cfd686a80Bd',
    abi: tokenAbi,
  },
};
