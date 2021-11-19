import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals, isPerpetualTradeReview } from '../../types';
import { usePerpetual_openTrade } from '../../hooks/usePerpetual_openTrade';
import styles from './index.module.scss';
import { fromWei } from 'web3-utils';
import { usePerpetual_queryPerpParameters } from '../../hooks/usePerpetual_queryPerpParameters';
import {
  calculateApproxLiquidationPrice,
  getRequiredMarginCollateral,
  getTradingFee,
  calculateLeverage,
  getTraderPnL,
} from '../../utils/perpUtils';
import { usePerpetual_marginAccountBalance } from '../../hooks/usePerpetual_marginAccountBalance';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { usePerpetual_queryAmmState } from '../../hooks/usePerpetual_queryAmmState';
import { getTradeDirection } from '../../utils/contractUtils';
import { usePerpetual_queryTraderState } from '../../hooks/usePerpetual_queryTraderState';
import { ResultPosition } from './components/ResultPosition';
import { TradeSummary } from './components/TradeSummary';
import { TradeAnalysis } from './types';

const titleMap = {
  [PerpetualPageModals.NONE]:
    translations.perpetualPage.reviewTrade.titles.newOrder,
  [PerpetualPageModals.EDIT_POSITION_SIZE]:
    translations.perpetualPage.reviewTrade.titles.newOrder,
  [PerpetualPageModals.EDIT_LEVERAGE]:
    translations.perpetualPage.reviewTrade.titles.editLeverage,
  [PerpetualPageModals.EDIT_MARGIN]:
    translations.perpetualPage.reviewTrade.titles.editMargin,
  [PerpetualPageModals.CLOSE_POSITION]:
    translations.perpetualPage.reviewTrade.titles.close,
};
export const TradeReviewDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);

  const marginAccountBalance = usePerpetual_marginAccountBalance();
  const perpParameters = usePerpetual_queryPerpParameters();
  const ammState = usePerpetual_queryAmmState();
  const traderState = usePerpetual_queryTraderState();

  const { trade: openTrade } = usePerpetual_openTrade();

  const { origin, trade } = useMemo(
    () =>
      isPerpetualTradeReview(modalOptions)
        ? modalOptions
        : { origin: undefined, trade: undefined },
    [modalOptions],
  );

  console.log(isPerpetualTradeReview(modalOptions), modalOptions);

  const pair = useMemo(
    () =>
      PerpetualPairDictionary.get(trade?.pairType || PerpetualPairType.BTCUSD),
    [trade],
  );

  const {
    amountChange,
    amountTarget,
    marginChange,
    marginTarget,
    roe,
    leverageTarget,
    entryPrice,
    liquidationPrice,
    tradingFee,
  }: TradeAnalysis = useMemo(() => {
    if (!trade) {
      return {
        amountChange: 0,
        amountTarget: 0,
        marginChange: 0,
        roe: 0,
        marginTarget: 0,
        leverageTarget: 0,
        entryPrice: 0,
        liquidationPrice: 0,
        tradingFee: 0,
      };
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

  const onSubmit = useCallback(
    () =>
      trade &&
      openTrade(
        false,
        trade?.amount,
        trade.leverage,
        trade.slippage,
        trade.position,
      ),
    [openTrade, trade],
  );

  if (!trade) {
    return null;
  }

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.TRADE_REVIEW}
      onClose={onClose}
    >
      <h1 className="tw-font-semibold">{origin && t(titleMap[origin])}</h1>
      <div className={styles.contentWrapper}>
        <TradeSummary
          origin={origin}
          trade={trade}
          amountChange={amountChange}
          amountTarget={amountTarget}
          entryPrice={entryPrice}
          leverageTarget={leverageTarget}
          liquidationPrice={liquidationPrice}
          marginChange={marginChange}
          marginTarget={marginTarget}
          roe={roe}
          pair={pair}
          tradingFee={tradingFee}
        />
        <ResultPosition
          amountChange={amountChange}
          amountTarget={amountTarget}
          entryPrice={entryPrice}
          leverageTarget={leverageTarget}
          liquidationPrice={liquidationPrice}
          marginTarget={marginTarget}
          pair={pair}
        />
        <div className="tw-flex tw-justify-center">
          <button className={styles.confirmButton} onClick={onSubmit}>
            {t(translations.perpetualPage.reviewTrade.confirm)}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
