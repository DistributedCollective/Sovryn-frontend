import { Asset } from 'types/asset';

import docIcon from 'assets/images/tokens/doc.svg';
import usdtIcon from 'assets/images/tokens/usdt.svg';
import xusdIcon from 'assets/images/tokens/xusd.svg';
import rbtcIcon from 'assets/images/tokens/rbtc.svg';
import bproIcon from 'assets/images/tokens/bpro.svg';
import sovIcon from 'assets/images/tokens/sov.svg';
import ethIcon from 'assets/images/tokens/eth.svg';
import bnbIcon from 'assets/images/tokens/bnb.svg';
import mocIcon from 'assets/images/tokens/moc.svg';
import fishIcon from 'assets/images/tokens/babelfish.svg';
import rdoc from 'assets/images/tokens/rifd.svg';
import rifToken from 'assets/images/tokens/rif.svg';
import mintIcon from 'assets/images/tokens/mint.svg';

import { AssetDetails } from '../models/asset-details';
import { isMainnet } from 'utils/classifiers';

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>(
    [
      [
        Asset.RBTC,
        new AssetDetails(Asset.RBTC, 'RBTC', 'Bitcoin', 18, 8, rbtcIcon, true),
      ],
      [
        Asset.WRBTC,
        new AssetDetails(
          Asset.WRBTC,
          'WRBTC',
          'Wrapped Bitcoin',
          18,
          8,
          rbtcIcon,
          false,
          true,
        ),
      ],
      [
        Asset.SOV,
        new AssetDetails(Asset.SOV, 'SOV', 'Sovryn', 18, 3, sovIcon, true),
      ],
      [
        Asset.XUSD,
        new AssetDetails(Asset.XUSD, 'XUSD', 'XUSD', 18, 3, xusdIcon, true),
      ],
      [
        Asset.ETH,
        new AssetDetails(Asset.ETH, 'ETH', 'Ethereum', 18, 6, ethIcon, true),
      ],
      [
        Asset.BNB,
        new AssetDetails(
          Asset.BNB,
          'BNB',
          'Binance Coin',
          18,
          6,
          bnbIcon,
          true,
        ),
      ],
      [
        Asset.USDT,
        new AssetDetails(Asset.USDT, 'USDT', 'USDT', 18, 3, usdtIcon, true),
      ],
      [
        Asset.MOC,
        new AssetDetails(
          Asset.MOC,
          'MoC',
          'Money on Chain',
          18,
          3,
          mocIcon,
          true,
        ),
      ],
      [
        Asset.DOC,
        new AssetDetails(
          Asset.DOC,
          'DoC',
          'Dollar on Chain',
          18,
          3,
          docIcon,
          true,
        ),
      ],
      [
        Asset.RDOC,
        new AssetDetails(
          Asset.RDOC,
          'RDOC',
          'RIF Dollar on Chain',
          18,
          3,
          rdoc,
          false,
          true,
        ),
      ],
      [
        Asset.BPRO,
        new AssetDetails(Asset.BPRO, 'BPRO', 'BitPro', 18, 8, bproIcon, true),
      ],
      [
        Asset.CSOV,
        new AssetDetails(
          Asset.CSOV,
          'C-SOV',
          'C-Sovryn',
          18,
          3,
          sovIcon,
          false,
          true,
        ),
      ],
      [
        Asset.FISH,
        new AssetDetails(Asset.FISH, 'FISH', 'FISH', 18, 3, fishIcon, true),
      ],
      // Uncomment if you want to test Deposit/Withdraw of margin tokens
      // [
      //   Asset.BTCS,
      //   new AssetDetails(
      //     Asset.BTCS,
      //     'PERPETUALS',
      //     'PERPETUALS',
      //     18,
      //     fishIcon,
      //     true,
      //   ),
      // ],
      [
        Asset.RIF,
        new AssetDetails(Asset.RIF, 'RIF', 'RIF', 18, 3, rifToken, true),
      ],
      [
        Asset.MYNT,
        new AssetDetails(Asset.MYNT, 'MYNT', 'MYNT', 18, 3, mintIcon, true),
      ],
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

if (!isMainnet) {
  AssetsDictionary.assets.set(
    Asset.XUSD_legacy,
    new AssetDetails(
      Asset.XUSD_legacy,
      'XUSD*',
      'XUSD Legacy',
      18,
      3,
      xusdIcon,
      false,
      true,
    ),
  );
}
