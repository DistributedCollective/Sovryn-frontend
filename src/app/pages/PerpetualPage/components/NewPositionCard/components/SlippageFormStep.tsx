import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import iconArrowForward from 'assets/images/arrow_forward.svg';
import { SlippageForm } from '../../SlippageForm';
import { NewPositionCardContext } from '..';
import { NewPositionCardStep } from '../types';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { translations } from '../../../../../../locales/i18n';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import styles from '../index.module.scss';
import { usePerpetual_queryAmmState } from 'app/pages/PerpetualPage/hooks/usePerpetual_queryAmmState';
import {
  calculateSlippagePrice,
  getMidPrice,
  calculateApproxLiquidationPrice,
  getRequiredMarginCollateral,
} from 'app/pages/PerpetualPage/utils/perpUtils';
import { getTradeDirection } from 'app/pages/PerpetualPage/utils/contractUtils';
import { usePerpetual_queryPerpParameters } from '../../../hooks/usePerpetual_queryPerpParameters';
import { fromWei } from 'web3-utils';
import { usePerpetual_queryTraderState } from '../../../hooks/usePerpetual_queryTraderState';
import { TradingPosition } from '../../../../../../types/trading-position';

export const SlippageFormStep: TransitionStep<NewPositionCardStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();

  const ammState = usePerpetual_queryAmmState();
  const perpParameters = usePerpetual_queryPerpParameters();
  const traderState = usePerpetual_queryTraderState();
  const midPrice = useMemo(() => getMidPrice(perpParameters, ammState), [
    perpParameters,
    ammState,
  ]);

  const { trade, onChangeTrade } = useContext(NewPositionCardContext);

  const pair = useMemo(() => PerpetualPairDictionary.get(trade.pairType), [
    trade.pairType,
  ]);

  const onCloseSlippage = useCallback(
    () => changeTo(NewPositionCardStep.trade, TransitionAnimation.slideRight),
    [changeTo],
  );
  const onChangeSlippage = useCallback(
    slippage => onChangeTrade({ ...trade, slippage }),
    [trade, onChangeTrade],
  );

  const minEntryPrice = useMemo(
    () =>
      calculateSlippagePrice(
        midPrice,
        trade.slippage,
        getTradeDirection(trade.position),
      ),
    [midPrice, trade.position, trade.slippage],
  );

  const minLiquidationPrice = useMemo(() => {
    const amount =
      Number(fromWei(trade.amount)) * getTradeDirection(trade.position);
    const margin = getRequiredMarginCollateral(
      trade.leverage,
      traderState.marginAccountPositionBC,
      traderState.marginAccountPositionBC + amount,
      perpParameters,
      ammState,
    );
    return calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      amount,
      margin,
    );
  }, [
    trade.amount,
    trade.position,
    trade.leverage,
    traderState,
    ammState,
    perpParameters,
  ]);

  return (
    <div>
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
      <SlippageForm slippage={trade.slippage} onChange={onChangeSlippage} />
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mt-6 tw-mb-1 tw-text-xs tw-font-medium">
        <label>
          {trade.position === TradingPosition.LONG
            ? t(translations.perpetualPage.tradeForm.labels.maxEntryPrice)
            : t(translations.perpetualPage.tradeForm.labels.minEntryPrice)}
        </label>
        <AssetValue
          className={styles.slippageValue}
          minDecimals={2}
          maxDecimals={2}
          mode={AssetValueMode.auto}
          value={minEntryPrice}
          assetString={pair.quoteAsset}
        />
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-1 tw-text-xs tw-font-medium">
        <label>
          {t(translations.perpetualPage.tradeForm.labels.minLiquidationPrice)}
        </label>
        <AssetValue
          className={styles.slippageValue}
          minDecimals={2}
          maxDecimals={2}
          mode={AssetValueMode.auto}
          value={minLiquidationPrice}
          assetString={pair.quoteAsset}
        />
      </div>
    </div>
  );
};
