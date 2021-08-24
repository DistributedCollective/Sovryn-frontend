import { Asset } from 'types/asset';

import docIcon from 'assets/images/tokens/doc.svg';
import usdtIcon from 'assets/images/tokens/usdt.svg';
import xusdIcon from 'assets/images/tokens/xusd.svg';
import rbtcIcon from 'assets/images/tokens/rbtc.png';
import bproIcon from 'assets/images/tokens/bpro.svg';
import sovIcon from 'assets/images/tokens/sov.svg';
import ethIcon from 'assets/images/tokens/eth.svg';
import bnbIcon from 'assets/images/tokens/bnb.svg';
import mocIcon from 'assets/images/tokens/moc.svg';
import fishIcon from 'assets/images/tokens/babelfish.svg';

import { AssetDetails } from '../models/asset-details';

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>(
    [
      [
        Asset.RBTC,
        new AssetDetails(Asset.RBTC, 'rBTC', 'Bitcoin', 18, rbtcIcon),
      ],
      [Asset.SOV, new AssetDetails(Asset.SOV, 'SOV', 'Sovryn', 18, sovIcon)],
      [Asset.XUSD, new AssetDetails(Asset.XUSD, 'XUSD', 'XUSD', 18, xusdIcon)],
      [Asset.ETH, new AssetDetails(Asset.ETH, 'ETH', 'Ethereum', 18, ethIcon)],
      [
        Asset.BNB,
        new AssetDetails(Asset.BNB, 'BNB', 'Binance Coin', 18, bnbIcon),
      ],
      [Asset.USDT, new AssetDetails(Asset.USDT, 'USDT', 'USDT', 18, usdtIcon)],
      [
        Asset.MOC,
        new AssetDetails(Asset.MOC, 'MoC', 'Money on Chain', 18, mocIcon),
      ],
      [
        Asset.DOC,
        new AssetDetails(Asset.DOC, 'DoC', 'Dollar on Chain', 18, docIcon),
      ],
      [
        Asset.BPRO,
        new AssetDetails(Asset.BPRO, 'BPRO', 'BitPro', 18, bproIcon),
      ],
      [
        Asset.CSOV,
        new AssetDetails(Asset.CSOV, 'C-SOV', 'C-Sovryn', 18, sovIcon),
      ],
      [Asset.FISH, new AssetDetails(Asset.FISH, 'FISH', 'FISH', 18, fishIcon)],
    ],
  );

  public static get(asset: Asset): AssetDetails {
    return this.assets.get(asset) as AssetDetails;
  }

  public static getByLoanContractAddress(address: string): AssetDetails {
    return this.list().find(
      item =>
        item?.lendingContract?.address.toLowerCase() === address.toLowerCase(),
    ) as AssetDetails;
  }

  public static getByTokenContractAddress(address: string): AssetDetails {
    return this.list().find(
      item =>
        item.tokenContract.address.toLowerCase() === address.toLowerCase(),
    ) as AssetDetails;
  }

  public static getByAmmContractAddress(address: string): AssetDetails {
    return this.list().find(
      item =>
        item.ammContract?.address?.toLowerCase() === address.toLowerCase(),
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
