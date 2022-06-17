// import sovIcon from './icons/sov.svg';
import ethsIcon from './icons/eths.svg';
import xusdIcon from './icons/xusd.svg';
import bnbsIcon from './icons/bnbs.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';

import { ethsAggregatorRSK, xusdAggregatorRSK } from './eth-to-rsk.testnet';
import { bnbsAggregatorRSK } from './bsc-to-rsk.testnet';

const rskToBscTestnet = [
  // new AssetModel(
  //   CrossBridgeAsset.SOV,
  //   'SOV',
  //   sovIcon,
  //   18,
  //   4,
  //   '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
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
    '0x801F223Def9A4e3a543eAcCEFB79dCE981Fa2Fb5',
    false,
    CrossBridgeAsset.BNBS,
    true,
    false,
    bnbsAggregatorRSK,
    '0xafa6A1eb7E2282E8854822d2bB412b6db2cabA4E',
    [CrossBridgeAsset.BNB],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.BNB, '0xafa6A1eb7E2282E8854822d2bB412b6db2cabA4E'],
    ]),
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
    '0x793CE6F95912D5b43532c2116e1b68993d902272',
    [CrossBridgeAsset.ETH],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.ETH, '0x793CE6F95912D5b43532c2116e1b68993d902272'],
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
    '0x43bc3f0ffff6c9bbf3c2eafe464c314d43f561de', // bsUSDT
    [
      CrossBridgeAsset.USDT,
      CrossBridgeAsset.USDC,
      CrossBridgeAsset.DAI,
      CrossBridgeAsset.BUSD,
    ],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.USDT, '0x43bc3f0ffff6c9bbf3c2eafe464c314d43f561de'],
      [CrossBridgeAsset.USDC, '0x3e2cf87e7ff4048a57f9cdde9368c9f4bfb43adf'],
      [CrossBridgeAsset.DAI, '0x407ff7d4760d3a81b4740d268eb04490c7dfe7f2'],
      [CrossBridgeAsset.BUSD, '0x8c9abb6c9d8d15ddb7ada2e50086e1050ab32688'],
    ]),
  ),
];

export default rskToBscTestnet;
