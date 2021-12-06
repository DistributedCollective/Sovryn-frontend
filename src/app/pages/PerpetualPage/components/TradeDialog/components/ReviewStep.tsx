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
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { bridgeNetwork } from '../../../../BridgeDepositPage/utils/bridge-network';
import { Chain } from '../../../../../../types';
import { getRequiredMarginCollateral } from '../../../utils/perpUtils';
import { PerpetualQueriesContext } from '../../../contexts/PerpetualQueriesContext';
import { getSignedAmount } from '../../../utils/contractUtils';
import { TradingPosition } from '../../../../../../types/trading-position';
import { toWei } from 'web3-utils';

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
  const { origin, trade, pair, analysis, setCurrentTransaction } = useContext(
    TradeDialogContext,
  );
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
    let nonce = await bridgeNetwork.nonce(Chain.BSC);

    setCurrentTransaction({
      index: 0,
      stage: PerpetualTxStage.reviewed,
      nonce,
    });

    changeTo(
      marginChange > 0
        ? TradeDialogStep.approval
        : TradeDialogStep.confirmation,
      TransitionAnimation.slideLeft,
    );
  }, [marginChange, setCurrentTransaction, changeTo]);

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
