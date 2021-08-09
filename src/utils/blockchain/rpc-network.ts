import { RpcNode } from './rpc-node';
import { ChainId } from '../../types';
import { currentChainId } from 'utils/classifiers';
import { BridgeNetworkDictionary } from '../../app/pages/BridgeDepositPage/dictionaries/bridge-network-dictionary';

export class RpcNetwork {
  private static networks: Map<ChainId, RpcNode> = new Map<ChainId, RpcNode>();

  public static create(chainId: number, rpc: string) {
    this.networks.set(chainId, new RpcNode(rpc));
    return this.networks.get(chainId) as RpcNode;
  }

  public static get(chainId: ChainId) {
    if (!this.networks.has(chainId)) {
      const chain = BridgeNetworkDictionary.getByChainId(chainId);
      if (!chain)
        throw new Error(`Chain ${chainId} doesn't exist in our dictionary!`);
      if (!chain.rpc)
        throw new Error(`Chain ${chainId} has no RPC node provided!`);
      this.create(chainId, chain.rpc);
    }

    return this.networks.get(chainId) as RpcNode;
  }

  public static default() {
    return this.get(currentChainId);
  }
}
