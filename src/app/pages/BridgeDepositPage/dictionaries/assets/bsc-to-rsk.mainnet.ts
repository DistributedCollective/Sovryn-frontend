// import sovIcon from './icons/sov.svg';
import bnbIcon from './icons/bnb.svg';
import ethIcon from './icons/eth.svg';
import usdtIcon from './icons/usdt.svg';
import usdcIcon from './icons/usdc.svg';
import daiIcon from './icons/dai.svg';
import busdIcon from './icons/busd.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { ethsAggregatorRSK, xusdAggregatorRSK } from './eth-to-rsk.mainnet';

export const bnbsAggregatorRSK = '0xafD905Fe2EdBF5A7367A73B0F1e6a62Cb5E27D3e';

const bscToRskAssets = [
  // new AssetModel(
  //   CrossBridgeAsset.BSOV,
  //   'bSOV',
  //   sovIcon,
  //   18,
  //   4,
  //   '0x8753ede1b3a36358e4d7780f384f3f7a2d9e4359',
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
    '0xB6C313a427fa911A4C9a119e80Feea0fe20E69F0',
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
    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
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
    '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
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
    '0x55d398326f99059ff775485246999027b3197955',
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
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
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
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    false,
    CrossBridgeAsset.XUSD,
    true,
    true,
    xusdAggregatorRSK,
    undefined, // undefined means same as tokenContractAddress param
    [CrossBridgeAsset.XUSD],
  ),
];

export default bscToRskAssets;
