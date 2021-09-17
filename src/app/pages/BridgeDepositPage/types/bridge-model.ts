import type { AppMode, Chain, ChainId } from 'types';
import { AssetModel } from './asset-model';
import { CrossBridgeAsset } from './cross-bridge-asset';

export class BridgeModel {
  constructor(
    public readonly chain: Chain,
    public readonly mainChainId: ChainId,
    public readonly sideChainId: ChainId,
    public readonly bridgeContractAddress: string,
    public readonly allowTokensContractAddress: string,
    public readonly assets: AssetModel[],
    public readonly mode: AppMode,
  ) {
    this.bridgeContractAddress = bridgeContractAddress.toLowerCase();
  }

  public getAsset(asset: CrossBridgeAsset) {
    return this.assets.find(item => item.asset === asset);
  }

  public getAssetFromGroup(asset: CrossBridgeAsset) {
    return this.assets.find(item => item.group === asset);
  }
}
