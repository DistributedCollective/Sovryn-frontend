import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import txFailed from 'assets/images/failed-tx.svg';
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
import { WalletLogo } from '../../../../../components/UserAssets/TxDialog/WalletLogo';
import { useWalletContext } from '@sovryn/react-wallet';
import { CheckAndApproveResultWithError } from '../../../types';
import { checkAndApprove } from '../../../utils/contractUtils';
import { getContract } from '../../../../../../utils/blockchain/contract-helpers';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { Asset } from '../../../../../../types';
import classNames from 'classnames';
import { TxStatusIcon } from '../../../../../components/Dialogs/TxDialog';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../../../../store/global/transactions-store/selectors';
import { TxStatus } from '../../../../../../store/global/transactions-store/types';

export const ApprovalStep: TransitionStep<TradeDialogStep> = ({ changeTo }) => {
  const { t } = useTranslation();
  const {
    transactions,
    currentTransaction,
    setTransactions,
    setCurrentTransaction,
  } = useContext(TradeDialogContext);
  const { wallet } = useWalletContext();

  const [result, setResult] = useState<CheckAndApproveResultWithError>();
  const transactionsMap = useSelector(selectTransactions);
  const transaction = useMemo(
    () => (result?.approveTx ? transactionsMap[result.approveTx] : undefined),
    [result?.approveTx, transactionsMap],
  );

  const { title, text } = useMemo(
    () => getTranslations(t, Boolean(result?.rejected), result?.error),
    [result, t],
  );

  const onRetry = useCallback(() => {
    if (!currentTransaction) {
      return;
    }
    setCurrentTransaction({
      index: currentTransaction?.index,
      nonce: currentTransaction.nonce,
      stage: PerpetualTxStage.reviewed,
    });
    setResult(undefined);
  }, [currentTransaction, setCurrentTransaction]);

  useEffect(() => {
    if (
      currentTransaction &&
      transactions[currentTransaction.index] &&
      currentTransaction.stage === PerpetualTxStage.reviewed
    ) {
      const current = transactions[currentTransaction.index];

      if (current.method !== PerpetualTxMethods.deposit) {
        setCurrentTransaction({
          index: currentTransaction.index,
          nonce: currentTransaction.nonce,
          stage: PerpetualTxStage.approved,
        });
        changeTo(TradeDialogStep.confirmation, TransitionAnimation.slideLeft);
      } else {
        const deposit: PerpetualTxDepositMargin = current;
        checkAndApprove(
          'PERPETUALS_token',
          getContract('perpetualManager').address,
          deposit.amount,
          Asset.PERPETUALS,
        )
          .then(result => {
            if (!result.rejected) {
              setCurrentTransaction({
                index: currentTransaction.index,
                nonce: result.nonce || currentTransaction.nonce,
                stage: PerpetualTxStage.confirmed,
              });
              setTransactions(transactions =>
                transactions.map(tx => {
                  if (tx === deposit) {
                    let newDeposit = { ...deposit };
                    newDeposit.approvalTx = result.approveTx || null;
                    return newDeposit;
                  }
                  return tx;
                }),
              );
              changeTo(
                TradeDialogStep.confirmation,
                TransitionAnimation.slideLeft,
              );
            }
            setResult(result);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, [
    currentTransaction,
    transactions,
    setCurrentTransaction,
    setTransactions,
    changeTo,
  ]);

  return (
    <>
      <h1 className="tw-font-semibold">{title}</h1>
      <div className={classNames('tw-text-center', styles.contentWrapper)}>
        <WalletLogo
          className="tw-mb-8"
          wallet={wallet?.wallet?.getWalletType() || ''}
        />

        {(result?.rejected || transaction?.status === TxStatus.FAILED) && (
          <img
            className="tw-inline tw-w-8 tw-h-8 tw-mb-4"
            src={txFailed}
            alt={t(translations.common.failed)}
          />
        )}
        {text}

        {result?.rejected && (
          <div className="tw-flex tw-justify-center">
            <button className={styles.ghostButton} onClick={onRetry}>
              {t(translations.perpetualPage.processTrade.buttons.retry)}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const getTranslations = (t, rejected: boolean, error: Error | undefined) => {
  if (rejected) {
    return {
      title: t(translations.perpetualPage.processTrade.titles.approvalRejected),
      text: (
        <p className="tw-text-warning">
          {t(translations.perpetualPage.processTrade.texts.rejected)}
          <br />
          {t(translations.perpetualPage.processTrade.texts.cancelOrRetry)}
        </p>
      ),
    };
  } else if (error) {
    return {
      title: t(translations.perpetualPage.processTrade.titles.approvalFailed),
      text: (
        <p className="tw-text-warning">
          <Trans
            i18nKey={translations.perpetualPage.processTrade.texts.error}
            values={{ error: `(${error.message})` }}
            components={[<span className="tw-block">error</span>]}
          />
          <br />
          {t(translations.perpetualPage.processTrade.texts.cancelOrRetry)}
        </p>
      ),
    };
  }
  return {
    title: t(translations.perpetualPage.processTrade.titles.approval),
    text: <p>{t(translations.perpetualPage.processTrade.texts.approval)}</p>,
  };
};
