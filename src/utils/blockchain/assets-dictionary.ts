import { Asset } from 'types/asset';
import { AssetDetails } from './asset-details';
// @ts-ignore
import btcIcon from 'assets/images/rBTC-logo.png';
// @ts-ignore
import usdIcon from 'assets/images/dollar-sign.svg';

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>(
    [
      [
        Asset.BTC,
        new AssetDetails(Asset.BTC, 'BTC', 'Bitcoin', 18, btcIcon, {
          min: 0.01,
          max: 1,
        }).setCollateralAssets([Asset.DOC]),
      ],
      [
        Asset.DOC,
        new AssetDetails(Asset.DOC, 'DoC', 'Dollar on Chain', 18, usdIcon, {
          min: 1,
          max: 50000,
        }).setCollateralAssets([Asset.BTC]),
      ],
    ],
  );

  public static get(asset: Asset): AssetDetails {
    return this.assets.get(asset) as AssetDetails;
  }

  public static getByLoanContractAddress(address: string): AssetDetails {
    return this.list().find(
      item =>
        item.lendingContract.address.toLowerCase() === address.toLowerCase(),
    ) as AssetDetails;
  }

  public static getByTokenContractAddress(address: string): AssetDetails {
    return this.list().find(
      item =>
        item.tokenContract.address.toLowerCase() === address.toLowerCase(),
    ) as AssetDetails;
  }

  public static list(): Array<AssetDetails> {
    return Array.from(this.assets.values());
  }

  public static assetList(): Array<Asset> {
    return Array.from(this.assets.keys());
  }

  public static find(assets: Array<Asset>): Array<AssetDetails> {
    return assets.map(asset => this.get(asset));
  }
}
