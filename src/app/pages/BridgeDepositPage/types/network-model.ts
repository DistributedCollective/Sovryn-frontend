import type { AppMode, Chain, ChainId } from 'types';
import type { CrossBridgeAsset } from './cross-bridge-asset';

export class NetworkModel {
  constructor(
    public readonly chain: Chain,
    public readonly chainId: ChainId,
    public readonly name: string,
    public readonly coin: CrossBridgeAsset,
    public readonly logo: string,
    public readonly rpc: string,
    public readonly explorer: string,
    public readonly mode: AppMode,
    public readonly multicallContractAddress: string,
  ) {}
}
