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
import { TxStatus } from '../../../../../../store/global/transactions-store/types';

export const ApprovalStep: TransitionStep<TradeDialogStep> = ({ changeTo }) => {
  const { t } = useTranslation();
  const {
    transactions,
    currentTransaction,
    setCurrentTransaction,
  } = useContext(TradeDialogContext);
  const { wallet } = useWalletContext();

  const [result, setResult] = useState<CheckAndApproveResultWithError>();

  const { title, text } = useMemo(
    () =>
      getTranslations(
        t,
        result?.rejected,
        result?.error,
        currentTransaction?.index,
        transactions.length,
      ),
    [result, t, transactions.length, currentTransaction?.index],
  );

  const onRetry = useCallback(() => {
    if (!currentTransaction) {
      return;
    }
    setCurrentTransaction({
      index: currentTransaction?.index,
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
          stage: PerpetualTxStage.approvalPending,
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
          .then(result => {
            if (!result.rejected) {
              setCurrentTransaction({
                index: currentTransaction.index,
                stage: PerpetualTxStage.approvalPending,
              });
            }
            setResult(result);
          })
          .catch(error => {
            console.error(error);
          });

        // TODO FIXME: make I need to wait on the approval transaction to determine success/failure

        setCurrentTransaction({
          index: currentTransaction.index,
          stage: PerpetualTxStage.approvalPending,
        });
      }
    }
  }, [currentTransaction, transactions, setCurrentTransaction, changeTo]);

  return (
    <>
      <h1 className="tw-font-semibold">{title}</h1>
      <div className={classNames('tw-text-center', styles.contentWrapper)}>
        <WalletLogo wallet={wallet?.wallet?.getWalletType() || ''} />

        {result?.rejected && (
          <img
            src={txFailed}
            alt="failed"
            className="tw-w-8 tw-mx-auto tw-mb-4 tw-opacity-75"
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

const getTranslations = (t, rejected, error, current, count) => {
  if (rejected) {
    if (error) {
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
    } else {
      return {
        title: t(
          translations.perpetualPage.processTrade.titles.approvalRejected,
        ),
        text: (
          <p className="tw-text-warning">
            {t(
              count === 1
                ? translations.perpetualPage.processTrade.texts.rejected
                : translations.perpetualPage.processTrade.texts.rejectedMulti,
              {
                current,
                count,
              },
            )}
            <br />
            {t(translations.perpetualPage.processTrade.texts.cancelOrRetry)}
          </p>
        ),
      };
    }
  }
  return {
    title: t(translations.perpetualPage.processTrade.titles.approval),
    text: <p>{t(translations.perpetualPage.processTrade.texts.approval)}</p>,
  };
};
