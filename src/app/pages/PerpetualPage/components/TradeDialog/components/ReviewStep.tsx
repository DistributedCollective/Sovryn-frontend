import React, { useContext, useCallback } from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeDialogStep } from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { PerpetualPageModals } from '../../../types';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { TradeSummary } from './TradeSummary';
import { usePerpetual_openTrade } from '../../../hooks/usePerpetual_openTrade';
import { ResultPosition } from './ResultPosition';

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
  const { origin, trade, pair, analysis } = useContext(TradeDialogContext);
  const {
    amountChange,
    amountTarget,
    entryPrice,
    leverageTarget,
    liquidationPrice,
    marginChange,
    marginTarget,
    roe,
    tradingFee,
  } = analysis;

  const { trade: openTrade } = usePerpetual_openTrade();

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
          roe={roe}
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
