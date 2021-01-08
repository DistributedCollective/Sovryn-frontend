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
import CrowdSaleAbi from './abi/CrowdSale.json';
import CSOVTokenAbi from './abi/CSOVToken.json';

export const contracts = {
  sovrynProtocol: {
    address: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    abi: bzxAbi,
    blockNumber: 2742418,
  },
  BTCWrapperProxy: {
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
  DOC_amm: {
    address: '0xd715192612F03D20BaE53a5054aF530C9Bb0fA3f',
    abi: LiquidityPoolV2Converter,
    blockNumber: 2742633,
  },
  USDT_token: {
    address: '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  USDT_lending: {
    address: '0x849C47f9C259E9D62F289BF1b2729039698D8387',
    abi: LoanTokenLogicStandard,
    blockNumber: 1406290,
  },
  USDT_amm: {
    address: '0x448c2474b255576554EeD36c24430ccFac131cE3',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  BPRO_token: {
    address: '0x440cd83c160de5c96ddb20246815ea44c7abbca8',
    abi: TestTokenABI,
    blockNumber: 1764667,
  },
  BPRO_lending: {
    address: '0x6E2fb26a60dA535732F8149b25018C9c0823a715',
    abi: LoanTokenLogicStandard,
    blockNumber: 1218721,
  },
  BPRO_amm: {
    address: '0x26463990196B74aD5644865E4d4567E4A411e065',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  CrowdSale: {
    address: '0x2c24C2b3cB859f904F482b84eBB5B4B2a37C727D',
    abi: CrowdSaleAbi,
    blockNumber: 1218833,
  },
  CSOVToken: {
    address: '0xE7cfaebeE5f447b25BDdAdCf0B8b246cc7c2361a',
    abi: CSOVTokenAbi,
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
