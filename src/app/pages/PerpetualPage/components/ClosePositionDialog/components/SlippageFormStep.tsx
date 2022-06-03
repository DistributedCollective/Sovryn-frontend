import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import iconArrowForward from 'assets/images/arrow_forward.svg';
import { SlippageForm } from '../../SlippageForm';
import { ClosePositionDialogStep } from '../types';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { translations } from '../../../../../../locales/i18n';
import { ClosePositionDialogContext } from '..';
import { PERPETUAL_SLIPPAGE_DEFAULT } from '../../../types';
import { getTradeDirection } from '../../../utils/contractUtils';
import { TradingPosition } from '../../../../../../types/trading-position';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { perpUtils } from '@sovryn/perpetual-swap';
import { useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../../selectors';

const { calculateSlippagePrice } = perpUtils;

export const SlippageFormStep: TransitionStep<ClosePositionDialogStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();

  const { pairType } = useSelector(selectPerpetualPage);
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { changedTrade, onChange } = useContext(ClosePositionDialogContext);

  const pair = useMemo(
    () => PerpetualPairDictionary.get(changedTrade?.pairType || pairType),
    [changedTrade?.pairType, pairType],
  );

  const { averagePrice } = perpetuals[pair.id];

  const onCloseSlippage = useCallback(
    () =>
      changeTo(ClosePositionDialogStep.trade, TransitionAnimation.slideRight),
    [changeTo],
  );
  const onChangeSlippage = useCallback(
    slippage =>
      changedTrade &&
      onChange({
        ...changedTrade,
        slippage,
      }),
    [onChange, changedTrade],
  );

  const minEntryPrice = useMemo(
    () =>
      changedTrade &&
      calculateSlippagePrice(
        averagePrice,
        changedTrade.slippage,
        getTradeDirection(changedTrade.position),
      ),
    [changedTrade, averagePrice],
  );

  return (
    <div className="tw-mw-340 tw-mx-auto">
      <h3 className="tw-relative tw-mb-12 tw-text-center tw-text-base tw-font-medium tw-normal-case tw-leading-normal">
        <button
          className="tw-absolute tw-left-0 tw-top-0"
          onClick={onCloseSlippage}
        >
          <img
            className="tw-transform tw-rotate-180"
            src={iconArrowForward}
            alt="Back"
            title="Back"
          />
        </button>
        {t(translations.perpetualPage.tradeForm.titles.slippage)}
      </h3>
      <SlippageForm
        slippage={changedTrade?.slippage || PERPETUAL_SLIPPAGE_DEFAULT}
        onChange={onChangeSlippage}
      />
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mt-6 tw-mb-1 tw-text-xs tw-font-medium">
        <label>
          {changedTrade?.position === TradingPosition.LONG
            ? t(translations.perpetualPage.tradeForm.labels.maxEntryPrice)
            : t(translations.perpetualPage.tradeForm.labels.minEntryPrice)}
        </label>
        {minEntryPrice && (
          <AssetValue
            minDecimals={2}
            maxDecimals={2}
            mode={AssetValueMode.auto}
            value={minEntryPrice}
            assetString={pair.quoteAsset}
          />
        )}
      </div>
    </div>
  );
};
