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
import {
  getWalletName,
  WalletLogo,
} from '../../../../../components/UserAssets/TxDialog/WalletLogo';
import { useWalletContext } from '@sovryn/react-wallet';
import classNames from 'classnames';
import { usePerpetual_transaction } from '../../../hooks/usePerpetual_transaction';
import {
  TxFailReason,
  TxStatus,
} from '../../../../../../store/global/transactions-store/types';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../../../../store/global/transactions-store/selectors';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { selectPerpetualPage } from '../../../selectors';
import { detectWeb3Wallet } from 'utils/helpers';

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
  const {
    execute,
    txHash,
    status,
    reset,
    failReason,
  } = usePerpetual_transaction(
    currentTransaction ? transactions[currentTransaction.index] : undefined,
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
        failReason,
      ),
    [
      t,
      rejected,
      transactionStatus,
      currentTransaction?.index,
      transactions.length,
      failReason,
    ],
  );

  const onTry = useCallback(() => {
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
    execute(currentTransaction.nonce).catch(error => {
      console.error(error);
      setRejected(true);
    });
  }, [
    currentTransaction,
    setCurrentTransaction,
    setTransactions,
    reset,
    execute,
  ]);

  useEffect(() => {
    onTry();
    // On mount start execution
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      changeTo(
        (currentTransaction.index + 1) % 2 === 0
          ? TradeDialogStep.confirmationEven
          : TradeDialogStep.confirmationOdd,
        TransitionAnimation.slideLeft,
      );
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
            <button className={styles.ghostButton} onClick={onTry}>
              {t(translations.perpetualPage.processTrade.buttons.retry)}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const failReasonsMapping = {
  [TxFailReason.INSUFFICIENT_USER_FUNDS]:
    translations.perpetualPage.processTrade.texts.failReasons
      .insufficientUserFunds,
  [TxFailReason.UNKNOWN]:
    translations.perpetualPage.processTrade.texts.failReasons.unknown,
};

const getTranslations = (
  t,
  rejected: boolean,
  current: number,
  count: number,
  failReason?: TxFailReason,
) => {
  const wallet = detectWeb3Wallet();

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
          {failReason && failReason !== TxFailReason.UNKNOWN ? (
            t(failReasonsMapping[failReason])
          ) : (
            <>
              {t(translations.perpetualPage.processTrade.texts.rejected)}
              <br />
              {t(translations.perpetualPage.processTrade.texts.cancelOrRetry)}
            </>
          )}
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
    text: (
      <p>
        {t(translations.perpetualPage.processTrade.texts.confirm, {
          wallet: getWalletName(wallet),
        })}
      </p>
    ),
  };
};
