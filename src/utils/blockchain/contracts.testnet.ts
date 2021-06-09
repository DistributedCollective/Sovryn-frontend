/**
 * Do not import this file directly.
 * Use getContract(contractName) helper
 * @example getContract('sovrynProtocol');
 */

import bzxAbi from './abi/bzxAbi.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import LiquidityPoolV1Converter from './abi/LiquidityPoolV1Converter.json';
import LiquidityPoolV2Converter from './abi/LiquidityPoolV2Converter.json';
import RBTCWrapperProxy from './abi/RBTCWrapperProxy.json';
import tokenAbi from './abi/abiTestToken.json';
import TestTokenABI from './abi/abiTestToken.json';
import abiTestWBRTCToken from './abi/abiTestWBRTCToken.json';
import LoanTokenLogicWrbtc from './abi/LoanTokenLogicWrbtc.json';
import LoanTokenLogicStandard from './abi/LoanTokenLogicStandard.json';
import SwapNetworkABI from './abi/SovrynSwapNetwork.json';
import ConverterRegistryABI from './abi/ConverterRegistry.json';
import CrowdSaleAbi from './abi/CrowdSale.json';
import SovrynNFTAbi from './abi/SovrynNFT.json';
import CSOVTokenAbi from './abi/CSOVToken.json';
import VestingAbi from './abi/Vesting.json';
import VestingRegistryAbi from './abi/VestingRegistry.json';
import VestingRegistryOriginAbi from './abi/VestingRegistryOrigin.json';
import StakingAbi from './abi/Staking.json';
import OriginClaimAbi from './abi/OriginInvestorsClaim.json';
import EscrowRewardsAbi from './abi/EscrowRewardsAbi.json';
import LiquidityMiningAbi from './abi/LiquidityMining.json';
import LockedSovAbi from './abi/LockedSOV.json';
import feeSharingProxyAbi from './abi/FeeSharingProxy.json';

