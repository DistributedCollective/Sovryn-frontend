import { AppMode, Chain, ChainId } from 'types';
import { BridgeModel } from '../../types/bridge-model';

import ethToRskAssets from '../assets/eth-to-rsk.mainnet';
import bscToRskAssets from '../assets/bsc-to-rsk.mainnet';
import rskToEthAssets from '../assets/rsk-to-eth.mainnet';
import rskToBscAssets from '../assets/rsk-to-bsc.mainnet';

const mainnetBridges = [
  // RSK / BSC
  new BridgeModel(
    Chain.RSK,
    ChainId.RSK_MAINNET,
    ChainId.BSC_MAINNET,
    '0x971b97c8cc82e7d27bc467c2dc3f219c6ee2e350',
    '0xa2f50a2c699c1aa3b9089f6b565d4999d45d8983',
    rskToBscAssets,
    AppMode.MAINNET,
  ),
  new BridgeModel(
    Chain.BSC,
    ChainId.BSC_MAINNET,
    ChainId.RSK_MAINNET,
    '0xdfc7127593c8af1a17146893f10e08528f4c2aa7',
    '0x05b68e70168e876b2025f837bc8e0b2312d5327d',
    bscToRskAssets,
    AppMode.MAINNET,
  ),

  // RSK / ETH
  new BridgeModel(
    Chain.RSK,
    ChainId.RSK_MAINNET,
    ChainId.ETH_MAINNET,
    '0x1CcAd820B6d031B41C54f1F3dA11c0d48b399581',
    '0x200FD7A1Ccea4651f15008Cc99bf82d7461EFD3f',
    rskToEthAssets,
    AppMode.MAINNET,
  ),
  new BridgeModel(
    Chain.ETH,
    ChainId.ETH_MAINNET,
    ChainId.RSK_MAINNET,
    '0x33C0D33a0d4312562ad622F91d12B0AC47366EE1',
    '0x8DF20c2c85Bee0c3DA250dA96D892598C70aA1bE',
    ethToRskAssets,
    AppMode.MAINNET,
  ),
];

export default mainnetBridges;
