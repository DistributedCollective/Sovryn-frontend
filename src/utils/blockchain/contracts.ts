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
import SovrynNFTAbi from './abi/SovrynNFT.json';
import CSOVTokenAbi from './abi/CSOVToken.json';
import VestingAbi from './abi/Vesting.json';
import VestingRegistryAbi from './abi/VestingRegistry.json';
import VestingRegistryOriginAbi from './abi/VestingRegistryOrigin.json';
import StakingAbi from './abi/Staking.json';
import OriginClaimAbi from './abi/OriginInvestorsClaim.json';
import LiquidityPoolV1Converter from './abi/LiquidityPoolV1Converter.json';
import EscrowRewardsAbi from './abi/EscrowRewardsAbi.json';
import LiquidityMiningAbi from './abi/LiquidityMining.json';
import LockedSovAbi from './abi/LockedSOV.json';
import feeSharingProxyAbi from './abi/FeeSharingProxy.json';
import FISHTokenAbi from './abi/FISH.json';
import OriginsBaseAbi from './abi/OriginsBase.json';
import LockedFundAbi from './abi/LockedFund.json';
import BabelfishAggregatorAbi from './abi/BabelfishAggregator.json';
import SwapsExternalAbi from './abi/SwapsExternalAbi.json';
import stakingRewardsProxyAbi from './abi/StakingRewards.json';
import nftAbi from './abi/nftAbi.json';
import MYNTControllerAbi from './abi/MYNTController.json';
import MYNTTokenAbi from './abi/MYNT_token.json';
import MYNTPresaleAbi from './abi/MYNTPresale.json';
import MYNTMarketMakerAbi from './abi/MYNTMarketMaker.json';

