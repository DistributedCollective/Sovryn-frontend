import {
  calculateApproxLiquidationPrice,
  calculateLeverage,
  getTraderLeverage,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { selectPerpetualPage } from 'app/pages/PerpetualPage/selectors';
import { PerpetualTrade } from 'app/pages/PerpetualPage/types';
import { getTradeDirection } from 'app/pages/PerpetualPage/utils/contractUtils';
import { getRequiredMarginCollateralWithGasFees } from 'app/pages/PerpetualPage/utils/perpUtils';
import { translations } from 'locales/i18n';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TradingPosition } from 'types/trading-position';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { toNumberFormat } from 'utils/display-text/format';
import { fromWei } from 'web3-utils';
import { LeverageViewer } from '../../LeverageViewer';

type ResultingPositionProps = {
  trade: PerpetualTrade;
  minLeverage: number;
  maxLeverage: number;
  limitOrderPrice: number;
  keepPositionLeverage?: boolean;
};

export const ResultingPosition: React.FC<ResultingPositionProps> = ({
  trade,
  minLeverage,
  maxLeverage,
  limitOrderPrice,
  keepPositionLeverage = false,
}) => {
  const { t } = useTranslation();

  const { pairType, useMetaTransactions } = useSelector(selectPerpetualPage);
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const amount = useMemo(() => fromWei(trade.amount), [trade.amount]);

  const { perpetuals } = useContext(PerpetualQueriesContext);
  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
  } = perpetuals[pair.id];

  const leverage = useMemo(() => {
    // trader doesn't have an open position
    if (!traderState.marginAccountPositionBC) {
      return trade.leverage;
    }

    if (keepPositionLeverage) {
      return getTraderLeverage(traderState, ammState);
    }

    const amountChange = Number(amount) * getTradeDirection(trade.position);
    const targetAmount = traderState.marginAccountPositionBC + amountChange;

    return calculateLeverage(
      targetAmount,
      traderState.availableCashCC,
      traderState,
      ammState,
      perpParameters,
    );
  }, [
    ammState,
    amount,
    keepPositionLeverage,
    perpParameters,
    trade.leverage,
    trade.position,
    traderState,
  ]);

  const liquidationPrice = useMemo(() => {
    const requiredCollateral = getRequiredMarginCollateralWithGasFees(
      leverage,
      Number(amount),
      perpParameters,
      ammState,
      traderState,
      trade.slippage,
      useMetaTransactions,
      true,
    );

    return calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      Number(amount),
      requiredCollateral,
    );
  }, [
    ammState,
    amount,
    leverage,
    perpParameters,
    trade.slippage,
    traderState,
    useMetaTransactions,
  ]);

  return (
    <>
      <label className="tw-inline-block tw-text-sm tw-font-medium tw-mt-2">
        {t(translations.perpetualPage.tradeForm.labels.resultingPosition)}
      </label>

      <div className="tw-flex tw-flex-col tw-px-6 tw-py-1.5 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
        <LeverageViewer
          value={leverage}
          min={minLeverage}
          max={maxLeverage}
          valueLabel={`${toNumberFormat(leverage, 2)}x`}
          label={t(translations.perpetualPage.tradeForm.labels.leverage)}
          className="tw-mb-1 tw-mt-1"
        />

        <div className="tw-flex tw-justify-between tw-font-medium tw-text-xs tw-mb-1">
          <label>
            {t(translations.perpetualPage.tradeForm.labels.liquidationPrice)}
          </label>
          <AssetValue
            minDecimals={2}
            maxDecimals={2}
            mode={AssetValueMode.auto}
            value={liquidationPrice}
            assetString={pair.quoteAsset}
          />
        </div>

        <div className="tw-flex tw-justify-between tw-font-medium tw-text-xs tw-mb-1">
          <label>
            {t(
              translations.perpetualPage.tradeForm.labels[
                trade.position === TradingPosition.LONG
                  ? 'maxEntryPrice'
                  : 'minEntryPrice'
              ],
            )}
          </label>
          <AssetValue
            minDecimals={2}
            maxDecimals={2}
            mode={AssetValueMode.auto}
            value={limitOrderPrice}
            assetString={pair.quoteAsset}
          />
        </div>
      </div>
    </>
  );
};
