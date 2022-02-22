import React from 'react';
import { Dialog } from 'app/containers/Dialog';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ActionButton } from 'app/components/Form/ActionButton';
import { TxStatus } from 'store/global/transactions-store/types';
import { getStatusImage } from 'app/components/TransactionDialog/utils';
import classNames from 'classnames';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { prettyTx } from 'utils/helpers';
import { getTransactionTitle } from 'app/pages/SpotTradingPage/components/TradeForm/LimitResultDialog';
import { TradingPosition } from 'types/trading-position';

interface ILimitResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position: TradingPosition;
  status: TxStatus;
  amount: string;
  minEntryPrice: string;
  txHash: string;
  children?: React.ReactNode;
}
export const LimitResultDialog: React.FC<ILimitResultDialogProps> = ({
  onClose,
  isOpen,
  status,
  txHash,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-w-auto md:tw-mx-7 tw-mx-2">
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
        {children}
        {txHash && (
          <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <div className="tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white tw-items-center">
              <div className="tw-w-1/2 tw-text-gray-10">
                {t(translations.stake.txId)}
              </div>
              <div className="tw-font-medium">
                <LinkToExplorer
                  txHash={txHash}
                  text={prettyTx(txHash)}
                  className="tw-text-blue tw-underline"
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
