import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import {
  TradeDialogStep,
  PerpetualTxStage,
  PerpetualTxMethods,
  PerpetualTxDepositMargin,
} from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation, Trans } from 'react-i18next';
import { noop } from '../../../../../constants';
import { WalletLogo } from '../../../../../components/UserAssets/TxDialog/WalletLogo';
import { useWalletContext } from '@sovryn/react-wallet';
import { CheckAndApproveResultWithError } from '../../../types';
import { checkAndApprove } from '../../../utils/contractUtils';
import { getContract } from '../../../../../../utils/blockchain/contract-helpers';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { Asset } from '../../../../../../types';

const titleMap = {
  [PerpetualTxStage.approvalPending]:
    translations.perpetualPage.processTrade.titles.approval,
};

export const ApprovalStep: TransitionStep<TradeDialogStep> = ({ changeTo }) => {
  const { t } = useTranslation();
  const {
    transactions,
    currentTransaction,
    setCurrentTransaction,
  } = useContext(TradeDialogContext);
  const { wallet } = useWalletContext();

  const [result, setResult] = useState<CheckAndApproveResultWithError>();

  const text: React.ReactNode = useMemo(() => {
    if (result?.rejected) {
      if (result.error) {
        return (
          <>
            <Trans
              i18nKey={translations.perpetualPage.processTrade.texts.error}
              components={[<span className="tw-block">error</span>]}
            />
            <br />
            {t(translations.perpetualPage.processTrade.texts.cancelOrRetry)}
          </>
        );
      } else {
        return (
          <>
            {transactions.length === 1
              ? t(translations.perpetualPage.processTrade.texts.rejected)
              : t(translations.perpetualPage.processTrade.texts.rejectedMulti, {
                  current: currentTransaction?.index,
                  count: transactions.length,
                })}
            <br />
            {t(translations.perpetualPage.processTrade.texts.cancelOrRetry)}
          </>
        );
      }
    }
    return t(translations.perpetualPage.processTrade.texts.approval);
  }, [result, t, transactions.length, currentTransaction?.index]);

  useEffect(() => {
    if (
      currentTransaction &&
      transactions[currentTransaction.index] &&
      currentTransaction.stage === PerpetualTxStage.reviewed
    ) {
      const current = transactions[currentTransaction.index];

      if (current.method !== PerpetualTxMethods.deposit) {
        setCurrentTransaction({
          index: 0,
          stage: PerpetualTxStage.confirmationPending,
        });
        changeTo(TradeDialogStep.transaction, TransitionAnimation.slideLeft);
      } else {
        const deposit: PerpetualTxDepositMargin = current;
        checkAndApprove(
          'PERPETUALS_token',
          getContract('perpetualManager').address,
          deposit.amount,
          Asset.PERPETUALS,
        )
          .then(setResult)
          .catch(error => {
            console.error(error);
          });

        setCurrentTransaction({
          index: currentTransaction.index,
          stage: PerpetualTxStage.confirmationPending,
        });
      }
    }
  }, [currentTransaction, transactions, setCurrentTransaction, changeTo]);

  return (
    <div className={styles.contentWrapper}>
      <h1 className="tw-font-semibold">
        {currentTransaction && t(titleMap[currentTransaction.stage])}
      </h1>
      <WalletLogo wallet={wallet?.wallet?.getWalletType() || ''} />

      <p>{text}</p>

      {result?.rejected && (
        <div className="tw-flex tw-justify-center">
          <button className={styles.confirmButton} onClick={noop}>
            {t(translations.perpetualPage.processTrade.buttons.retry)}
          </button>
        </div>
      )}
    </div>
  );
};
