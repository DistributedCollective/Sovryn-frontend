// import sovIcon from './icons/sov.svg';
import bnbIcon from './icons/bnb.svg';
import ethIcon from './icons/eth.svg';
import usdtIcon from './icons/usdt.svg';
import usdcIcon from './icons/usdc.svg';
import daiIcon from './icons/dai.svg';
import busdIcon from './icons/busd.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { ethsAggregatorRSK, xusdAggregatorRSK } from './eth-to-rsk.testnet';

export const bnbsAggregatorRSK = '0x790C4451c2e8e4cDC50cEdEC22756DaC993e93eb';

const bscToRskTestnetAssets = [
  // new AssetModel(
  //   CrossBridgeAsset.BSOV,
  //   'bSOV',
  //   sovIcon,
  //   18,
  //   4,
  //   '0x6b8daa42b8ac9a0d826981a9990248bef60e2d4c',
  //   false,
  //   CrossBridgeAsset.SOV,
  //   false,
  // ),
  new AssetModel(
    CrossBridgeAsset.BNB,
    'BNB',
    bnbIcon,
    18,
    4,
    '0x68bD35422b457f315AA176743325a9F7C9830c68',
    true,
    CrossBridgeAsset.BNBS,
    true,
    true,
    bnbsAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.BNBS],
  ),
  new AssetModel(
    CrossBridgeAsset.BUSD,
    'BUSD',
    busdIcon,
    18,
    4,
    '0x137BEc8c83740920ebc4f29f51C7B65b75Beec83',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
  new AssetModel(
    CrossBridgeAsset.ETH,
    'ETH',
    ethIcon,
    18,
    4,
    '0x7d1FE4FdB0Afaf26ada5083A688139EbA10d3e1B',
    false,
    CrossBridgeAsset.ETHS,
    true,
    true,
    ethsAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.ETHS],
  ),
  new AssetModel(
    CrossBridgeAsset.USDT,
    'USDT',
    usdtIcon,
    18,
    4,
    '0x268e3bf855cbcdf8fe31ba3557a554ab2283351f',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
  new AssetModel(
    CrossBridgeAsset.USDC,
    'USDC',
    usdcIcon,
    18,
    4,
    '0x0b654c687dc8b828139406c070e0a34486e5072b',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
  new AssetModel(
    CrossBridgeAsset.DAI,
    'DAI',
    daiIcon,
    18,
    4,
    '0x83241490517384cb28382bdd4d1534ee54d9350f',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
];

export default bscToRskTestnetAssets;
