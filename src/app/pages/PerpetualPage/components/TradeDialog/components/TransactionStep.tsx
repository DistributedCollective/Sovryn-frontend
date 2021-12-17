import React, { useContext, useMemo, useCallback } from 'react';
import { TransitionStep } from '../../../../../containers/TransitionSteps';
import { TradeDialogStep, PerpetualTxMethods } from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { TradeSummary } from './TradeSummary';
import {
  TxStatus,
  Transaction,
} from '../../../../../../store/global/transactions-store/types';
import { TxStatusIcon } from '../../../../../components/Dialogs/TxDialog';
import { useSelector, useDispatch } from 'react-redux';
import { selectTransactions } from '../../../../../../store/global/transactions-store/selectors';
import { actions } from '../../../slice';
import { PerpetualPageModals } from '../../../types';
import { RecentTradesContext } from '../../../contexts/RecentTradesContext';
import { ToastsContext } from 'app/pages/PerpetualPage/contexts/ToastsContext';

const TxStatusPriority = {
  [TxStatus.NONE]: 0,
  [TxStatus.CONFIRMED]: 1,
  [TxStatus.PENDING]: 2,
  [TxStatus.PENDING_FOR_USER]: 3,
  [TxStatus.FAILED]: 4,
};

export const TransactionStep: TransitionStep<TradeDialogStep> = ({
  changeTo,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    origin,
    trade,
    pair,
    analysis,
    transactions,
    currentTransaction,
  } = useContext(TradeDialogContext);
  const { trades } = useContext(RecentTradesContext);

  const { toastTransactions, setToastTransactions } = useContext(ToastsContext);

  const transactionsMap = useSelector(selectTransactions);

  const requiredTransactions: Transaction[] = useMemo(
    () =>
      transactions.reduce<Transaction[]>((acc, transaction) => {
        if (
          (transaction.method === PerpetualTxMethods.deposit ||
            transaction.method === PerpetualTxMethods.trade) &&
          transaction.approvalTx &&
          transactionsMap[transaction.approvalTx]
        ) {
          acc.push(transactionsMap[transaction.approvalTx]);
        }
        if (transaction.tx && transactionsMap[transaction.tx]) {
          acc.push(transactionsMap[transaction.tx]);

          const leverage =
            origin === PerpetualPageModals.EDIT_LEVERAGE
              ? trade?.leverage
              : undefined;

          if (!toastTransactions.find(item => item.tx === transaction.tx!)) {
            setToastTransactions(prevState => [
              ...prevState,
              { ...transaction, leverage },
            ]);
          }
        }
        return acc;
      }, []),
    [
      origin,
      setToastTransactions,
      toastTransactions,
      trade?.leverage,
      transactions,
      transactionsMap,
    ],
  );

  const currentTransactionStatus = useMemo(
    () =>
      requiredTransactions.reduce((acc, transaction) => {
        if (trades.find(trade => trade.id === transaction.transactionHash)) {
          return TxStatus.CONFIRMED;
        }
        return TxStatusPriority[acc] > TxStatusPriority[transaction.status]
          ? acc
          : transaction.status;
      }, TxStatus.NONE),
    [requiredTransactions, trades],
  );

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

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  return (
    <>
      <h1 className="tw-font-semibold">{title}</h1>
      <div className={styles.contentWrapper}>
        <TxStatusIcon status={currentTransactionStatus} />
        <TradeSummary
          origin={origin}
          trade={trade}
          pair={pair}
          analysis={analysis}
          transactions={requiredTransactions}
        />
        <div className="tw-flex tw-justify-center">
          <button className={styles.ghostButton} onClick={onClose}>
            {t(translations.perpetualPage.reviewTrade.close)}
          </button>
        </div>
      </div>
    </>
  );
};

const getTitle = (t, status: TxStatus, current: number, count: number) => {
  switch (status) {
    case TxStatus.CONFIRMED:
      return t(translations.perpetualPage.processTrade.titles.completed);
    case TxStatus.FAILED:
      return t(translations.perpetualPage.processTrade.titles.failed);
    default:
      return t(translations.perpetualPage.processTrade.titles.processing);
  }
};