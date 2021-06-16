import { bignumber } from 'mathjs';
import { roundToSmaller } from 'utils/blockchain/math-helpers';
import { CrossBridgeAsset } from './cross-bridge-asset';

export class AssetModel {
  public readonly bridgeTokenAddress: string;
  public readonly aggregatedTokens: CrossBridgeAsset[] = [];
  public readonly bridgeTokenAddresses: Map<CrossBridgeAsset, string> = new Map<
    CrossBridgeAsset,
    string
  >();
  constructor(
    public readonly asset: CrossBridgeAsset,
    public readonly symbol: string,
    public readonly image: string,
    public readonly decimals: number,
    public readonly minDecimals: number,
    public readonly tokenContractAddress: string,
    public readonly isNative: boolean,
    public readonly group: CrossBridgeAsset,
    public readonly usesAggregator: boolean = false,
    public readonly aggregatorMints: boolean = false,
    public readonly aggregatorContractAddress?: string,
    _bridgeTokenAddress?: string,
    _aggregatedTokens?: CrossBridgeAsset[],
    _bridgeTokenAddresses?: Map<CrossBridgeAsset, string>,
  ) {
    this.tokenContractAddress = tokenContractAddress.toLowerCase();
    this.aggregatorContractAddress = aggregatorContractAddress?.toLowerCase();
    this.bridgeTokenAddress =
      _bridgeTokenAddress?.toLowerCase() || this.tokenContractAddress;
    if (_aggregatedTokens !== undefined) {
      this.aggregatedTokens = _aggregatedTokens;
    }
    if (_bridgeTokenAddresses !== undefined) {
      this.bridgeTokenAddresses = _bridgeTokenAddresses;
    }
  }

  public toWei(amount: string): string {
    return roundToSmaller(bignumber(amount || '0').mul(10 ** this.decimals), 0);
  }

  public fromWei(amount: string, decimals?: number): string {
    return roundToSmaller(
      bignumber(amount || '0').div(10 ** this.decimals),
      decimals !== undefined ? decimals : this.decimals,
    );
  }
}
