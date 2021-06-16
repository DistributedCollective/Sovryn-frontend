import { Chain, ChainId } from 'types';
import { BridgeNetworkDictionary } from '../dictionaries/bridge-network-dictionary';

export function getBridgeChainId(chain: Chain): ChainId | null {
  return BridgeNetworkDictionary.get(chain)?.chainId || null;
}

export function getBridgeChain(chainId: ChainId): Chain | null {
  return BridgeNetworkDictionary.getByChainId(chainId)?.chain || null;
}

export function getSupportedBridgeChainIds() {
  return BridgeNetworkDictionary.networks
    .map(item => item.chainId)
    .filter(unique);
}

export function unique(value, index, self) {
  return self.indexOf(value) === index;
}
