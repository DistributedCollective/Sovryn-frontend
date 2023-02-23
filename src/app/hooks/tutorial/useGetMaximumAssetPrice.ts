import { TradingTypes } from 'app/pages/SpotTradingPage/types';
import { bignumber } from 'mathjs';
import { useMemo } from 'react';
import { Asset } from 'types';
import { toWei } from 'utils/blockchain/math-helpers';
import { useSwapsExternal_getSwapExpectedReturn } from '../swap-network/useSwapsExternal_getSwapExpectedReturn';

const oneToken = toWei(1);

const getMaximumPrice = (rate: string, slippage: number) =>
  bignumber(rate).mul(slippage).toString();

export const useGetMaximumAssetPrice = (
  sourceToken: Asset,
  targetToken: Asset,
  slippage: number,
  tradeType?: TradingTypes,
) => {
  const baseToken = useMemo(() => {
    if (!tradeType) {
      return sourceToken;
    }

    return tradeType === TradingTypes.BUY ? targetToken : sourceToken;
  }, [sourceToken, targetToken, tradeType]);

  const quoteToken = useMemo(() => {
    if (!tradeType) {
      return targetToken;
    }

    return tradeType === TradingTypes.BUY ? sourceToken : targetToken;
  }, [sourceToken, targetToken, tradeType]);

  const slippageMultiplier = useMemo(() => 1 + slippage / 100, [slippage]);

  // Used on Spot page
  const { value: rateByPath } = useSwapsExternal_getSwapExpectedReturn(
    baseToken,
    quoteToken,
    oneToken,
  );

  // Used on Swap page
  const { value: rateByPathSource } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    oneToken,
  );

  const { value: rateByPathTarget } = useSwapsExternal_getSwapExpectedReturn(
    targetToken,
    sourceToken,
    oneToken,
  );

  return {
    value: getMaximumPrice(rateByPath, slippageMultiplier),
    token: quoteToken,
    sourceTokenValue: getMaximumPrice(rateByPathSource, slippageMultiplier),
    targeTokenValue: getMaximumPrice(rateByPathTarget, slippageMultiplier),
  };
};
