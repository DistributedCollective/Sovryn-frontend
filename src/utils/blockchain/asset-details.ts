import { Asset } from '../../types/asset';
import { AbiItem } from 'web3-utils';

interface ContractInterface {
  address: string;
  abi: AbiItem | AbiItem[] | any;
}

interface MinMax {
  min: number;
  max: number;
}

export class AssetDetails {
  private _collateralAssets: Asset[] = [];
  constructor(
    public asset: Asset,
    public symbol: string,
    public name: string,
    public decimals: number,
    public tokenContract: ContractInterface,
    public lendingContract: ContractInterface,
    public logoSvg: string,
    public lendingLimits: MinMax,
  ) {}

  public getTokenContractName(): string {
    return this.asset + '_token';
  }

  public getLendingContractName(): string {
    return this.asset + '_lending';
  }

  public getTokenContractAddress(): string {
    return this.tokenContract.address;
  }

  public getLendingContractAddress(): string {
    return this.lendingContract.address;
  }

  public getCollateralAssets() {
    return this._collateralAssets;
  }

  public setCollateralAssets(assets: Asset[]) {
    this._collateralAssets = assets;
    return this;
  }
}
