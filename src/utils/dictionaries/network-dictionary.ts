import { NetworkDetails } from '../models/network-details';
import { Chain, ChainId } from '../../types';

export class NetworkDictionary {
  public static readonly networks = [
    // Mainnets
    new NetworkDetails(Chain.RSK, ChainId.RSK_MAINNET, 'RSK', [
      'https://mainnet.sorvyn.app/rpc',
      'https://public-node.rsk.co',
    ]),
    new NetworkDetails(Chain.ETH, ChainId.ETH_MAINNET, 'Ethereum', [
      'https://rpc.eth.sovryn.app',
    ]),
    new NetworkDetails(Chain.BSC, ChainId.BSC_MAINNET, 'Binance Smart Chain', [
      'https://rpc.eth.sovryn.app',
    ]),
    // Testnets
    new NetworkDetails(Chain.RSK, ChainId.RSK_TESTNET, 'RSK', [
      'https://mainnet.sorvyn.app/rpc',
      'https://public-node.rsk.co',
    ]),
    new NetworkDetails(Chain.ETH, ChainId.ETH_TESTNET, 'Ethereum', [
      'https://rpc.eth.sovryn.app',
    ]),
    new NetworkDetails(Chain.BSC, ChainId.BSC_TESTNET, 'Binance Smart Chain', [
      'https://rpc.eth.sovryn.app',
    ]),
  ];
}
