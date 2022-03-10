import React from 'react';
import { Dialog } from 'app/containers/Dialog';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ActionButton } from 'app/components/Form/ActionButton';
import { TradingTypes } from '../../types';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { Asset } from 'types';
import { OrderLabel } from '../OrderLabel';
import { PairLabel } from '../PairLabel';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { stringToFixedPrecision } from 'utils/display-text/format';
import { TxStatus } from 'store/global/transactions-store/types';
import { getStatusImage } from 'app/components/TransactionDialog/utils';
import classNames from 'classnames';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { prettyTx } from 'utils/helpers';

interface ILimitResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tradeType: TradingTypes;
  expectedReturn?: string;
  amount: string;
  targetToken: Asset;
  sourceToken: Asset;
  status: TxStatus;
  limitPrice: string;
  txHash: string;
  pair: Asset[];
}
export const LimitResultDialog: React.FC<ILimitResultDialogProps> = ({
  onClose,
  isOpen,
  tradeType,
  amount,
  expectedReturn,
  targetToken,
  sourceToken,
  status,
  limitPrice,
  txHash,
  pair,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-mw-340 tw-mx-auto">
        <h1>
          {getTransactionTitle(
            status,
            t(translations.spotTradingPage.tradeDialog.order),
          )}
        </h1>

        <div className={'tw-text-center tw-mx-auto tw-w-16 tw-mb-4'}>
          <img
            src={getStatusImage(status)}
            className={classNames('tw-w-16 tw-h-16', {
              'tw-animate-spin': status === TxStatus.PENDING,
            })}
            alt="Status"
          />
        </div>
        <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-center">
          <OrderLabel
            className="tw-text-lg tw-font-semibold tw-mb-1"
            orderType={OrderType.LIMIT}
            tradeType={tradeType}
          />
          <PairLabel
            sourceToken={sourceToken}
            targetToken={targetToken}
            tradeType={tradeType}
          />

          <div>
            {stringToFixedPrecision(amount, 6)}{' '}
            <AssetRenderer asset={sourceToken} />
            {limitPrice && (
              <>
                {' @ '}
                {stringToFixedPrecision(limitPrice, 6)}{' '}
                <AssetRenderer asset={pair[1]} />
              </>
            )}
          </div>
          <div>
            {t(translations.spotTradingPage.tradeForm.receive)}
            <span className="tw-ml-1">
              {expectedReturn} <AssetRenderer asset={targetToken} />
            </span>
          </div>
        </div>

        {txHash && (
          <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <div className="tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white tw-items-center">
              <div className="tw-w-1/2 tw-text-gray-10">
                {t(translations.stake.txId)}
              </div>
              <div className="tw-font-medium">
                <LinkToExplorer
                  className="tw-text-blue tw-underline tw-m-0"
                  txHash={txHash}
                  text={prettyTx(txHash)}
                  startLength={5}
                  endLength={5}
                />
              </div>
            </div>
          </div>
        )}
        <ActionButton
          onClick={onClose}
          text={t(translations.common.close)}
          className={
            'tw-max-w-7xl tw-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-lg tw-w-80 tw-mx-auto tw-mt-14'
          }
          textClassName="tw-inline-block tw-text-lg"
        />
      </div>
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
    case TxStatus.CONFIRMED:
      return (
        <Trans
          i18nKey={translations.transactionDialog.txStatus.submit}
          values={{ action }}
        />
      );
    default:
      return (
        <Trans
          i18nKey={translations.transactionDialog.txStatus.processing}
          values={{ action }}
        />
      );
  }
};
