import React, { useContext } from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeDialogStep, PerpetualTxStage } from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { noop } from '../../../../../constants';

const titleMap = {
  [PerpetualTxStage.approvalPending]:
    translations.perpetualPage.processTrade.titles.approval,
};

export const ConfirmationStep: TransitionStep<TradeDialogStep> = ({ changeTo }) => {
  const { t } = useTranslation();
  const {
    origin,
    trade,
    pair,
    analysis,
    transactions,
    currentTransaction,
  } = useContext(TradeDialogContext);

  return (
    <>
      <h1 className="tw-font-semibold">
        {currentTransaction && t(titleMap[currentTransaction.stage])}
      </h1>
      <div className={styles.contentWrapper}>
        <div className="tw-flex tw-justify-center">
          <button className={styles.confirmButton} onClick={noop}>
            {t(translations.perpetualPage.reviewTrade.confirm)}
          </button>
        </div>
      </div>
    </>
  );
};
