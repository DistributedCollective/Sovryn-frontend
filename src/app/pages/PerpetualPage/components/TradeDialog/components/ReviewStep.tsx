import React, { useContext, useCallback, useMemo } from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeDialogStep, PerpetualTxStage } from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { PerpetualPageModals } from '../../../types';
import { translations } from '../../../../../../locales/i18n';
import { Trans, useTranslation } from 'react-i18next';
import { TradeSummary } from './TradeSummary';
import { ResultPosition } from './ResultPosition';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { bridgeNetwork } from '../../../../BridgeDepositPage/utils/bridge-network';
import { Chain } from '../../../../../../types';
import { PerpetualQueriesContext } from '../../../contexts/PerpetualQueriesContext';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { usePerpetual_isTradingInMaintenance } from 'app/pages/PerpetualPage/hooks/usePerpetual_isTradingInMaintenance';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../../selectors';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';

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

  const tradePair = PerpetualPairDictionary.get(
    trade?.pairType || PerpetualPairType.BTCUSD,
  );
  const currentPairId = tradePair.id;
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { lotSize, lotPrecision } = perpetuals[currentPairId];

  const { useMetaTransactions } = useSelector(selectPerpetualPage);

  const { checkMaintenance, States } = useMaintenance();
  const isGsnInMaintenance = useMemo(
    () =>
      checkMaintenance(States.PERPETUALS) ||
      checkMaintenance(States.PERPETUALS_GSN),
    [checkMaintenance, States],
  );
  const isTradingInMaintenance = usePerpetual_isTradingInMaintenance();

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
          pair={tradePair}
          trade={trade}
          analysis={analysis}
        />
        <ResultPosition
          origin={origin}
          pair={tradePair}
          lotPrecision={lotPrecision}
          lotSize={lotSize}
          analysis={analysis}
        />
        <div className="tw-flex tw-justify-center">
          {isTradingInMaintenance ||
          (useMetaTransactions && isGsnInMaintenance) ? (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={
                    isTradingInMaintenance
                      ? translations.maintenance.perpetualsTrade
                      : translations.maintenance.perpetualsGsn
                  }
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          ) : (
            <button
              className={styles.confirmButton}
              onClick={isTradingInMaintenance ? undefined : onSubmit}
              disabled={isTradingInMaintenance}
            >
              {t(translations.perpetualPage.reviewTrade.confirm)}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
