import { Asset } from 'types/asset';

import docIcon from 'assets/images/tokens/doc.svg';
import usdtIcon from 'assets/images/tokens/usdt.svg';
import rbtcIcon from 'assets/images/tokens/rbtc.png';
import bproIcon from 'assets/images/tokens/bpro.svg';
import sovIcon from 'assets/images/tokens/sov.svg';

import { AssetDetails } from '../models/asset-details';
import { Chain } from '../../types/chain';
import { currentChainId } from '../classifiers';

export class AssetsDictionary {
  public static assets: Map<Asset, AssetDetails> = new Map<Asset, AssetDetails>(
    [
      [
        Asset.BTC,
        new AssetDetails(Asset.BTC, 'rBTC', 'Bitcoin', 18, rbtcIcon, [
          Chain.RSK,
          Chain.RSK_TESTNET,
        ]),
      ],
      [
        Asset.DOC,
        new AssetDetails(Asset.DOC, 'DoC', 'Dollar on Chain', 18, docIcon, [
          Chain.RSK,
          Chain.RSK_TESTNET,
        ]),
      ],
      [
        Asset.USDT,
        new AssetDetails(Asset.USDT, 'USDT', 'USDT', 18, usdtIcon, [
          Chain.RSK,
          Chain.RSK_TESTNET,
        ]),
      ],
      [
        Asset.BPRO,
        new AssetDetails(Asset.BPRO, 'BPRO', 'BitPro', 18, bproIcon, [
          Chain.RSK,
          Chain.RSK_TESTNET,
        ]),
      ],
      [
        Asset.CSOV,
        new AssetDetails(Asset.CSOV, 'C-SOV', 'C-Sovryn', 18, sovIcon, [
          Chain.RSK,
          Chain.RSK_TESTNET,
        ]),
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
    return this.listForChain(currentChainId);
  }

  public static assetList(): Array<Asset> {
    return this.listAssetsForChain(currentChainId);
  }

  public static find(assets: Array<Asset>): Array<AssetDetails> {
    return assets.map(asset => this.get(asset));
  }

  public static listForChain(chainId: Chain) {
    return Array.from(this.assets.values()).filter(item =>
      item.chainIds.includes(chainId),
    );
  }

  public static listAssetsForChain(chainId: Chain) {
    return Array.from(this.assets.values())
      .filter(item => item.chainIds.includes(chainId))
      .map(item => item.asset);
  }
}
