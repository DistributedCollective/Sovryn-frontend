import { Chain, ChainId } from 'types';
import { BridgeNetworkDictionary } from '../dictionaries/bridge-network-dictionary';

export const getBridgeChainId = (chain: Chain): ChainId | null =>
  BridgeNetworkDictionary.get(chain)?.chainId || null;

export const getBridgeChain = (chainId: ChainId): Chain | null =>
  BridgeNetworkDictionary.getByChainId(chainId)?.chain || null;

export const getSupportedBridgeChainIds = () =>
  BridgeNetworkDictionary.networks.map(item => item.chainId).filter(unique);

export const unique = (value, index, self) => self.indexOf(value) === index;
