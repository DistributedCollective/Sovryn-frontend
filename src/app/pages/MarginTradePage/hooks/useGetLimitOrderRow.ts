import { useMemo } from 'react';
import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';
import { TradingPair } from 'utils/models/trading-pair';
import { TradingPosition } from 'types/trading-position';

export const useGetLimitOrderRow = (
  pair: TradingPair,
  position: TradingPosition,
  loanTokenSent: string,
  collateralTokenSent: string,
  minEntryPrice: string,
) => {
  const tradeAmount = useMemo(
    () =>
      loanTokenSent.toString() !== '0'
        ? loanTokenSent.toString()
        : collateralTokenSent.toString(),
    [loanTokenSent, collateralTokenSent],
  );
  const loanToken = pair?.getAssetForPosition(position);

  const entryPrice = useMemo(() => fromWei(minEntryPrice.toString()), [
    minEntryPrice,
  ]);

  const minEntry = useMemo(() => {
    if (pair?.longAsset === loanToken) {
      if (!entryPrice || Number(entryPrice) === 0) return '';
      return bignumber(1).div(entryPrice).toFixed(8);
    }
    return entryPrice;
  }, [entryPrice, loanToken, pair?.longAsset]);

  return {
    tradeAmount,
    minEntry,
  };
};
