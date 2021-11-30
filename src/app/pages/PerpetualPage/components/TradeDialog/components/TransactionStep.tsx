import React, { useContext, useMemo, Fragment } from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeDialogStep, PerpetualTxMethods } from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { noop } from '../../../../../constants';
import { LinkToExplorer } from '../../../../../components/LinkToExplorer';
import { TradeSummary } from './TradeSummary';
import { TxStatus } from '../../../../../../store/global/transactions-store/types';
import { TxStatusIcon } from '../../../../../components/Dialogs/TxDialog';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../../../../store/global/transactions-store/selectors';
import { Nullable } from '../../../../../../types';

export const TransactionStep: TransitionStep<TradeDialogStep> = ({
  changeTo,
}) => {
  const { t } = useTranslation();
  const {
    origin,
    trade,
    pair,
    analysis,
    transactions,
    currentTransaction,
  } = useContext(TradeDialogContext);

  const transactionsMap = useSelector(selectTransactions);

  const currentPerpetualTx = useMemo(
    () =>
      currentTransaction?.index
        ? transactions[currentTransaction.index]
        : undefined,
    [currentTransaction?.index, transactions],
  );

  const currentTransactionStatus = useMemo(() => {
    if (!currentPerpetualTx) {
      return TxStatus.NONE;
    }

    let txHash: Nullable<string> = null;
    if (currentPerpetualTx.method === PerpetualTxMethods.deposit) {
      txHash = currentPerpetualTx.tx || currentPerpetualTx.approvalTx;
    } else {
      txHash = currentPerpetualTx.tx;
    }
    return txHash ? transactionsMap[txHash].status : TxStatus.NONE;
  }, [currentPerpetualTx, transactionsMap]);

  const title = useMemo(
    () =>
      getTitle(
        t,
        currentTransactionStatus,
        (currentTransaction?.index || 0) + 1,
        transactions.length,
      ),
    [t, currentTransactionStatus, currentTransaction?.index, transactions],
  );

  return (
    <>
      <h1 className="tw-font-semibold">{title}</h1>
      <div className={styles.contentWrapper}>
        <TxStatusIcon status={currentTransactionStatus} />
        <TradeSummary origin={origin} trade={trade} pair={pair} {...analysis} />
        <div className="tw-w-full tw-p-4 tw-bg-gray-2 tw-flex tw-flex-col tw-items-center tw-rounded-xl tw-mt-4">
          {transactions.map(transaction => {
            const txStatus =
              (transaction.tx && transactionsMap[transaction.tx]?.status) ||
              TxStatus.NONE;

            if (transaction.method === PerpetualTxMethods.deposit) {
              const approvalTxStatus =
                (transaction.approvalTx &&
                  transactionsMap[transaction.approvalTx]?.status) ||
                TxStatus.NONE;
              return (
                <Fragment key={transaction.method}>
                  <LabeledTransactionHash
                    label={t(
                      translations.perpetualPage.processTrade.labels.approvalTx,
                    )}
                    txHash={transaction.approvalTx || undefined}
                    status={approvalTxStatus}
                  />
                  <LabeledTransactionHash
                    label={t(
                      translations.perpetualPage.processTrade.labels.marginTx,
                    )}
                    txHash={transaction.tx || undefined}
                    status={txStatus}
                  />
                </Fragment>
              );
            }

            return (
              <LabeledTransactionHash
                key={transaction.method}
                label={
                  transaction.method === PerpetualTxMethods.trade
                    ? t(translations.perpetualPage.processTrade.labels.tradeTx)
                    : t(translations.perpetualPage.processTrade.labels.marginTx)
                }
                status={txStatus}
              />
            );
          })}
        </div>
        <div className="tw-flex tw-justify-center">
          <button className={styles.confirmButton} onClick={noop}>
            {t(translations.perpetualPage.reviewTrade.confirm)}
          </button>
        </div>
      </div>
    </>
  );
};

type LabeledTransactionHashProps = {
  label: React.ReactNode;
  txHash?: string;
  status: TxStatus;
};

const LabeledTransactionHash: React.FC<LabeledTransactionHashProps> = ({
  label,
  txHash,
  status,
}) => (
  <div className="tw-flex tw-flex-row tw-w-full tw-justify-start tw-mb-2">
    <span className="tw-flex-auto tw-w-1/2 tw-text-left tw-text-gray-10">
      {label}
    </span>
    <span className="tw-flex-auto tw-text-sov-white tw-text-right tw-font-medium">
      {txHash && (
        <LinkToExplorer
          txHash={txHash}
          className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
        />
      )}
    </span>
    <span>
      {status !== TxStatus.NONE && (
        <TxStatusIcon className="tw-w-8 tw-h-8" status={status} isInline />
      )}
    </span>
  </div>
);

const getTitle = (t, status: TxStatus, current: number, count: number) => {
  switch (status) {
    case TxStatus.CONFIRMED:
      return t(
        count === 1
          ? translations.perpetualPage.processTrade.titles.completed
          : translations.perpetualPage.processTrade.titles.completedMulti,
        {
          current,
          count,
        },
      );
    case TxStatus.FAILED:
      return t(
        count === 1
          ? translations.perpetualPage.processTrade.titles.failed
          : translations.perpetualPage.processTrade.titles.failedMulti,
        {
          current,
          count,
        },
      );
    default:
      return t(
        count === 1
          ? translations.perpetualPage.processTrade.titles.processing
          : translations.perpetualPage.processTrade.titles.processingMulti,
        {
          current,
          count,
        },
      );
  }
};
