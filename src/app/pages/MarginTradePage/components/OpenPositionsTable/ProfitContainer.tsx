import React, { useMemo } from 'react';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ActiveLoan } from 'types/active-loan';
import { LoadableValue } from 'app/components/LoadableValue';
import { usePriceFeeds_QueryRate } from 'app/hooks/price-feeds/useQueryRate';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import {
  toNumberFormat,
  weiToAssetNumberFormat,
} from 'utils/display-text/format';
import { TradingPosition } from 'types/trading-position';
import { percentageChange } from 'utils/helpers';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useAccount } from 'app/hooks/useAccount';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { isLongTrade } from './helpers';

type ProfitContainerProps = {
  item: ActiveLoan;
  position: TradingPosition;
  entryPrice: number;
  leverage: number;
};

export const ProfitContainer: React.FC<ProfitContainerProps> = ({
  item,
  position,
  leverage,
  entryPrice,
}) => {
  const { t } = useTranslation();

  const { isLong, loanToken, collateralToken } = useMemo(
    () => ({
      isLong: isLongTrade(position),
      loanToken: assetByTokenAddress(item.loanToken),
      collateralToken: assetByTokenAddress(item.collateralToken),
    }),
    [position, item.loanToken, item.collateralToken],
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

  const priceChange = useMemo(() => {
    const openPrice = bignumber(entryPrice).mul(Math.pow(10, 18));
    const percentageBetweenPrices = isLong
      ? percentageChange(openPrice, exitPrice)
      : percentageChange(exitPrice, openPrice);
    return bignumber(percentageBetweenPrices).mul(leverage).toString();
  }, [isLong, entryPrice, exitPrice, leverage]);

  const exitAmountCollateral = useCacheCallWithValue<{
    loanCloseAmount: string;
    withdrawAmount: string;
    withdrawToken: string;
  }>(
    'sovrynProtocol',
    'closeWithSwap',
    { loanCloseAmount: '0', withdrawAmount: '0', withdrawToken: '' },
    item.loanId,
    useAccount(),
    item.collateral,
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
    item.loanId,
    useAccount(),
    item.collateral,
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
                {weiToAssetNumberFormat(
                  exitAmountLoan.value.withdrawAmount,
                  loanToken,
                )}{' '}
                <AssetSymbolRenderer asset={loanToken} />
              </div>
              <div className="tw-pl-3">
                {weiToAssetNumberFormat(
                  exitAmountCollateral.value.withdrawAmount,
                  collateralToken,
                )}{' '}
                <AssetSymbolRenderer asset={collateralToken} />
              </div>
            </div>
          </>
        }
      />
    </>
  );
};
