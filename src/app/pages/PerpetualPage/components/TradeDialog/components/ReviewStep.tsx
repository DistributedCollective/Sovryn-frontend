import React, { useContext, useCallback } from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeDialogStep, PerpetualTxStage } from '../types';
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
import { PerpetualQueriesContext } from '../../../contexts/PerpetualQueriesContext';

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
  const { lotSize, lotPrecision } = useContext(PerpetualQueriesContext);

  const onSubmit = useCallback(async () => {
    let nonce = await bridgeNetwork.nonce(Chain.BSC);

    setCurrentTransaction({
      index: 0,
      stage: PerpetualTxStage.reviewed,
      nonce,
    });

    changeTo(
      analysis.marginChange > 0
        ? TradeDialogStep.approval
        : TradeDialogStep.confirmation,
      TransitionAnimation.slideLeft,
    );
  }, [analysis.marginChange, setCurrentTransaction, changeTo]);

  return (
    <>
      <h1 className="tw-font-semibold">{origin && t(titleMap[origin])}</h1>
      <div className={styles.contentWrapper}>
        <TradeSummary
          origin={origin}
          pair={pair}
          trade={trade}
          analysis={analysis}
        />
        <ResultPosition
          origin={origin}
          pair={pair}
          lotPrecision={lotPrecision}
          lotSize={lotSize}
          analysis={analysis}
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
