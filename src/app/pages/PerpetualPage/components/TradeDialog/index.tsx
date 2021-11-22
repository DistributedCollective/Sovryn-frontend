import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals, isPerpetualTradeReview } from '../../types';
import { fromWei } from 'web3-utils';
import { usePerpetual_queryPerpParameters } from '../../hooks/usePerpetual_queryPerpParameters';
import {
  calculateApproxLiquidationPrice,
  getRequiredMarginCollateral,
  getTradingFee,
  calculateLeverage,
  getTraderPnL,
} from '../../utils/perpUtils';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { usePerpetual_queryAmmState } from '../../hooks/usePerpetual_queryAmmState';
import { getTradeDirection } from '../../utils/contractUtils';
import { usePerpetual_queryTraderState } from '../../hooks/usePerpetual_queryTraderState';
import {
  TradeAnalysis,
  TradeDialogContextType,
  PerpetualTx,
  TradeDialogStep,
} from './types';
import { noop } from '../../../../constants';
import { TransitionSteps } from '../../../../containers/TransitionSteps';
import { TransitionAnimation } from '../../../../containers/TransitionContainer';
import { ReviewStep } from './components/ReviewStep';

const tradeDialogContextDefault: TradeDialogContextType = {
  pair: PerpetualPairDictionary.get(PerpetualPairType.BTCUSD),
  analysis: {
    amountChange: 0,
    amountTarget: 0,
    marginChange: 0,
    roe: 0,
    marginTarget: 0,
    leverageTarget: 0,
    entryPrice: 0,
    liquidationPrice: 0,
    tradingFee: 0,
  },
  transactions: [],
  onClose: noop,
};

export const TradeDialogContext = React.createContext<TradeDialogContextType>(
  tradeDialogContextDefault,
);

const TradeDialogStepComponents = {
  [TradeDialogStep.review]: ReviewStep,
  [TradeDialogStep.processing]: ReviewStep, // TODO implement TradeDialogStep Processing
  [TradeDialogStep.approval]: ReviewStep, // TODO implement TradeDialogStep Approval
};

export const TradeDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);

  const perpParameters = usePerpetual_queryPerpParameters();
  const ammState = usePerpetual_queryAmmState();
  const traderState = usePerpetual_queryTraderState();

  const { origin, trade, transactions } = useMemo(
    () =>
      isPerpetualTradeReview(modalOptions)
        ? modalOptions
        : { origin: undefined, trade: undefined, transactions: [] },
    [modalOptions],
  );

  const pair = useMemo(
    () =>
      PerpetualPairDictionary.get(trade?.pairType || PerpetualPairType.BTCUSD),
    [trade],
  );

  const analysis: TradeAnalysis = useMemo(() => {
    if (!trade) {
      return tradeDialogContextDefault.analysis;
    }

    let amountTarget =
      Number(fromWei(trade.amount)) * getTradeDirection(trade.position);
    let amountChange = amountTarget - traderState.marginAccountPositionBC;

    let marginTarget = trade.margin
      ? Number(fromWei(trade.margin))
      : traderState.availableCashCC +
        getRequiredMarginCollateral(
          trade.leverage,
          traderState.marginAccountPositionBC,
          amountTarget,
          perpParameters,
          ammState,
        );
    const marginChange = marginTarget - traderState.availableCashCC;

    const roe =
      getTraderPnL(traderState, ammState) /
      Math.abs(traderState.marginAccountLockedInValueQC);

    const leverageTarget = calculateLeverage(
      amountTarget,
      marginTarget,
      ammState,
    );

    const liquidationPrice = calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      amountChange,
      marginChange,
    );

    const tradingFee = getTradingFee(amountChange, perpParameters);

    console.log(trade, {
      amountChange,
      amountTarget,
      marginChange,
      roe,
      marginTarget,
      leverageTarget,
      liquidationPrice,
      tradingFee,
      entryPrice: trade.entryPrice,
    });

    return {
      amountChange,
      amountTarget,
      marginChange,
      roe,
      marginTarget,
      leverageTarget,
      liquidationPrice,
      tradingFee,
      entryPrice: trade.entryPrice,
    };
  }, [trade, traderState, perpParameters, ammState]);

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  const context: TradeDialogContextType = useMemo(
    () => ({
      origin,
      pair,
      trade,
      analysis,
      transactions,
      onClose,
    }),
    [origin, pair, trade, analysis, transactions, onClose],
  );

  if (!trade) {
    return null;
  }

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.TRADE_REVIEW}
      onClose={onClose}
    >
      <TradeDialogContext.Provider value={context}>
        <TransitionSteps<TradeDialogStep>
          active={TradeDialogStep.review}
          defaultAnimation={TransitionAnimation.slideLeft}
          steps={TradeDialogStepComponents}
        />
      </TradeDialogContext.Provider>
    </Dialog>
  );
};
