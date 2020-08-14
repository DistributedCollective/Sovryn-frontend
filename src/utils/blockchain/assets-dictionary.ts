import { Asset } from 'types/asset';
import { AssetDetails } from './asset-details';

import btcIcon from 'assets/images/rBTC-logo.png';
import usdIcon from 'assets/images/dollar-sign.svg';
import LoanTokenABI from './abi/abiLoanToken.json';
import TestTokenABI from './abi/abiTestToken.json';

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>(
    [
      [
        Asset.BTC,
        new AssetDetails(
          Asset.BTC,
          'BTC',
          'Bitcoin',
          18,
          {
            address: '0xE53d858A78D884659BF6955Ea43CBA67c0Ae293F',
            abi: TestTokenABI,
          },
          {
            address: '0xc4F9857B4bb568C10aD68C092D058Fc8d36Ce4b0',
            abi: LoanTokenABI,
          },
          btcIcon,
          { min: 0.01, max: 1 },
        ),
      ],
      [
        Asset.USD,
        new AssetDetails(
          Asset.USD,
          'USD',
          'USD',
          18,
          {
            address: '0xE631653c4Dc6Fb98192b950BA0b598f90FA18B3E',
            abi: TestTokenABI,
          },
          {
            address: '0xC6Aa9E9C18021Db79eDa87a8E58dD3c146A6b1E5',
            abi: LoanTokenABI,
          },
          usdIcon,
          { min: 1, max: 50000 },
        ),
      ],
    ],
  );

  public static get(asset: Asset): AssetDetails {
    return this.assets.get(asset) as AssetDetails;
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
