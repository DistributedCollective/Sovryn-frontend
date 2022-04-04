import { AppMode, Chain, ChainId } from 'types';
import { NetworkModel } from '../types/network-model';
import { CrossBridgeAsset } from '../types/cross-bridge-asset';
import { currentNetwork } from '../../../../utils/classifiers';

import rskLogo from './bridges/icons/rsk.svg';

import bscIcon from 'assets/images/networks/bsc.svg';
import ethIcon from 'assets/images/networks/eth.svg';

export class BridgeNetworkDictionary {
  public static readonly networks = [
    new NetworkModel(
      Chain.RSK,
      ChainId.RSK_MAINNET,
      'RSK',
      CrossBridgeAsset.RBTC,
      rskLogo,
      'https://mainnet.sovryn.app/rpc',
      'https://explorer.rsk.co',
      AppMode.MAINNET,
      '0x6c62bf5440de2cb157205b15c424bceb5c3368f5',
    ),
    new NetworkModel(
      Chain.RSK,
      ChainId.RSK_TESTNET,
      'RSK Testnet',
      CrossBridgeAsset.RBTC,
      rskLogo,
      'https://testnet.sovryn.app/rpc',
      'https://explorer.testnet.rsk.co',
      AppMode.TESTNET,
      '0x9e469e1fc7fb4c5d17897b68eaf1afc9df39f103',
    ),
    new NetworkModel(
      Chain.ETH,
      ChainId.ETH_MAINNET,
      'Ethereum',
      CrossBridgeAsset.ETH,
      ethIcon,
      'https://cloudflare-eth.com',
      'https://etherscan.io',
      AppMode.MAINNET,
      '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    ),
    new NetworkModel(
      Chain.ETH,
      ChainId.ETH_TESTNET,
      'Ropsten',
      CrossBridgeAsset.ETH,
      ethIcon,
      `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
      'https://ropsten.etherscan.io',
      AppMode.TESTNET,
      '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    ),
    new NetworkModel(
      Chain.BSC,
      ChainId.BSC_MAINNET,
      'Binance Smart Chain',
      CrossBridgeAsset.BNB,
      bscIcon,
      'https://bsc-dataseed.binance.org',
      'https://bscscan.com',
      AppMode.MAINNET,
      '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
    ),
    new NetworkModel(
      Chain.BSC,
      ChainId.BSC_TESTNET,
      'Binance Smart Testnet',
      CrossBridgeAsset.BNB,
      bscIcon,
      'https://data-seed-prebsc-2-s3.binance.org:8545',
      'https://testnet.bscscan.com',
      AppMode.TESTNET,
      '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
    ),
  ];

  public static get(chain: Chain, mode: AppMode | string = currentNetwork) {
    return this.networks.find(
      item => item.chain === chain && item.mode === mode,
    );
  }

  public static getByChainId(chainId: ChainId) {
    return this.networks.find(item => item.chainId === chainId);
  }
}
