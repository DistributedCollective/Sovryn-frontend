import React, { useCallback, useEffect, useMemo } from 'react';
import { Dialog } from 'app/containers/Dialog';
import { ResetTxResponseInterface } from '../../hooks/useSendContractTx';
import { TxStatus } from 'store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from 'utils/helpers';
import txFailed from 'assets/images/failed-tx.svg';

import { LinkToExplorer } from '../LinkToExplorer';
import styles from './dialog.module.scss';
import { useWalletContext } from '@sovryn/react-wallet';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { usePrevious } from '../../hooks/usePrevious';
import { ActionButton } from 'app/components/Form/ActionButton';
import cn from 'classnames';
import { getStatusImage } from './utils';
import { WalletLogo } from './WalletLogo';
import { getWalletName } from '../UserAssets/TxDialog/WalletLogo';
import { TradingPosition } from 'types/trading-position';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { TradingTypes } from 'app/pages/SpotTradingPage/types';
import { LoadableValue } from '../LoadableValue';
import { fromWei } from 'utils/blockchain/math-helpers';
import { AssetRenderer } from '../AssetRenderer';
import { PricePrediction } from 'app/containers/MarginTradeForm/PricePrediction';
import { OrderTypes } from '../OrderType/types';
import { TradingPair } from 'utils/models/trading-pair';
import { Asset } from 'types';

interface ITransactionDialogProps {
  tx: ResetTxResponseInterface;
  onUserConfirmed?: () => void;
  onSuccess?: () => void;
  action?: string;
  fee?: React.ReactNode;
  finalMessage?: React.ReactNode;
  data?: {
    position: TradingPosition;
    leverage: number;
    orderTypeValue: OrderTypes;
    pair: TradingPair;
    amount: string;
    collateral: Asset;
    loanToken: Asset;
    collateralToken: Asset;
    useLoanTokens: boolean;
  };
}

