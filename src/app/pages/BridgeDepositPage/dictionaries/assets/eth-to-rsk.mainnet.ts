import sovIcon from './icons/sov.svg';
import dllrIcon from './icons/dllr.svg';
import ethIcon from './icons/eth.svg';
import usdtIcon from './icons/usdt.svg';
import usdcIcon from './icons/usdc.svg';
import daiIcon from './icons/dai.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';

export const xusdAggregatorRSK = '0x1440d19436bEeaF8517896bffB957a88EC95a00F';
export const ethsAggregatorRSK = '0x4bF113905d7F69202106f613308bb02c84aaDF2F';

const ethToRskAssets = [
  new AssetModel(
    CrossBridgeAsset.ESOV,
    'eSOV',
    sovIcon,
    18,
    4,
    '0xbdab72602e9ad40fc6a6852caf43258113b8f7a5',
    false,
    CrossBridgeAsset.SOV,
    false,
  ),
  new AssetModel(
    CrossBridgeAsset.EDLLR,
    'eDLLR',
    dllrIcon,
    18,
    4,
    '0xbdbb63f938c8961af31ead3deba5c96e6a323dd1',
    false,
    CrossBridgeAsset.DLLR,
    false,
  ),
  new AssetModel(
    CrossBridgeAsset.ETH,
    'ETH',
    ethIcon,
    18,
    4,
    '0xd412acd34a832a09c80c8a4895ff46d733f09538',
    true,
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
    6,
    4,
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
    6,
    4,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
];

export default ethToRskAssets;
