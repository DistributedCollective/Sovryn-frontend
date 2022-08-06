import React, { useMemo } from 'react';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LoadableValue } from 'app/components/LoadableValue';
import { usePriceFeeds_QueryRate } from 'app/hooks/price-feeds/useQueryRate';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { toNumberFormat } from 'utils/display-text/format';
import { TradingPosition } from 'types/trading-position';
import { percentageChange } from 'utils/helpers';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useAccount } from 'app/hooks/useAccount';
import { isLongTrade } from '../../utils/marginUtils';
import { AssetValue } from 'app/components/AssetValue';
import { MarginLoansFieldsFragment } from 'utils/graphql/rsk/generated';
import { DEFAULT_TRADE } from '../../types';

type ProfitContainerProps = {
  item: MarginLoansFieldsFragment;
  position: TradingPosition;
  leverage: number;
};

export const ProfitContainer: React.FC<ProfitContainerProps> = ({
  item,
  position,
  leverage,
}) => {
  const { t } = useTranslation();
  const {
    id,
    trade,
    loanToken: { id: loanTokenId },
    collateralToken: { id: collateralTokenId },
  } = item;

  const entryPrice = trade?.[0].entryPrice || DEFAULT_TRADE.entryPrice;
  const { isLong, loanToken, collateralToken } = useMemo(
    () => ({
      isLong: isLongTrade(position),
      loanToken: assetByTokenAddress(loanTokenId),
      collateralToken: assetByTokenAddress(collateralTokenId),
    }),
    [position, loanTokenId, collateralTokenId],
  );

  const {
    value: currentCollateralToPrincipalRate,
    loading,
  } = usePriceFeeds_QueryRate(collateralToken, loanToken);

  const exitPrice = useMemo(() => {
    let currentRate = bignumber(currentCollateralToPrincipalRate.rate);
    if (!isLong) {
      currentRate = bignumber(1)
        .div(currentRate)
        .times(currentCollateralToPrincipalRate.precision)
        .mul(Math.pow(10, 18));
    }
    return currentRate.div(1.003).toString();
  }, [
    currentCollateralToPrincipalRate.rate,
    currentCollateralToPrincipalRate.precision,
    isLong,
  ]);

  const entryPriceFormatted = useMemo(() => {
    if (isLong) {
      return bignumber(1).div(entryPrice);
    }
    return entryPrice;
  }, [entryPrice, isLong]);

  const priceChange = useMemo(() => {
    const openPrice = bignumber(entryPriceFormatted).mul(Math.pow(10, 18));
    const percentageBetweenPrices = isLong
      ? percentageChange(openPrice, exitPrice)
      : percentageChange(exitPrice, openPrice);
    return bignumber(percentageBetweenPrices).mul(leverage).toString();
  }, [isLong, exitPrice, leverage, entryPriceFormatted]);

  const exitAmountCollateral = useCacheCallWithValue<{
    loanCloseAmount: string;
    withdrawAmount: string;
    withdrawToken: string;
  }>(
    'sovrynProtocol',
    'closeWithSwap',
    { loanCloseAmount: '0', withdrawAmount: '0', withdrawToken: '' },
    id,
    useAccount(),
    collateralTokenId,
    true,
    '0x',
  );

  const exitAmountLoan = useCacheCallWithValue<{
    loanCloseAmount: string;
    withdrawAmount: string;
    withdrawToken: string;
  }>(
    'sovrynProtocol',
    'closeWithSwap',
    { loanCloseAmount: '0', withdrawAmount: '0', withdrawToken: '' },
    id,
    useAccount(),
    collateralTokenId,
    false,
    '0x',
  );

  return (
    <>
      <LoadableValue
        loading={loading}
        value={
          <>
            <div
              className={classNames(
                priceChange > '0' && 'tw-text-success',
                priceChange < '0' && 'tw-text-warning',
              )}
            >
              {toNumberFormat(priceChange, 3)} %
            </div>
          </>
        }
        tooltip={
          <>
            <div>{toNumberFormat(priceChange, 18)} %</div>
            <div className="tw-mt-2 tw-text-xs">
              <div>{t(translations.openPositionTable.profitTooltip)}</div>
              <div className="tw-mt-1 tw-pl-3">
                <AssetValue
                  asset={loanToken}
                  value={exitAmountLoan.value.withdrawAmount}
                />
              </div>
              <div className="tw-pl-3">
                <AssetValue
                  asset={collateralToken}
                  value={exitAmountCollateral.value.withdrawAmount}
                />
              </div>
            </div>
          </>
        }
      />
    </>
  );
};
