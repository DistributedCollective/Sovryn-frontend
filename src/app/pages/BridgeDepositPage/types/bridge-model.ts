import type { AppMode, Chain, ChainId } from 'types';
import { bridgeNetwork } from '../utils/bridge-network';
import { AssetModel } from './asset-model';
import { CrossBridgeAsset } from './cross-bridge-asset';

export class BridgeModel {
  private _allowTokensContractAddress: string | undefined;
  constructor(
    public readonly chain: Chain,
    public readonly mainChainId: ChainId,
    public readonly sideChainId: ChainId,
    public readonly bridgeContractAddress: string,
    private _defaultAllowTokensContractAddress: string,
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

  public getAllowTokensContractAddress(): Promise<string> {
    if (this._allowTokensContractAddress) {
      return Promise.resolve(this._allowTokensContractAddress);
    }
    return bridgeNetwork
      .call(
        this.chain,
        this.bridgeContractAddress,
        [
          {
            constant: true,
            inputs: [],
            name: 'allowTokens',
            outputs: [
              {
                name: '',
                type: 'address',
              },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
        ],
        'allowTokens',
        [],
      )
      .then(result => {
        this._allowTokensContractAddress = result.toLowerCase();
        return this._allowTokensContractAddress as string;
      })
      .catch(() => this._defaultAllowTokensContractAddress);
  }
}