export const TransactionDialog: React.FC<ITransactionDialogProps> = ({
  tx,
  onUserConfirmed,
  onSuccess,
  action,
  fee,
  finalMessage,
  data,
}) => {
  const { t } = useTranslation();
  const { address } = useWalletContext();

  const onClose = useCallback(() => tx.reset(), [tx]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  const oldStatus = usePrevious(tx.status);

  useEffect(() => {
    if (
      oldStatus === TxStatus.PENDING_FOR_USER &&
      tx.status === TxStatus.PENDING &&
      onUserConfirmed
    ) {
      onUserConfirmed();
    }
  }, [oldStatus, tx.status, onUserConfirmed]);

  useEffect(() => {
    if (tx.status === TxStatus.CONFIRMED && onSuccess) {
      onSuccess();
    }
  }, [tx.status, onSuccess]);

  return (
    <Dialog isOpen={tx.status !== TxStatus.NONE} onClose={onClose}>
      {tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>
          <WalletLogo wallet={wallet} />
          <p className="tw-text-center tw-mx-auto tw-w-full tw-mt-2 tw-px-6 tw-mb-0">
            {t(translations.transactionDialog.pendingUser.text, {
              walletName: getWalletName(wallet),
            })}
          </p>
        </>
      )}
      {[TxStatus.FAILED].includes(tx.status) && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>
          <WalletLogo wallet={wallet} />
          <img
            src={txFailed}
            alt="failed"
            className="tw-w-8 tw-mx-auto tw-mb-4 tw-opacity-75"
          />
          <p className="tw-text-center tw-text-warning">
            <Trans i18nKey={translations.transactionDialog.txStatus.aborted} />
          </p>
          {wallet === 'ledger' && (
            <p className="tw-text-center tw-text-warning">
              {t(translations.transactionDialog.txStatus.abortedLedger)}
            </p>
          )}
          {tx.retry && (
            <ActionButton
              text={t(translations.transactionDialog.pendingUser.retry)}
              onClick={tx.retry}
              className={cn(
                styles.submit,
                'tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto',
              )}
              textClassName="tw-inline-block tw-text-lg"
            />
          )}
        </>
      )}
      {[TxStatus.PENDING, TxStatus.CONFIRMED].includes(tx.status) && (
        <>
          <h1>{getTransactionTitle(tx.status, action)}</h1>

          <div className={'tw-text-center tw-mx-auto tw-w-16 tw-mb-4'}>
            <img
              src={getStatusImage(tx.status)}
              className={cn('tw-w-16 tw-h-16', {
                'tw-animate-spin': tx.status === TxStatus.PENDING,
              })}
              alt="Status"
            />
          </div>
          <div className="tw-px-8">
            {finalMessage && (
              <div className="tw-w-full tw-rounded-xl tw-bg-gray-2 tw-px-6 tw-py-4 tw-mb-4">
                {finalMessage}
              </div>
            )}

            {data && (
              <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
                <div
                  className={cn(
                    'tw-text-center tw-font-medium tw-lowercase tw-text-xl',
                    {
                      'tw-text-trade-short':
                        data.position === TradingPosition.SHORT,
                      'tw-text-trade-long':
                        data.position === TradingPosition.LONG,
                    },
                  )}
                >
                  {toNumberFormat(data.leverage) + 'x'} {data.orderTypeValue}{' '}
                  {data.position === TradingPosition.LONG
                    ? TradingTypes.BUY
                    : TradingTypes.SELL}
                </div>
                <div className="tw-text-center tw-my-1">
                  {data.pair.chartSymbol}
                </div>
                <div className="tw-flex tw-justify-center tw-items-center">
                  <LoadableValue
                    loading={false}
                    value={
                      <div className="tw-mr-1">
                        {weiToNumberFormat(data.amount, 4)}
                      </div>
                    }
                    tooltip={fromWei(data.amount)}
                  />{' '}
                  <AssetRenderer asset={data.collateral} />
                  <div className="tw-px-1">&#64; &ge;</div>
                  <PricePrediction
                    position={data.position}
                    leverage={data.leverage}
                    loanToken={data.loanToken}
                    collateralToken={data.collateralToken}
                    useLoanTokens={data.useLoanTokens}
                    weiAmount={data.amount}
                  />
                </div>
              </div>
            )}

            {tx.txHash && (
              <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
                {fee && <>{fee}</>}
                <div className="tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white tw-items-center">
                  <div className="tw-w-1/2 tw-text-gray-10 tw-text-gray-10">
                    {t(translations.stake.txId)}
                  </div>
                  <div className="sm:tw-w-1/3 tw-w-1/2 tw-font-medium">
                    <LinkToExplorer
                      txHash={tx.txHash}
                      text={prettyTx(tx.txHash)}
                      className="tw-text-blue tw-underline"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <ActionButton
            onClick={onClose}
            text={t(translations.common.close)}
            className={
              'tw-max-w-7xl tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto tw-mt-16'
            }
            textClassName="tw-inline-block tw-text-lg"
          />
        </>
      )}
    </Dialog>
  );
};

export const getTransactionTitle = (tx: TxStatus, action: string = '') => {
  switch (tx) {
    case TxStatus.FAILED:
      return (
        <Trans
          i18nKey={translations.transactionDialog.pendingUser.failed}
          values={{ action }}
        />
      );
    case TxStatus.PENDING_FOR_USER:
      return (
        <Trans
          i18nKey={translations.transactionDialog.pendingUser.title}
          values={{ action }}
        />
      );
    case TxStatus.PENDING:
      return (
        <Trans i18nKey={translations.transactionDialog.txStatus.processing} />
      );
    case TxStatus.CONFIRMED:
      return (
        <Trans i18nKey={translations.transactionDialog.txStatus.complete} />
      );
    default:
      return (
        <Trans i18nKey={translations.transactionDialog.txStatus.processing} />
      );
  }
};
