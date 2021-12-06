import React, { useCallback, useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import settingImg from 'assets/images/settings-blue.svg';
import classNames from 'classnames';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { actions } from '../../../slice';
import { PerpetualPageModals, PerpetualTradeType } from '../../../types';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { Tooltip, PopoverPosition } from '@blueprintjs/core';
import { AmountInput } from '../../../../../components/Form/AmountInput';
import { ClosePositionDialogStep } from '../types';
import { ClosePositionDialogContext } from '..';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { getTraderPnLInCC } from '../../../utils/perpUtils';
import { getSignedAmount } from '../../../utils/contractUtils';
import { TradingPosition } from '../../../../../../types/trading-position';
import { toWei } from '../../../../../../utils/blockchain/math-helpers';
import { PerpetualTxMethods, PerpetualTx } from '../../TradeDialog/types';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { roundToLot } from '../../../utils/perpMath';

export const TradeFormStep: TransitionStep<ClosePositionDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
    averagePrice,
  } = useContext(PerpetualQueriesContext);

  const { changedTrade, trade, onChange } = useContext(
    ClosePositionDialogContext,
  );

  const [lotSize, lotPrecision] = useMemo(() => {
    const lotSize = Number(perpParameters.fLotSizeBC.toPrecision(8));
    const lotPrecision = lotSize.toString().split(/[,.]/)[1]?.length || 1;

    return [lotSize, lotPrecision];
  }, [perpParameters.fLotSizeBC]);

  const pair = useMemo(
    () =>
      PerpetualPairDictionary.get(
        changedTrade?.pairType || PerpetualPairType.BTCUSD,
      ),
    [changedTrade?.pairType],
  );

  const {
    amountChange,
    amountTarget,
    marginTarget,
    marginChange,
    totalToReceive,
  } = useMemo(() => {
    const amountCurrent = trade
      ? getSignedAmount(trade.position, trade.amount)
      : 0;
    const amountChange = changedTrade
      ? getSignedAmount(changedTrade.position, changedTrade.amount)
      : 0;

    const amountTarget = amountCurrent + amountChange;
    const targetFactor = amountTarget / amountCurrent;
    const marginTarget = traderState.availableCashCC * targetFactor;
    const marginChange = marginTarget - traderState.availableCashCC;

    const unrealizedPartial =
      getTraderPnLInCC(traderState, ammState, perpParameters) *
      (1 - targetFactor);
    const totalToReceive = Math.abs(marginChange) + unrealizedPartial;

    return {
      amountChange,
      amountTarget,
      marginTarget,
      marginChange,
      totalToReceive: Number.isNaN(totalToReceive)
        ? traderState.availableCashCC
        : totalToReceive,
    };
  }, [trade, changedTrade, traderState, ammState, perpParameters]);

  const onSubmit = useCallback(() => {
    if (!changedTrade) {
      return;
    }

    const targetTrade = {
      ...changedTrade,
      amount: toWei(Math.abs(amountTarget)),
      margin: toWei(Number.isNaN(marginTarget) ? 0 : marginTarget), // marginTarget is NaN in case we don't have a position but we successfully deposited a margin
      position:
        amountTarget >= 0 ? TradingPosition.LONG : TradingPosition.SHORT,
      entryPrice: averagePrice,
    };

    const transactions: PerpetualTx[] = [];
    if (!Number.isNaN(marginTarget)) {
      transactions.push({
        method: PerpetualTxMethods.trade,
        isClosePosition: true,
        amount: toWei(amountChange),
        slippage: changedTrade?.slippage,
        tx: null,
        approvalTx: null,
      });
      if (Math.abs(amountTarget) > 0) {
        transactions.push({
          method: PerpetualTxMethods.withdraw,
          amount: toWei(Math.abs(totalToReceive)),
          tx: null,
        });
      }
    } else {
      // marginTarget is NaN in case we don't have a position but we successfully deposited a margin: [
      transactions.push({
        method: PerpetualTxMethods.withdrawAll,
        tx: null,
      });
    }

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
    totalToReceive,
  ]);

  const onChangeAmount = useCallback(
    (value: string) => {
      const amount = Number(value);
      if (!changedTrade || !Number.isFinite(amount)) {
        return;
      }

      onChange({
        ...changedTrade,
        amount: toWei(roundToLot(amount, lotSize)),
      });
    },
    [onChange, changedTrade, lotSize],
  );

  const onOpenSlippage = useCallback(
    () => changeTo(ClosePositionDialogStep.slippage),
    [changeTo],
  );

  if (!trade) {
    return null;
  }

  return (
    <div className="tw-relative tw-mw-340 tw-h-full tw-mx-auto">
      <div className="tw-flex tw-flex-row tw-items-center tw-mb-6">
        <button
          className={classNames(
            'tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-sm tw-text-sov-white tw-bg-gray-7 tw-rounded-lg',
            trade.tradeType !== PerpetualTradeType.MARKET &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          // disabled={!validate || !connected || openTradesLocked}
        >
          {t(translations.perpetualPage.tradeForm.buttons.market)}
        </button>
        <Tooltip
          hoverOpenDelay={0}
          hoverCloseDelay={0}
          interactionKind="hover"
          position={PopoverPosition.BOTTOM_LEFT}
          content={t(translations.common.comingSoon)}
        >
          <button
            className="tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-sm tw-text-sov-white tw-bg-gray-7 tw-rounded-lg tw-opacity-25 tw-cursor-not-allowed"
            disabled
          >
            {t(translations.perpetualPage.tradeForm.buttons.limit)}
          </button>
        </Tooltip>
      </div>
      <div className="tw-mb-4 tw-text-sm">
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
      <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-mb-8 tw-px-6 tw-py-1 tw-text-xs tw-font-medium tw-border tw-border-gray-5 tw-rounded-lg">
        <label>{t(translations.perpetualPage.closePosition.total)}</label>
        <AssetValue
          className="tw-text-base tw-font-semibold tw-text-trade-long"
          minDecimals={4}
          maxDecimals={4}
          mode={AssetValueMode.auto}
          value={totalToReceive}
          assetString={pair.baseAsset}
          showPositiveSign
          useTooltip
        />
      </div>
      <button
        className="tw-absolute tw-bottom-0 tw-w-full tw-min-h-10 tw-p-2 tw-text-lg tw-text-primary tw-font-medium tw-border tw-border-primary tw-bg-primary-10 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
        onClick={onSubmit}
      >
        {t(translations.perpetualPage.closePosition.button)}
      </button>
    </div>
  );
};
