import type { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import type { AppMode, Asset } from 'types';
import type { AbiItem } from 'web3-utils';
import LiquidityPoolV1Converter from '../blockchain/abi/LiquidityPoolV1Converter.json';
import LiquidityPoolV2Converter from '../blockchain/abi/LiquidityPoolV2Converter.json';

export type ConverterVersion = 1 | 2;

export class AmmLiquidityPool {
  private _lootDropColor?: LootDropColors | string;
  private _hasSovRewards: boolean = true;
  constructor(
    public readonly assetA: Asset,
    public readonly assetB: Asset,
    public readonly converterVersion: ConverterVersion,
    public readonly network: AppMode,
    public readonly converter: string,
    public readonly poolTokenA: string,
    public readonly poolTokenB?: string,
  ) {
    if (converterVersion === 2 && !poolTokenB) {
      throw new Error(
        `V2 pools must have "poolTokenB" property defined! (${assetA}/${assetB})`,
      );
    }
    if (converterVersion === 1 && poolTokenB) {
      throw new Error(
        `V1 pools does not need to have "poolTokenB" property defined! (${assetA}/${assetB})`,
      );
    }
    this.converter = converter.toLowerCase();
    this.poolTokenA = poolTokenA.toLowerCase();
    if (poolTokenB) {
      this.poolTokenB = poolTokenB.toLowerCase();
    }
  }
  public setLootDropColor(color: LootDropColors | string) {
    this._lootDropColor = color;
    return this;
  }
  public get lootDropColor() {
    return this._lootDropColor;
  }
  public getPoolTokenAddress(asset: Asset) {
    if (asset === this.assetA) {
      return this.poolTokenA;
    }
    if (asset === this.assetB) {
      return this.poolTokenB;
    }
    return undefined;
  }
  public get hasSovRewards() {
    return this._hasSovRewards;
  }
  public setSovRewards(flag: boolean) {
    this._hasSovRewards = flag;
    return this;
  }
  public getPoolTokenAsset(address: string) {
    address = address.toLowerCase();
    if (address === this.poolTokenA) {
      return this.assetA;
    }
    if (address === this.poolTokenB) {
      return this.assetB;
    }
    return undefined;
  }
  public get converterAbi(): AbiItem | AbiItem[] {
    return (this.converterVersion === 1
      ? LiquidityPoolV1Converter
      : LiquidityPoolV2Converter) as AbiItem | AbiItem[];
  }
  public get key() {
    return `${this.assetA}/${this.assetB}`;
  }
}
