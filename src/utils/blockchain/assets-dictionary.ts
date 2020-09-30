import Rsk from '@rsksmart/rsk3';
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
            address: Rsk.utils.toChecksumAddress(
              '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d',
            ),
            abi: abiTestWBRTCToken,
          },
          {
            address: Rsk.utils.toChecksumAddress(
              '0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A',
            ),
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
            address: Rsk.utils.toChecksumAddress(
              '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
            ),
            abi: TestTokenABI,
          },
          {
            address: Rsk.utils.toChecksumAddress(
              '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
            ),
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
