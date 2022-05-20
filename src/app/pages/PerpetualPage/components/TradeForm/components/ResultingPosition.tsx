import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { selectPerpetualPage } from 'app/pages/PerpetualPage/selectors';
import { PerpetualTrade } from 'app/pages/PerpetualPage/types';
import { translations } from 'locales/i18n';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TradingPosition } from 'types/trading-position';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { toNumberFormat } from 'utils/display-text/format';
import { LeverageViewer } from '../../LeverageViewer';
import { usePerpetual_calculateResultingPosition } from '../../../hooks/usePerpetual_calculateResultingPosition';

type ResultingPositionProps = {
  trade: PerpetualTrade;
  minLeverage: number;
  maxLeverage: number;
  limitOrderPrice: number;
};

export const ResultingPosition: React.FC<ResultingPositionProps> = ({
  trade,
  minLeverage,
  maxLeverage,
  limitOrderPrice,
}) => {
  const { t } = useTranslation();

  const {
    liquidationPrice,
    leverage,
  } = usePerpetual_calculateResultingPosition(trade);

  const { pairType } = useSelector(selectPerpetualPage);
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

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
