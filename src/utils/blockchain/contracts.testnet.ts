/**
 * Do not import this file directly.
 * Use getContract(contractName) helper
 * @example getContract('sovrynProtocol');
 */

import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import RBTCWrapperProxy from './abi/RBTCWrapperProxy.json';
import tokenAbi from './abi/abiTestToken.json';
import TestTokenABI from './abi/abiTestToken.json';
import abiTestWBRTCToken from './abi/abiTestWBRTCToken.json';
import LoanTokenLogicWrbtc from './abi/LoanTokenLogicWrbtc.json';
import LoanTokenLogicStandard from './abi/LoanTokenLogicStandard.json';
import SwapNetworkABI from './abi/SovrynSwapNetwork.json';
import ConverterRegistryABI from './abi/ConverterRegistry.json';

export const contracts = {
  sovrynProtocol: {
    address: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
    abi: bzxAbi,
    blockNumber: 1218686,
  },
  // AMM liquidity protocol
  liquidityProtocol: {
    address: '0x3ED5C55D08F75488736fb4A2e512698E71251cf0',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  liquidityBTCProtocol: {
    address: '0x55684391E3d0Cf69f41c40ddF736BD1C6D3D538c',
    abi: RBTCWrapperProxy,
    blockNumber: 1319117,
  },
  priceFeed: {
    address: '0x7f38c422b99075f63C9c919ECD200DF8d2Cf5BD4',
    abi: priceFeedsAbi,
    blockNumber: 1218689,
  },
  swapNetwork: {
    address: '0x61172B53423E205a399640e5283e51FE60EC2256',
    abi: SwapNetworkABI,
    blockNumber: 1218795,
  },
  converterRegistry: {
    address: '0x7816c4E1b61eE09c25974325cc20B056963423b1',
    abi: ConverterRegistryABI,
    blockNumber: 1218799,
  },
  BTC_token: {
    address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
    abi: abiTestWBRTCToken,
    blockNumber: 1205599,
  },
  BTC_lending: {
    address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B',
    abi: LoanTokenLogicWrbtc,
    blockNumber: 1218742,
  },
  BTC_poolToken: {
    address: '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111',
    abi: tokenAbi,
    blockNumber: 1218844,
  },
  DOC_token: {
    address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
    abi: TestTokenABI,
    blockNumber: 202559,
  },
  DOC_lending: {
    address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
    abi: LoanTokenLogicStandard,
    blockNumber: 1218721,
  },
  DOC_poolToken: {
    address: '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
    abi: tokenAbi,
    blockNumber: 1218844,
  },
  ...(process.env.REACT_APP_WHITELIST_TOKEN &&
    process.env.REACT_APP_WHITELIST === 'true' && {
      whitelistToken: {
        address: process.env.REACT_APP_WHITELIST_TOKEN,
        abi: tokenAbi,
        blockNumber: 1218844,
      },
    }),
};
