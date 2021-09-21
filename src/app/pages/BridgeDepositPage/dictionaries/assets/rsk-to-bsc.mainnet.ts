// import sovIcon from './icons/sov.svg';
import ethsIcon from './icons/eths.svg';
import xusdIcon from './icons/xusd.svg';
import bnbsIcon from './icons/bnbs.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';

import { ethsAggregatorRSK, xusdAggregatorRSK } from './eth-to-rsk.mainnet';
import { bnbsAggregatorRSK } from './bsc-to-rsk.mainnet';

const rskToBscAssets = [
  // new AssetModel(
  //   CrossBridgeAsset.SOV,
  //   'SOV',
  //   sovIcon,
  //   18,
  //   4,
  //   '0xEfC78FC7D48B64958315949279bA181C2114abbD',
  //   false,
  //   CrossBridgeAsset.SOV,
  //   false,
  //   false,
  //   undefined,
  //   undefined,
  //   [CrossBridgeAsset.BSOV],
  // ),
  new AssetModel(
    CrossBridgeAsset.BNBS,
    'BNBs',
    bnbsIcon,
    18,
    4,
    '0x6D9659bdF5b1A1dA217f7BbAf7dBAF8190E2e71B',
    false,
    CrossBridgeAsset.BNBS,
    true,
    false,
    bnbsAggregatorRSK,
    '0xd2a826b78200c8434b957913ce4067e6e3169385',
    [CrossBridgeAsset.BNB],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.BNB, '0xd2a826b78200c8434b957913ce4067e6e3169385'],
    ]),
  ),
  new AssetModel(
    CrossBridgeAsset.ETHS,
    'ETHs',
    ethsIcon,
    18,
    4,
    '0x1D931BF8656D795e50Ef6d639562C5bD8AC2b78F',
    false,
    CrossBridgeAsset.ETHS,
    true,
    false,
    ethsAggregatorRSK,
    '0x30d1B36924c2c0CD1c03EC257D7FFf31bD8c3007',
    [CrossBridgeAsset.ETH],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.ETH, '0x30d1B36924c2c0CD1c03EC257D7FFf31bD8c3007'],
    ]),
  ),
  new AssetModel(
    CrossBridgeAsset.XUSD,
    'XUSD',
    xusdIcon,
    18,
    4,
    '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
    false,
    CrossBridgeAsset.XUSD,
    true,
    false,
    xusdAggregatorRSK,
    '0xFf4299bCA0313C20A61dc5eD597739743BEf3f6d', // bsUSDT
    [
      CrossBridgeAsset.USDT,
      CrossBridgeAsset.USDC,
      CrossBridgeAsset.DAI,
      CrossBridgeAsset.BUSD,
    ],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.USDT, '0xFf4299bCA0313C20A61dc5eD597739743BEf3f6d'],
      [CrossBridgeAsset.USDC, '0x91EDceE9567cd5612c9DEDeaAE24D5e574820af1'],
      [CrossBridgeAsset.DAI, '0x6A42Ff12215a90f50866A5cE43A9c9C870116e76'],
      [CrossBridgeAsset.BUSD, '0x61e9604e31a736129d7f5C58964c75935b2d80D6'],
    ]),
  ),
];

export default rskToBscAssets;
