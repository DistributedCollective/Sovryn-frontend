import React, { useContext, useCallback } from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import {
  TradeDialogStep,
  PerpetualTxStage,
  PerpetualTxMethods,
} from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { PerpetualPageModals } from '../../../types';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { TradeSummary } from './TradeSummary';
import { ResultPosition } from './ResultPosition';
import { usePerpetual_executeTransaction } from '../../../hooks/usePerpetual_executeTransaction';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { bridgeNetwork } from '../../../../BridgeDepositPage/utils/bridge-network';
import { Chain } from '../../../../../../types';

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

export const ReviewStep: TransitionStep<TradeDialogStep> = ({ changeTo }) => {
  const { t } = useTranslation();
  const {
    origin,
    trade,
    pair,
    analysis,
    transactions,
    setCurrentTransaction,
  } = useContext(TradeDialogContext);
  const {
    amountChange,
    amountTarget,
    entryPrice,
    leverageTarget,
    liquidationPrice,
    marginChange,
    marginTarget,
    partialUnrealizedPnL,
    tradingFee,
  } = analysis;

  const onSubmit = useCallback(async () => {
    // TODO: implement proper transaction execution and updating transactions
    // Temporary solution! Should be done in sequence somewhere else e.g. TradeExecutionStep (ProcessStep)
    // for (let transaction of transactions) {
    //   await execute(transaction);
    // }
    let nonce = await bridgeNetwork.nonce(Chain.BSC);

    setCurrentTransaction({
      index: 0,
      stage: PerpetualTxStage.reviewed,
      nonce,
    });

    changeTo(
      transactions[0]?.method === PerpetualTxMethods.deposit
        ? TradeDialogStep.approval
        : TradeDialogStep.confirmation,
      TransitionAnimation.slideLeft,
    );
  }, [transactions, setCurrentTransaction, changeTo]);

  return (
    <>
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
          partialUnrealizedPnL={partialUnrealizedPnL}
          marginTarget={marginTarget}
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
          origin={origin}
          pair={pair}
        />
        <div className="tw-flex tw-justify-center">
          <button className={styles.confirmButton} onClick={onSubmit}>
            {t(translations.perpetualPage.reviewTrade.confirm)}
          </button>
        </div>
      </div>
    </>
  );
};
