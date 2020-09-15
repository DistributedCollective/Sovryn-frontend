import { Asset } from 'types/asset';
import { AssetDetails } from './asset-details';

import btcIcon from 'assets/images/rBTC-logo.png';
import usdIcon from 'assets/images/dollar-sign.svg';
import LoanTokenABI from './abi/abiLoanToken.json';
import TestTokenABI from './abi/abiTestToken.json';
import TestToken from './abi/TestToken.json';
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
            address: '0x21Fa1095205a37aDe78F394B3B984ea3f743bc70',
            abi: TestToken,
          },
          {
            address: '0x021Bc6f3c101fC1354A212583a5aF0347FE283Cf',
            abi: LoanTokenLogicWrbtc,
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
            address: '0xD1A979EDE2c17FCD31800Bed859e5EC3DA178Cb9',
            abi: LoanTokenABI,
          },
          usdIcon,
          { min: 1, max: 50000 },
        ),
      ],
      // this one is fake btc token, will be removed later,
      // without this app may crash if user has trade history on legacy contract.
      [
        Asset.BTC_DUMMY,
        new AssetDetails(
          Asset.BTC_DUMMY,
          'BTC_DUMMY',
          'BTC_DUMMY',
          18,
          {
            address: '0xE53d858A78D884659BF6955Ea43CBA67c0Ae293F',
            abi: TestTokenABI,
          },
          {
            address: '0x08118a219a4e34E06176cD0861fcDDB865771111',
            abi: LoanTokenABI,
          },
          btcIcon,
          { min: 0.01, max: 1 },
        ),
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
