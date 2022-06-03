import React, { useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import settingImg from 'assets/images/settings-blue.svg';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { actions } from '../../../slice';
import { PerpetualPageModals } from '../../../types';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { AmountInput } from '../../../../../components/Form/AmountInput';
import { ClosePositionDialogStep } from '../types';
import { ClosePositionDialogContext } from '..';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import {
  toWei,
  fromWei,
} from '../../../../../../utils/blockchain/math-helpers';
import { PerpetualTxMethod, PerpetualTx } from '../../../types';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { ActionDialogSubmitButton } from '../../ActionDialogSubmitButton';
import { usePerpetual_isTradingInMaintenance } from 'app/pages/PerpetualPage/hooks/usePerpetual_isTradingInMaintenance';
import { selectPerpetualPage } from '../../../selectors';
import { perpMath, perpUtils } from '@sovryn/perpetual-swap';
import { getCollateralName } from 'app/pages/PerpetualPage/utils/renderUtils';
import { usePerpetual_analyseTrade } from '../../../hooks/usePerpetual_analyseTrade';
import { ValidationHint } from '../../ValidationHint/ValidationHint';

const { roundToLot } = perpMath;
const { getPrice } = perpUtils;

export const TradeFormStep: TransitionStep<ClosePositionDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { pairType: currentPairType } = useSelector(selectPerpetualPage);

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const { changedTrade, trade, onChange } = useContext(
    ClosePositionDialogContext,
  );

  const { perpetuals } = useContext(PerpetualQueriesContext);

  const pair = useMemo(
    () =>
      PerpetualPairDictionary.get(changedTrade?.pairType || currentPairType),
    [changedTrade?.pairType, currentPairType],
  );

  const {
    ammState,
    perpetualParameters: perpParameters,
    averagePrice,
    lotSize,
    lotPrecision,
  } = perpetuals[pair.id];

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const {
    amountChange,
    amountTarget,
    marginChange,
    marginTarget,
    validation,
    partialUnrealizedPnL,
  } = usePerpetual_analyseTrade(changedTrade);

  const totalToReceive = partialUnrealizedPnL - marginChange;

  const onSubmit = useCallback(() => {
    if (!changedTrade) {
      return;
    }

    const targetTrade = {
      ...changedTrade,
      amount: toWei(Math.abs(amountChange)),
      averagePrice: toWei(averagePrice),
      entryPrice: toWei(getPrice(amountTarget, perpParameters, ammState)),
      isClosePosition: true,
      keepPositionLeverage: true,
    };

    let transactions: PerpetualTx[] = [];
    if (!Number.isNaN(marginTarget)) {
      transactions.push({
        pair: pair.pairType,
        method: PerpetualTxMethod.trade,
        isClosePosition: true,
        keepPositionLeverage: true,
        price: targetTrade.averagePrice,
        amount: toWei(amountChange),
        slippage: changedTrade?.slippage,
        tx: null,
        approvalTx: null,
      });
    } else {
      // marginTarget is NaN in case we don't have a position but we successfully deposited a margin: [
      transactions.push({
        pair: pair.pairType,
        method: PerpetualTxMethod.withdrawAll,
        tx: null,
      });
    }

    transactions = transactions.map((transaction, index) => ({
      ...transaction,
      origin: PerpetualPageModals.CLOSE_POSITION,
      index,
      count: transactions.length,
    }));

    dispatch(
      actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
        origin: PerpetualPageModals.CLOSE_POSITION,
        trade: targetTrade,
        transactions,
      }),
    );
  }, [
    dispatch,
    averagePrice,
    changedTrade,
    amountTarget,
    amountChange,
    marginTarget,
    pair,
    ammState,
    perpParameters,
  ]);

  const onChangeAmount = useCallback(
    (value: string) => {
      const amount = Number(value);
      if (!changedTrade || !Number.isFinite(amount)) {
        return;
      }

      const clampedAmount = roundToLot(
        Math.max(0, Math.min(Number(fromWei(trade?.amount || '0')), amount)),
        lotSize || 1,
      );

      onChange({
        ...changedTrade,
        amount: toWei(clampedAmount),
        keepPositionLeverage: true,
      });
    },
    [onChange, changedTrade, lotSize, trade?.amount],
  );

  const isButtonDisabled = useMemo(
    () =>
      (amountChange === 0 && marginChange === 0) ||
      (validation && !validation.valid && !validation.isWarning),
    [amountChange, marginChange, validation],
  );

  const onOpenSlippage = useCallback(
    () => changeTo(ClosePositionDialogStep.slippage),
    [changeTo],
  );

  if (!trade) {
    return null;
  }

  return (
    <div className="tw-relative tw-mw-340 tw-min-h-96 tw-h-full tw-pb-12 tw-mx-auto">
      <div className="tw-mb-4 tw-pt-12 tw-text-sm">
        <label>{t(translations.perpetualPage.closePosition.amount)}</label>
        <AmountInput
          value={Math.abs(amountChange).toFixed(lotPrecision)}
          maxAmount={trade?.amount}
          assetString={pair.baseAsset}
          decimalPrecision={lotPrecision}
          step={lotSize}
          onChange={onChangeAmount}
        />
      </div>
      <div className="tw-my-4 tw-text-secondary tw-text-xs">
        <button className="tw-flex tw-flex-row" onClick={onOpenSlippage}>
          <Trans
            i18nKey={
              translations.perpetualPage.tradeForm.buttons.slippageSettings
            }
          />
          <img className="tw-ml-2" alt="setting" src={settingImg} />
        </button>
      </div>
      <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-mb-4 tw-px-6 tw-py-1 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
        <label>{t(translations.perpetualPage.closePosition.total)}</label>
        <span className="tw-text-base tw-font-semibold tw-text-trade-long">
          ≥
          <AssetValue
            className="tw-ml-1"
            minDecimals={4}
            maxDecimals={4}
            mode={AssetValueMode.auto}
            value={totalToReceive}
            assetString={collateralName}
            showPositiveSign
            useTooltip
          />
        </span>
      </div>

      <ValidationHint className="tw-mb-4" validation={validation} />

      <ActionDialogSubmitButton
        inMaintenance={inMaintenance}
        isDisabled={isButtonDisabled}
        onClick={onSubmit}
        className="tw-absolute tw-bottom-0"
        maintenanceClassName="tw-absolute tw-bottom-0"
      >
        {t(translations.perpetualPage.closePosition.button)}
      </ActionDialogSubmitButton>
    </div>
  );
};
