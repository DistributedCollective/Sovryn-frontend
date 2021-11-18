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
import { fromWei, toWei } from 'web3-utils';
import { usePerpetual_queryTraderState } from '../../../hooks/usePerpetual_queryTraderState';
import { usePerpetual_queryAmmState } from '../../../hooks/usePerpetual_queryAmmState';
import { usePerpetual_queryPerpParameters } from '../../../hooks/usePerpetual_queryPerpParameters';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { getTraderPnLInBC, getMidPrice } from '../../../utils/perpUtils';
import { getTradeDirection } from '../../../utils/contractUtils';
import { TradingPosition } from '../../../../../../types/trading-position';

export const TradeFormStep: TransitionStep<ClosePositionDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const traderState = usePerpetual_queryTraderState();
  const ammState = usePerpetual_queryAmmState();
  const perpParameters = usePerpetual_queryPerpParameters();
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
    unrealizedPartial,
  } = useMemo(() => {
    const amountCurrent = trade
      ? getTradeDirection(trade.position) * Number(fromWei(trade.amount))
      : 0;
    const amountChange = changedTrade
      ? getTradeDirection(changedTrade.position) *
        Number(fromWei(changedTrade.amount))
      : 0;

    const amountTarget = amountCurrent + amountChange;
    const targetFactor = amountTarget / amountCurrent;
    const marginTarget = traderState.availableCashCC * targetFactor;

    const unrealizedPartial =
      getTraderPnLInBC(traderState, ammState) * (1 - targetFactor);

    return {
      amountChange,
      amountTarget,
      marginTarget,
      unrealizedPartial,
    };
  }, [trade, changedTrade, traderState, ammState]);

  const onSubmit = useCallback(() => {
    if (!changedTrade) {
      return;
    }

    const targetTrade = {
      ...changedTrade,
      amount: toWei(Math.abs(amountTarget).toPrecision(8)),
      margin: toWei(marginTarget.toPrecision(8)),
      position:
        amountTarget >= 0 ? TradingPosition.LONG : TradingPosition.SHORT,
      entryPrice: getMidPrice(perpParameters, ammState),
    };

    dispatch(
      actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
        origin: PerpetualPageModals.CLOSE_POSITION,
        trade: targetTrade,
      }),
    );
  }, [
    dispatch,
    changedTrade,
    amountTarget,
    marginTarget,
    perpParameters,
    ammState,
  ]);

  const onChangeAmount = useCallback(
    (value: string) =>
      changedTrade && onChange({ ...changedTrade, amount: toWei(value) }),
    [onChange, changedTrade],
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
          value={Math.abs(amountChange).toPrecision(lotPrecision)}
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
          className={classNames(
            'tw-text-base tw-font-semibold',
            unrealizedPartial > 0
              ? 'tw-text-trade-long'
              : 'tw-text-trade-short',
          )}
          minDecimals={4}
          maxDecimals={4}
          mode={AssetValueMode.auto}
          value={unrealizedPartial}
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
