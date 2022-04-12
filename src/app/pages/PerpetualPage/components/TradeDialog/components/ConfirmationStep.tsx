import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import txFailed from 'assets/images/failed-tx.svg';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeDialogStep, PerpetualTxStage } from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { WalletLogo } from '../../../../../components/UserAssets/TxDialog/WalletLogo';
import { useWalletContext } from '@sovryn/react-wallet';
import classNames from 'classnames';
import { usePerpetual_executeTransaction } from '../../../hooks/usePerpetual_executeTransaction';
import { TxStatus } from '../../../../../../store/global/transactions-store/types';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../../../../store/global/transactions-store/selectors';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { selectPerpetualPage } from '../../../selectors';

export const ConfirmationStep: TransitionStep<TradeDialogStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();
  const {
    transactions,
    currentTransaction,
    setTransactions,
    setCurrentTransaction,
  } = useContext(TradeDialogContext);
  const { useMetaTransactions } = useSelector(selectPerpetualPage);
  const { wallet } = useWalletContext();
  const { execute, txHash, status, reset } = usePerpetual_executeTransaction(
    useMetaTransactions,
  );

  const transactionsMap = useSelector(selectTransactions);

  const transactionStatus = useMemo(
    () => (txHash ? transactionsMap[txHash]?.status : status),
    [txHash, transactionsMap, status],
  );

  const [rejected, setRejected] = useState(false);

  const { title, text } = useMemo(
    () =>
      getTranslations(
        t,
        rejected || transactionStatus === TxStatus.FAILED,
        (currentTransaction?.index || 0) + 1,
        transactions.length,
      ),
    [
      t,
      rejected,
      transactionStatus,
      transactions.length,
      currentTransaction?.index,
    ],
  );

  const onRetry = useCallback(() => {
    if (!currentTransaction) {
      return;
    }

    setTransactions(transactions =>
      transactions.map((transaction, index) =>
        index === currentTransaction?.index
          ? { ...transaction, tx: null }
          : transaction,
      ),
    );
    setCurrentTransaction({
      index: currentTransaction.index,
      nonce: currentTransaction.nonce,
      stage: PerpetualTxStage.approved,
    });

    setRejected(false);
    reset?.();
  }, [currentTransaction, setCurrentTransaction, setTransactions, reset]);

  useEffect(() => {
    if (
      (status === undefined || status === TxStatus.NONE) &&
      currentTransaction &&
      transactions[currentTransaction.index] &&
      !transactions[currentTransaction.index].tx
    ) {
      const current = transactions[currentTransaction.index];
      execute(current, currentTransaction.nonce).catch(() => {
        setRejected(true);
      });
    }
  }, [status, currentTransaction, transactions, execute]);

  useEffect(() => {
    if (!currentTransaction || !txHash) {
      return;
    }
    setTransactions(transactions =>
      transactions.map((transaction, index) =>
        index === currentTransaction.index
          ? { ...transaction, tx: txHash }
          : transaction,
      ),
    );

    if (currentTransaction.index + 1 < transactions.length) {
      setCurrentTransaction({
        index: currentTransaction.index + 1,
        nonce: currentTransaction.nonce + 1,
        stage: PerpetualTxStage.reviewed,
      });
      changeTo(TradeDialogStep.confirmation, TransitionAnimation.slideLeft);
    } else {
      setCurrentTransaction({
        index: currentTransaction.index,
        nonce: currentTransaction.nonce + 1,
        stage: PerpetualTxStage.confirmed,
      });
      changeTo(TradeDialogStep.transaction, TransitionAnimation.slideLeft);
    }
    reset?.();
  }, [
    txHash,
    currentTransaction,
    transactions,
    setCurrentTransaction,
    setTransactions,
    changeTo,
    reset,
  ]);

  return (
    <>
      <h1 className="tw-font-semibold">{title}</h1>
      <div className={classNames('tw-text-center', styles.contentWrapper)}>
        <WalletLogo
          className="tw-mb-8"
          wallet={wallet?.wallet?.getWalletType() || ''}
        />

        {transactionStatus === TxStatus.FAILED && (
          <img
            className="tw-inline tw-w-8 tw-h-8 tw-mb-4"
            src={txFailed}
            alt={t(translations.common.failed)}
          />
        )}
        {text}

        {(rejected || transactionStatus === TxStatus.FAILED) && (
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

const getTranslations = (
  t,
  rejected: boolean,
  current: number,
  count: number,
) => {
  if (rejected) {
    return {
      title: t(
        count === 1
          ? translations.perpetualPage.processTrade.titles.confirmRejected
          : translations.perpetualPage.processTrade.titles.confirmMultiRejected,
        {
          current,
          count,
        },
      ),
      text: (
        <p className="tw-text-warning">
          {t(translations.perpetualPage.processTrade.texts.rejected)}
          <br />
          {t(translations.perpetualPage.processTrade.texts.cancelOrRetry)}
        </p>
      ),
    };
  }
  return {
    title: t(
      count === 1
        ? translations.perpetualPage.processTrade.titles.confirm
        : translations.perpetualPage.processTrade.titles.confirmMulti,
      {
        current,
        count,
      },
    ),
    text: <p>{t(translations.perpetualPage.processTrade.texts.confirm)}</p>,
  };
};
