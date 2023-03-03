import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { TradingTypes } from 'app/pages/SpotTradingPage/types';
import { bignumber } from 'mathjs';
import { useMemo } from 'react';
import { Asset } from 'types';
import { toWei } from 'utils/blockchain/math-helpers';
import { useSwapsExternal_getSwapExpectedReturn } from '../swap-network/useSwapsExternal_getSwapExpectedReturn';

export const useGetMaximumAssetPrice = (
  sourceAmount: string,
  minimumReceived: string,
  sourceToken: Asset,
  targetToken: Asset,
  slippage: number,
  tradeType?: TradingTypes,
) => {
  const quoteToken = useMemo(() => {
    if (!tradeType) {
      return targetToken;
    }

    return tradeType === TradingTypes.BUY ? sourceToken : targetToken;
  }, [sourceToken, targetToken, tradeType]);

  const sourceTokenValue = useMemo(
    () => toWei(bignumber(sourceAmount).div(minimumReceived)),
    [minimumReceived, sourceAmount],
  );

  const maximumSpotPrice = useMemo(
    () =>
      tradeType === TradingTypes.BUY
        ? sourceTokenValue
        : toWei(bignumber(minimumReceived).div(sourceAmount)),
    [minimumReceived, sourceAmount, sourceTokenValue, tradeType],
  );

  const { value: targetTokenRate } = useSwapsExternal_getSwapExpectedReturn(
    targetToken,
    sourceToken,
    minimumReceived,
  );

  const { minReturn: targetTokenRateWithSlippage } = useSlippage(
    targetTokenRate,
    slippage,
  );

  const targetTokenValue = useMemo(
    () => toWei(bignumber(minimumReceived).div(targetTokenRateWithSlippage)),
    [minimumReceived, targetTokenRateWithSlippage],
  );

  return {
    maximumSpotPrice,
    token: quoteToken,
    sourceTokenValue,
    targetTokenValue,
  };
};