export const contracts = {
  sovrynProtocol: {
    address: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
    abi: bzxAbi,
    blockNumber: 1218686,
  },
  BTCWrapperProxy: {
    address: '0x6b1a4735b1E25ccE9406B2d5D7417cE53d1cf90e',
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
  RBTC_token: {
    address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
    abi: abiTestWBRTCToken,
    blockNumber: 1205599,
  },
  RBTC_lending: {
    address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B',
    abi: LoanTokenLogicWrbtc,
    blockNumber: 1218742,
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
  DOC_amm: {
    address: '0x497b0517dd24f66c456e93bc0adbb2a2bf159ec4',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  MOC_token: {
    address: '0x45a97b54021a3f99827641afe1bfae574431e6ab',
    abi: TestTokenABI,
    blockNumber: 202559,
  },
  MOC_lending: {
    address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
    abi: LoanTokenLogicStandard,
    blockNumber: 1218721,
  },
  MOC_amm: {
    address: '0xc137aD4Ef759D9206b15105532c05c866cc89f31',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
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
  USDT_amm: {
    address: '0x133eBE9c8bA524C9B1B601E794dF527f390729bF',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  XUSD_token: {
    address: '0x849D38abD3962cb40d4887E4279ad0e4E5958e34',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  // XUSD_lending: {
  //   address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1406290,
  // },
  XUSD_amm: {
    address: '0xD449c0c468Cae235d3E320Ff48d05EbDdcde64c3',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  BPRO_token: {
    address: '0x4dA7997A819bb46B6758b9102234c289Dd2ad3bf',
    abi: TestTokenABI,
    blockNumber: 202562,
  },
  BPRO_lending: {
    address: '0x6226b4B3F29Ecb5f9EEC3eC3391488173418dD5d',
    abi: LoanTokenLogicStandard,
    blockNumber: 1218721,
  },
  BPRO_amm: {
    address: '0xe4E467D8B5f61b5C83048d857210678eB86730A4',
    abi: LiquidityPoolV2Converter,
    blockNumber: 1218833,
  },
  ETH_token: {
    address: '0x0Fd0d8D78Ce9299Ee0e5676a8d51F938C234162c',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  ETH_lending: {
    address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
    abi: LoanTokenLogicStandard,
    blockNumber: 1406290,
  },
  ETH_amm: {
    address: '0xC8717501Bb0c6640069fcD8BF0DD13904F861abE',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  CrowdSale: {
    address: '0x62BDB11190f538274bD55A4DC74fA4665e7CB752',
    abi: CrowdSaleAbi,
    blockNumber: 1218833,
  },
  SovrynNFTCommunity: {
    address: '0xC5452Dbb2E3956C1161cB9C2d6DB53C2b60E7805',
    abi: SovrynNFTAbi,
    blockNumber: 1218834,
  },
  SovrynNFTHero: {
    address: '0x420fECFda0975c49Fd0026f076B302064ED9C6Ff',
    abi: SovrynNFTAbi,
    blockNumber: 1218835,
  },
  SovrynNFTSuperhero: {
    address: '0x78c0D49d003bf0A88EA6dF729B7a2AD133B9Ae25',
    abi: SovrynNFTAbi,
    blockNumber: 1218836,
  },
  SovrynNFTBday: {
    address: '0x8ffB12De9e7602843e4792DB0bC2863e9d137d06',
    abi: SovrynNFTAbi,
    blockNumber: 1218836,
  },
  vesting: {
    address: '0x80ec7ADd6CC1003BBEa89527ce93722e1DaD5c2a',
    abi: VestingAbi,
    blockNumber: 1218836,
  },
  vestingRegistry: {
    address: '0x80ec7ADd6CC1003BBEa89527ce93722e1DaD5c2a',
    abi: VestingRegistryAbi,
    blockNumber: 1218836,
  },
  vestingRegistryOrigin: {
    address: '0x310006E356b0818C3Eaf86a9B2f13013d4691a1c',
    abi: VestingRegistryOriginAbi,
    blockNumber: 1218836,
  },
  vestingRegistryLM: {
    address: '0x52E4419b9D33C6e0ceb2e7c01D3aA1a04b21668C',
    abi: VestingRegistryOriginAbi,
    blockNumber: 1218836,
  },
  vestingRegistry3: {
    address: '0x52E4419b9D33C6e0ceb2e7c01D3aA1a04b21668C',
    abi: VestingRegistryAbi,
  },
  staking: {
    address: '0xc37A85e35d7eECC82c4544dcba84CF7E61e1F1a3',
    abi: StakingAbi,
    blockNumber: 1218836,
  },
  CSOV_token: {
    address: '0x75bbf7f4d77777730eE35b94881B898113a93124',
    abi: CSOVTokenAbi,
    blockNumber: 1218833,
  },
  CSOV2_token: {
    address: '0x1dA260149ffee6fD4443590ee58F65b8dC2106B9',
    abi: CSOVTokenAbi,
    blockNumber: 1218833,
  },
  OriginInvestorsClaim: {
    address: '0xfc6594B5f59027228cfBe007C2fD52f2e6c6915C',
    abi: OriginClaimAbi,
  },
  SOV_token: {
    address: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
    abi: tokenAbi,
    blockNumber: 1606431,
  },
  SOV_amm: {
    address: '0x38729759415b27F70D5ca91CE357c45214B95Cf4',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  // SOV_lending: {
  //   address: '0x09c5faf7723b13434abdf1a65ab1b667bc02a902', // todo
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1218742,
  // },
  NFT_tier1: {
    address: '0xC5452Dbb2E3956C1161cB9C2d6DB53C2b60E7805',
    abi: tokenAbi,
  },
  escrowRewards: {
    address: '0x8205153fA1492DFA191395bEABA3a210FeDf5A60',
    abi: EscrowRewardsAbi,
  },
  liquidityMiningProxy: {
    address: '0xe28aEbA913c34EC8F10DF0D9C92D2Aa27545870e',
    abi: LiquidityMiningAbi,
  },
  lockedSov: {
    address: '0x6b94Da2d05039173d017359553D685Acfbaa782F',
    abi: LockedSovAbi,
  },
  feeSharingProxy: {
    address: '0x740E6f892C0132D659Abcd2B6146D237A4B6b653',
    abi: feeSharingProxyAbi,
  },
};
