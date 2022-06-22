import sovIcon from './icons/sov.svg';
import ethsIcon from './icons/eths.svg';
import xusdIcon from './icons/xusd.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { ethsAggregatorRSK, xusdAggregatorRSK } from './eth-to-rsk.testnet';

const rskToEthTestnetAssets = [
  new AssetModel(
    CrossBridgeAsset.SOV,
    'SOV',
    sovIcon,
    18,
    4,
    '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
    false,
    CrossBridgeAsset.SOV,
    false,
    false,
    undefined,
    undefined,
    [CrossBridgeAsset.ESOV],
  ),
  new AssetModel(
    CrossBridgeAsset.ETHS,
    'ETHs',
    ethsIcon,
    18,
    4,
    '0x0fd0D8D78CE9299eE0e5676A8D51f938c234162c',
    false,
    CrossBridgeAsset.ETHS,
    true,
    false,
    ethsAggregatorRSK,
    '0x4F2Fc8d55c1888A5AcA2503e2F3E5d74eef37C33',
    [CrossBridgeAsset.ETH],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.ETH, '0x4F2Fc8d55c1888A5AcA2503e2F3E5d74eef37C33'],
    ]),
  ),
  new AssetModel(
    CrossBridgeAsset.XUSD,
    'XUSD',
    xusdIcon,
    18,
    4,
    '0xa9262CC3fB54Ea55B1B0af00EfCa9416B8d59570',
    false,
    CrossBridgeAsset.XUSD,
    true,
    false,
    xusdAggregatorRSK,
    '0x10C5A7930fC417e728574E334b1488b7895c4B81', // USDTes
    [CrossBridgeAsset.USDT, CrossBridgeAsset.USDC, CrossBridgeAsset.DAI],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.USDT, '0x10C5A7930fC417e728574E334b1488b7895c4B81'],
      [CrossBridgeAsset.USDC, '0xcc8Eec21ae75F1A2dE4aC7b32A7de888a45cF859'],
      [CrossBridgeAsset.DAI, '0xcb92C8D49Ec01b92F2A766C7c3C9C501C45271E0'],
    ]),
  ),
];

export default rskToEthTestnetAssets;
