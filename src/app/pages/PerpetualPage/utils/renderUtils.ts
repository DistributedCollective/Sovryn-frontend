import { Asset } from '../../../../types';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import perpetualLogo from 'assets/images/tokens/rbtc.svg';
import unknown from 'assets/images/error_white.svg';

export const getCollateralName = (collateral: Asset): string => {
  switch (collateral) {
    case Asset.BTCS:
      return 'BTC';
    default:
      const assetDetails = AssetsDictionary.get(collateral);
      return assetDetails?.symbol || collateral.toString();
  }
};

export const getCollateralLogo = (collateral: Asset): string => {
  switch (collateral) {
    case Asset.BTCS:
      return perpetualLogo;
    default:
      const assetDetails = AssetsDictionary.get(collateral);
      return assetDetails?.logoSvg || unknown;
  }
};