export const contracts = {
  sovrynProtocol: {
    address: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    abi: [...bzxAbi, ...SwapsExternalAbi],
    blockNumber: 2742418,
  },
  BTCWrapperProxy: {
    address: '0xa917BF723433d020a15629eba71f6C2a6B38e52d',
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
  RBTC_token: {
    address: '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d',
    abi: abiTestWBRTCToken,
    blockNumber: 2742415,
  },
  WRBTC_token: {
    // keep this after RBTC_token to prevent issues with RBTC tx's being picked up as WRBTC
    address: '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d',
    abi: abiTestWBRTCToken,
    blockNumber: 2742415,
  },
  RBTC_lending: {
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
  RDOC_token: {
    address: '0x2d919f19D4892381d58EdEbEcA66D5642ceF1A1F',
    abi: TestTokenABI,
    blockNumber: 1764664,
  },
  MOC_token: {
    address: '0x9aC7Fe28967b30e3a4E6E03286D715B42B453d10',
    abi: TestTokenABI,
    blockNumber: 202559,
  },
  // MOC_lending: {
  //   address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1218721,
  // },
  MOC_amm: {
    address: '0x60cc333072f16d5f4cb2bc36d6aa1f00381e22c2',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  RIF_token: {
    address: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  // RIF_lending: {
  //   address: '',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1406290,
  // },
  RIF_amm: {
    address: '0xf6377dec9ce79b5bc0576618a5cd3e95f49f9ace',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
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
  XUSD_token: {
    address: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  XUSD_lending: {
    address: '0x8F77ecf69711a4b346f23109c40416BE3dC7f129',
    abi: LoanTokenLogicStandard,
    blockNumber: 1406290,
  },
  XUSD_amm: {
    address: '0x34163bb263ac77e9d6315676a2b9624cfc5ff861',
    abi: LiquidityPoolV1Converter,
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
  ETH_token: {
    address: '0x1D931Bf8656d795E50eF6D639562C5bD8Ac2B78f',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  ETH_lending: {
    address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
    abi: LoanTokenLogicStandard,
    blockNumber: 1406290,
  },
  ETH_amm: {
    address: '0xd8397c1944862b6a9674c85a5496c208dc9417bb',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  BNBS_token: {
    address: '0x6D9659bdF5b1A1dA217f7BbAf7dBAF8190E2e71B',
    abi: TestTokenABI,
    blockNumber: 1408174,
  },
  // BNBS_lending: {
  //   address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
  //   abi: LoanTokenLogicStandard,
  //   blockNumber: 1406290,
  // },
  BNBS_amm: {
    address: '0x150bc1f9f1020255d44385865928aadc6b7ad9f3',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  CrowdSale: {
    address: '0xd42070b07D4EAbb801d76c6929f21749647275Ec',
    abi: CrowdSaleAbi,
    blockNumber: 1218833,
  },
  SovrynNFTCommunity: {
    address: '0x857a62c9c0b6f1211e04275a1f0c5f26fce2021f',
    abi: SovrynNFTAbi,
    blockNumber: 1218834,
  },
  SovrynNFTHero: {
    address: '0x7806d3fedf9c9741041f5d70af5adf326705b03d',
    abi: SovrynNFTAbi,
    blockNumber: 1218835,
  },
  SovrynNFTSuperhero: {
    address: '0xd9bbcd6e0ab105c83e2b5be0bbb9bb90ef963de7',
    abi: SovrynNFTAbi,
    blockNumber: 1218836,
  },
  SovrynNFTBday: {
    address: '0x8ffB12De9e7602843e4792DB0bC2863e9d137d06',
    abi: SovrynNFTAbi,
    blockNumber: 1218836,
  },
  vesting: {
    address: '0x80B036ae59B3e38B573837c01BB1DB95515b7E6B',
    abi: VestingAbi,
    blockNumber: 1218836,
  },
  vestingRegistry: {
    address: '0xe24ABdB7DcaB57F3cbe4cBDDd850D52F143eE920',
    abi: VestingRegistryAbi,
    blockNumber: 1218836,
  },
  vestingRegistry3: {
    address: '0x14F3FE332e21Ef3f5d244C45C8D5fbFcEF2FB5c9',
    abi: VestingRegistryAbi,
  },
  vestingRegistryOrigin: {
    address: '0x0a9bDbf5e104a30fb4c99f6812FB85B60Fd8D372',
    abi: VestingRegistryOriginAbi,
    blockNumber: 1218836,
  },
  vestingRegistryLM: {
    address: '0x14F3FE332e21Ef3f5d244C45C8D5fbFcEF2FB5c9',
    abi: VestingRegistryOriginAbi,
    blockNumber: 1218836,
  },
  staking: {
    address: '0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e',
    abi: StakingAbi,
    blockNumber: 1218836,
  },
  CSOV_token: {
    address: '0x0106F2fFBF6A4f5DEcE323d20E16E2037E732790',
    abi: CSOVTokenAbi,
    blockNumber: 1218833,
  },
  CSOV2_token: {
    address: '0x7f7Dcf9DF951C4A332740e9a125720DA242A34ff',
    abi: CSOVTokenAbi,
    blockNumber: 1218833,
  },
  OriginInvestorsClaim: {
    address: '0xE0f5BF8d0C58d9c8A078DB75A9D379E6CDF3149E',
    abi: OriginClaimAbi,
  },
  SOV_token: {
    address: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
    abi: tokenAbi,
    blockNumber: 3100260,
  },
  SOV_amm: {
    address: '0x88a67a0e79e311fe93c6e2101d55d6d2ae3a7e94',
    abi: LiquidityPoolV1Converter,
    blockNumber: 1218833,
  },
  NFT_tier1: {
    address: '0x857a62c9c0b6f1211e04275a1f0c5f26fce2021f',
    abi: tokenAbi,
  },
  escrowRewards: {
    address: '0x8205153fA1492DFA191395bEABA3a210FeDf5A60',
    abi: EscrowRewardsAbi,
  },
  liquidityMiningProxy: {
    address: '0xf730af26e87D9F55E46A6C447ED2235C385E55e0',
    abi: LiquidityMiningAbi,
  },
  lockedSov: {
    address: '0xB4e4517cA4Edf591Dcafb702999F04f02E57D978',
    abi: LockedSovAbi,
  },
  feeSharingProxy_old: {
    address: '0x12B1B0C67d9A771EB5Db7726d23fdc6848fd93ef',
    abi: feeSharingProxyAbi,
  },
  feeSharingProxy: {
    address: '0x115cAF168c51eD15ec535727F64684D33B7b08D1',
    abi: feeSharingProxyAbi,
  },
  stakingRewards: {
    address: '0x8304FB3614c728B712e94F9D4DF6719fede6517F',
    abi: stakingRewardsProxyAbi,
  },
  FISH_token: {
    address: '0x055A902303746382FBB7D18f6aE0df56eFDc5213',
    abi: FISHTokenAbi,
  },
  FISH_amm: {
    address: '0x832769cc15dbdd6814819988c7a875ec2cb943e8',
    abi: LiquidityPoolV1Converter,
  },
  FISH_staking: {
    address: '0xFd8ea2e5e8591fA791d44731499cDF2e81CD6a41',
    abi: StakingAbi,
  },
  originsBase: {
    address: '0x9FabDA843C611210d7bA48056B75a1e1884522ef',
    abi: OriginsBaseAbi,
  },
  lockedFund: {
    address: '0x704c35Cc2756d600a18C0f2DBbEe5507D4b351E8',
    abi: LockedFundAbi,
  },
  vestingRegistryFISH: {
    address: '0x036ab2DB0a3d1574469a4a7E09887Ed76fB56C41',
    abi: VestingRegistryAbi,
  },
  babelfishAggregator: {
    address: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
    abi: BabelfishAggregatorAbi,
  },
  sovrynNFT: {
    address: '0x576ae218aecfd4cbd2dbe07250b47e26060932b1',
    abi: nftAbi,
  },
  MYNT_ctrl: {
    address: '0xB576658700D32CCE28552349bCD52FaD8173ae32',
    abi: MYNTControllerAbi,
    blockNumber: 3832084,
  },
  MYNT_token: {
    address: '0x2e6B1d146064613E8f521Eb3c6e65070af964EbB',
    abi: MYNTTokenAbi,
    blockNumber: 3832084,
  },
  MYNTPresale: {
    address: '0xC3d646Ab4e1bE05eFb4Afaedf5Ae656Ff5AE4959',
    abi: MYNTPresaleAbi,
  },
  MYNTMarketMaker: {
    address: '0x722935fF8A99D801D802bb3EE528408C11C18656',
    abi: MYNTMarketMakerAbi,
  },
  MYNT_amm: {
    address: '0x25B8D024B39174824424f032423E03dd7dcCF044',
    abi: LiquidityPoolV1Converter,
  },
};
