/**
 * Do not import this file directly.
 * Use getContract(contractName) helper
 * @example getContract('sovrynProtocol');
 */

import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import tokenAbi from './abi/abiTestToken.json';
import abiTestWBRTCToken from './abi/abiTestWBRTCToken.json';
import LoanTokenLogicWrbtc from './abi/LoanTokenLogicWrbtc.json';
import LoanTokenLogicStandard from './abi/LoanTokenLogicStandard.json';
import TestTokenABI from './abi/abiTestToken.json';
import SwapNetworkABI from './abi/SovrynSwapNetwork.json';
import ConverterRegistryABI from './abi/ConverterRegistry.json';
import RBTCWrapperProxy from './abi/RBTCWrapperProxy.json';

export const contracts = {
  sovrynProtocol: {
    address: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    abi: bzxAbi,
    blockNumber: 2742418,
  },
  // AMM liquidity protocol
  liquidityProtocol: {
    address: '0xd715192612F03D20BaE53a5054aF530C9Bb0fA3f',
    abi: LiquidityPoolV2Converter,
    blockNumber: 2742633,
  },
  liquidityBTCProtocol: {
    address: '0x78E7e79F1acc1f57a3291d5BfA8436A0771C1800',
    abi: RBTCWrapperProxy,
    blockNumber: 2838500,
  },
  priceFeed: {
    address: '0x437AC62769f386b2d238409B7f0a7596d36506e4',
    abi: priceFeedsAbi,
    blockNumber: 2742435,
  },
  swapNetwork: {
    address: '0x98aCE08D2b759a265ae326F010496bcD63C15afc',
    abi: SwapNetworkABI,
    blockNumber: 2742574,
  },
  converterRegistry: {
    address: '0x31A0F8400c75d52FdB413372233F28E3bdFB1c06',
    abi: ConverterRegistryABI,
    blockNumber: 2742580,
  },
  BTC_token: {
    address: '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d',
    abi: abiTestWBRTCToken,
    blockNumber: 2742415,
  },
  BTC_lending: {
    address: '0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A',
    abi: LoanTokenLogicWrbtc,
    blockNumber: 2742496,
  },
  BTC_poolToken: {
    address: '0x840437bDe7346EC13b5451417DF50586f4DAf836',
    abi: tokenAbi,
    blockNumber: 2742648,
  },
  DOC_token: {
    address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
    abi: TestTokenABI,
    blockNumber: 1764664,
  },
  DOC_lending: {
    address: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    abi: LoanTokenLogicStandard,
    blockNumber: 2742476,
  },
  DOC_poolToken: {
    address: '0x2dC80332C19Fbcd5169aB4A579D87EE006cb72c0',
    abi: tokenAbi,
    blockNumber: 2742648,
  },
  // start non-mainnet yet //
  USDT_token: {
    address: '0x4D5a316D23eBE168d8f887b4447bf8DbFA4901CC',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  USDT_lending: {
    address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
    abi: LoanTokenLogicStandard,
    blockNumber: 1406290,
  },
  USDT_poolToken: {
    address: '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
    abi: tokenAbi,
    blockNumber: 1218844,
  },
  USDT_amm: {
    address: '0x133eBE9c8bA524C9B1B601E794dF527f390729bF',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  BPRO_token: {
    address: '0x440cd83C160de5C96DDb20246815EA44C7Abbca8',
    abi: TestTokenABI,
    blockNumber: 1764667,
  },
  BPRO_lending: {
    address: '0x6226b4B3F29Ecb5f9EEC3eC3391488173418dD5d',
    abi: LoanTokenLogicStandard,
    blockNumber: 1218721,
  },
  BPRO_poolToken: {
    address: '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
    abi: tokenAbi,
    blockNumber: 1218844,
  },
  BPRO_amm: {
    address: '0xe4E467D8B5f61b5C83048d857210678eB86730A4',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  // end non-mainnet //
  ...(process.env.REACT_APP_WHITELIST_TOKEN &&
    process.env.REACT_APP_WHITELIST === 'true' && {
      whitelistToken: {
        address: process.env.REACT_APP_WHITELIST_TOKEN,
        abi: tokenAbi,
        blockNumber: 1218844,
      },
    }),
};
