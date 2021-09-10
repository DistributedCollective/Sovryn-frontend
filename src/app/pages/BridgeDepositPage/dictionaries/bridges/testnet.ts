import { AppMode, Chain, ChainId } from 'types';
import { BridgeModel } from '../../types/bridge-model';

import ethToRskAssets from '../assets/eth-to-rsk.testnet';
import bscToRskAssets from '../assets/bsc-to-rsk.testnet';
import rskToEthAssets from '../assets/rsk-to-eth.testnet';
import rskToBscAssets from '../assets/rsk-to-bsc.testnet';

const testnetBridges = [
  // RSK/BSC
  new BridgeModel(
    Chain.RSK,
    ChainId.RSK_TESTNET,
    ChainId.BSC_TESTNET,
    '0x2b2bcad081fa773dc655361d1bb30577caa556f8',
    '0xa9f2ccb27fe01479a1f21f3a236989c614f801bc',
    rskToBscAssets,
    AppMode.TESTNET,
  ),
  new BridgeModel(
    Chain.BSC,
    ChainId.BSC_TESTNET,
    ChainId.RSK_TESTNET,
    '0x862e8aff917319594cc7faaae5350d21196c086f',
    '0xeb23e848ceca88b7d0c019c7186bb86cefadd0bd',
    bscToRskAssets,
    AppMode.TESTNET,
  ),
  // RSK-ETH testnet bridges
  new BridgeModel(
    Chain.RSK,
    ChainId.RSK_TESTNET,
    ChainId.ETH_TESTNET,
    '0xC0E7A7FfF4aBa5e7286D5d67dD016B719DCc9156',
    '0x918b9fd8c2e9cf5625ea00ca6cfa270a44050d01',
    rskToEthAssets,
    AppMode.TESTNET,
  ),
  new BridgeModel(
    Chain.ETH,
    ChainId.ETH_TESTNET,
    ChainId.RSK_TESTNET,
    '0x2b456e230225C4670FBF10b9dA506C019a24cAC7',
    '0x9bc4243880730a9Bca69addB0f971700d39D1646',
    ethToRskAssets,
    AppMode.TESTNET,
  ),
];

export default testnetBridges;
