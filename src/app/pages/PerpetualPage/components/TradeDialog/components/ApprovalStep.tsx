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
} from '../types';
import { TradeDialogContext } from '../index';
import styles from '../index.module.scss';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation, Trans } from 'react-i18next';
import { WalletLogo } from '../../../../../components/UserAssets/TxDialog/WalletLogo';
import { useWalletContext } from '@sovryn/react-wallet';
import {
  CheckAndApproveResultWithError,
  PERPETUAL_CHAIN,
  PERPETUAL_PAYMASTER,
} from '../../../types';
import { getContract } from '../../../../../../utils/blockchain/contract-helpers';
import { TransitionAnimation } from '../../../../../containers/TransitionContainer';
import { Asset } from '../../../../../../types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../../../../../store/global/transactions-store/selectors';
import { TxStatus } from '../../../../../../store/global/transactions-store/types';
import { toWei } from '../../../../../../utils/blockchain/math-helpers';
import { useGsnCheckAndApprove } from '../../../../../hooks/useGsnCheckAndApprove';
import { selectPerpetualPage } from '../../../selectors';

export const ApprovalStep: TransitionStep<TradeDialogStep> = ({ changeTo }) => {
  const { t } = useTranslation();
  const {
    analysis,
    transactions,
    currentTransaction,
    setTransactions,
    setCurrentTransaction,
  } = useContext(TradeDialogContext);
  const { orderCost } = analysis;
  const { wallet } = useWalletContext();
  const { useMetaTransactions } = useSelector(selectPerpetualPage);
  const { checkAndApprove } = useGsnCheckAndApprove(
    PERPETUAL_CHAIN,
    'PERPETUALS_token',
    PERPETUAL_PAYMASTER,
    useMetaTransactions,
    Asset.BTCS,
  );

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

  const [current, approvalAmount] = useMemo(() => {
    const current =
      currentTransaction?.index !== undefined
        ? transactions[currentTransaction?.index]
        : undefined;

    if (current?.method === PerpetualTxMethods.deposit) {
      return [current, current.amount];
    } else if (current?.method === PerpetualTxMethods.trade) {
      return [current, toWei(orderCost * 1.1)]; // add 10% to allow for market deviation
    }
    return [undefined, '0'];
  }, [transactions, currentTransaction, orderCost]);

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
    if (!current || approvalAmount === '0') {
      setTimeout(
        () =>
          changeTo(TradeDialogStep.confirmation, TransitionAnimation.slideLeft),
        500,
      );
    }

    if (currentTransaction?.stage === PerpetualTxStage.reviewed) {
      checkAndApprove(
        getContract('perpetualManager').address,
        approvalAmount,
        current,
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
                if (tx === current) {
                  let updatedTx = { ...current };
                  updatedTx.approvalTx = result.approveTxHash || null;
                  return updatedTx;
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
        .catch(console.error);
    }
  }, [
    current,
    approvalAmount,
    currentTransaction,
    orderCost,
    checkAndApprove,
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
