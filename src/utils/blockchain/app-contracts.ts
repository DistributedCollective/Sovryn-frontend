import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import tokenAbi from './abi/abiTestToken.json';

export const appContracts = {
  sovrynProtocol: {
    address: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
    abi: bzxAbi,
  },
  // AMM liquidity protocol
  liquidityProtocol: {
    address: '0x3ED5C55D08F75488736fb4A2e512698E71251cf0',
    abi: LiquidityPoolV2Converter,
  },
  priceFeed: {
    address: '0x7f38c422b99075f63C9c919ECD200DF8d2Cf5BD4',
    abi: priceFeedsAbi,
  },
  BTC_poolToken: {
    address: '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111',
    abi: tokenAbi,
  },
  DOC_poolToken: {
    address: '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
    abi: tokenAbi,
  },
};
