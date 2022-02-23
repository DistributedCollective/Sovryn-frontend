import React from 'react';
import { translations } from 'locales/i18n';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { Trans, useTranslation } from 'react-i18next';
import { DialogButton } from 'app/components/Form/DialogButton';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { Toast } from 'app/components/Toast';
import { useCancelMarginLimitOrder } from 'app/hooks/limitOrder/useCancelMarginLimitOrder';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { TradingPosition } from 'types/trading-position';

const showToast = (status: string) => {
  Toast(
    status,
    <div className="tw-flex tw-items-center">
      <p className="tw-mb-0">
        <Trans
          i18nKey={
            status === 'success'
              ? translations.trading.limit.cancelDialog.complete
              : translations.trading.limit.cancelDialog.failed
          }
        />
      </p>
    </div>,
  );
};

interface IClosePositionDialogProps {
  order: MarginLimitOrder;
  showModal: boolean;
  onCloseModal: () => void;
  position: TradingPosition;
  children?: React.ReactNode;
}

export const CloseLimitPositionDialog: React.FC<IClosePositionDialogProps> = ({
  order,
  onCloseModal,
  showModal,
  position,
  children,
}) => {
  const { t } = useTranslation();
  const { cancelOrder, ...tx } = useCancelMarginLimitOrder(order);

  const txArgs = [
    order.loanId,
    order.leverageAmount.toString(),
    order.loanTokenAddress,
    order.loanTokenSent.toString(),
    order.collateralTokenSent.toString(),
    order.collateralTokenAddress,
    order.trader,
    order.minEntryPrice.toString(),
    order.loanDataBytes,
    order.deadline.toString(),
    order.createdTimestamp.toString(),
    order.v,
    order.r,
    order.s,
  ];

  return (
    <>
      <Dialog isOpen={showModal} onClose={onCloseModal}>
        <div className="tw-w-auto md:tw-mx-7 tw-mx-2">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.trading.limit.cancelDialog.title)}
          </h1>

          {children}

          <div className="tw-mw-340 tw-mx-auto tw-mt-4">
            <DialogButton
              confirmLabel={t(translations.trading.limit.cancelDialog.cta)}
              onConfirm={cancelOrder}
              cancelLabel={t(translations.common.cancel)}
              onCancel={onCloseModal}
            />
          </div>
        </div>
      </Dialog>
      <TransactionDialog
        tx={{ ...tx, retry: cancelOrder }}
        onUserConfirmed={onCloseModal}
        action={t(translations.trading.limit.cancelDialog.tx.title)}
        onSuccess={() => showToast('success')}
        onError={() => showToast('error')}
        finalMessage={
          <div className="tw-text-center tw-text-lg tw-font-semibold">
            {t(translations.trading.limit.cancelDialog.tx.message, {
              tradeType: position,
            })}
          </div>
        }
        fee={
          <TxFeeCalculator
            args={[txArgs]}
            methodName="cancelOrder"
            contractName="settlement"
          />
        }
      />
    </>
  );
};
