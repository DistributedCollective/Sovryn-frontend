import sovIcon from './icons/sov.svg';
import ethsIcon from './icons/eths.svg';
import xusdIcon from './icons/xusd.svg';
import dllrIcon from './icons/dllr.svg';
import { AssetModel } from '../../types/asset-model';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { ethsAggregatorRSK, xusdAggregatorRSK } from './eth-to-rsk.mainnet';

const rskToEthAssets = [
  new AssetModel(
    CrossBridgeAsset.SOV,
    'SOV',
    sovIcon,
    18,
    4,
    '0xEfC78FC7D48B64958315949279bA181C2114abbD',
    false,
    CrossBridgeAsset.SOV,
    false,
    false,
    undefined,
    undefined,
    [CrossBridgeAsset.ESOV],
  ),
  new AssetModel(
    CrossBridgeAsset.DLLR,
    'DLLR',
    dllrIcon,
    18,
    4,
    '0xEfC78FC7D48B64958315949279bA181C2114abbD',
    false,
    CrossBridgeAsset.DLLR,
    false,
    false,
    undefined,
    undefined,
    [CrossBridgeAsset.EDLLR],
  ),
  new AssetModel(
    CrossBridgeAsset.ETHS,
    'ETHs',
    ethsIcon,
    18,
    4,
    '0x1D931Bf8656d795E50eF6D639562C5bD8Ac2B78f',
    false,
    CrossBridgeAsset.ETHS,
    true,
    false,
    ethsAggregatorRSK,
    '0xFe878227c8F334038DAb20a99fC3B373fFe0a755',
    [CrossBridgeAsset.ETH],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.ETH, '0xFe878227c8F334038DAb20a99fC3B373fFe0a755'],
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
    '0xD9665EA8F5fF70Cf97E1b1Cd1B4Cd0317b0976e8', // USDTes
    [CrossBridgeAsset.USDT, CrossBridgeAsset.USDC, CrossBridgeAsset.DAI],
    new Map<CrossBridgeAsset, string>([
      [CrossBridgeAsset.USDT, '0xD9665EA8F5fF70Cf97E1b1Cd1B4Cd0317b0976e8'],
      [CrossBridgeAsset.USDC, '0x8D1f7CbC6391D95E2774380e80A666FEbf655D6b'],
      [CrossBridgeAsset.DAI, '0x1A37c482465e78E6DAbE1Ec77B9a24D4236D2A11'],
    ]),
  ),
];

export default rskToEthAssets;
