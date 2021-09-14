import { useMemo } from 'react';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { TradingPosition } from 'types/trading-position';
import { Asset } from 'types/asset';

interface PairTokensResponse {
  loanToken: Asset;
  collateralToken: Asset;
  useLoanTokens: boolean;
  useCollateralTokens: boolean;
}

export function usePerpetual_resolvePairTokens(
  pair: PerpetualPair,
  position: TradingPosition,
  collateral: Asset,
): PairTokensResponse {
  const loanToken = useMemo(() => pair.getAssetForPosition(position), [
    pair,
    position,
  ]);
  const collateralToken = useMemo(() => {
    if (loanToken === collateral) {
      return position === TradingPosition.LONG
        ? pair.shortAsset
        : pair.longAsset;
    }
    return collateral;
  }, [pair, position, collateral, loanToken]);

  return {
    loanToken,
    collateralToken,
    useLoanTokens: loanToken === collateral,
    useCollateralTokens: loanToken !== collateral,
  };
}
