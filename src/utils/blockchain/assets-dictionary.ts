import { Asset } from 'types/asset';
import { AssetDetails } from './asset-details';
// @ts-ignore
import btcIcon from 'assets/images/rBTC-logo.png';
// @ts-ignore
import usdIcon from 'assets/images/dollar-sign.svg';
import LoanTokenABI from './abi/abiLoanToken.json';
import TestTokenABI from './abi/abiTestToken.json';
import abiTestWBRTCToken from './abi/abiTestWBRTCToken.json';
import LoanTokenLogicWrbtc from './abi/LoanTokenLogicWrbtc.json';

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
            address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
            abi: abiTestWBRTCToken,
          },
          {
            address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B',
            abi: LoanTokenLogicWrbtc,
          },
          btcIcon,
          { min: 0.01, max: 1 },
        ).setCollateralAssets([Asset.DOC]),
      ],
      [
        Asset.DOC,
        new AssetDetails(
          Asset.DOC,
          'DoC',
          'Dollar on Chain',
          18,
          {
            address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
            abi: TestTokenABI,
          },
          {
            address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
            abi: LoanTokenABI,
          },
          usdIcon,
          { min: 1, max: 50000 },
        ).setCollateralAssets([Asset.BTC]),
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
