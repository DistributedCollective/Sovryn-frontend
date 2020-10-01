/**
 * Do not import this file directly.
 * Import app-contracts.ts (appContracts) instead.
 */

import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import tokenAbi from './abi/abiTestToken.json';
import LoanTokenABI from './abi/abiLoanToken.json';
import TestTokenABI from './abi/abiTestToken.json';
import abiTestWBRTCToken from './abi/abiTestWBRTCToken.json';
import LoanTokenLogicWrbtc from './abi/LoanTokenLogicWrbtc.json';

export const contracts = {
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
  BTC_token: {
    address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
    abi: abiTestWBRTCToken,
  },
  BTC_lending: {
    address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B',
    abi: LoanTokenLogicWrbtc,
  },
  BTC_poolToken: {
    address: '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111',
    abi: tokenAbi,
  },
  DOC_token: {
    address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
    abi: TestTokenABI,
  },
  DOC_lending: {
    address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
    abi: LoanTokenABI,
  },
  DOC_poolToken: {
    address: '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
    abi: tokenAbi,
  },
};
