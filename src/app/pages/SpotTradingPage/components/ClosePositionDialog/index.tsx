import React, { useMemo, useCallback } from 'react';
import { translations } from 'locales/i18n';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { LimitOrder, TradingTypes } from 'app/pages/SpotTradingPage/types';
import { Trans, useTranslation } from 'react-i18next';
import { useCancelLimitOrder } from 'app/hooks/limitOrder/useLimitOrder';
import { DialogButton } from 'app/components/Form/DialogButton';
import { LabelValuePair, OrderLabel } from '../TradeDialog';
import { AssetDetails } from 'utils/models/asset-details';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { Toast } from 'app/components/Toast';
import { OrderType } from 'app/components/OrderTypeTitle/types';
interface IClosePositionDialogProps {
  order: LimitOrder;
  showModal: boolean;
  onCloseModal: () => void;
  fromToken: AssetDetails;
  toToken: AssetDetails;
  tradeType: TradingTypes;
}

export const ClosePositionDialog = ({
  order,
  onCloseModal,
  showModal,
  fromToken,
  toToken,
  tradeType,
}: IClosePositionDialogProps) => {
  const { t } = useTranslation();
  const { cancelOrder, ...tx } = useCancelLimitOrder(order, fromToken.asset);

  const pair = useMemo(() => {
    return tradeType === TradingTypes.BUY
      ? [toToken, fromToken]
      : [fromToken, toToken];
  }, [fromToken, toToken, tradeType]);

  const showToast = useCallback((status: string) => {
    Toast(
      status,
      <div className="tw-flex tw-items-center">
        <p className="tw-mb-0">
          <Trans
            i18nKey={
              status === 'success'
                ? translations.spotTradingPage.cancelDialog.complete
                : translations.spotTradingPage.cancelDialog.failed
            }
          />
        </p>
      </div>,
    );
  }, []);

  const txArgs = [
    order.maker,
    order.fromToken,
    order.toToken,
    order.amountIn.toString(),
    order.amountOutMin.toString(),
    order.recipient,
    order.deadline.toString(),
    order.created.toString(),
    order.v,
    order.r,
    order.s,
  ];

  return (
    <>
      <Dialog isOpen={showModal} onClose={() => onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.spotTradingPage.cancelDialog.title)}
          </h1>
          <div className="tw-py-4 tw-px-1 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-center">
            <OrderLabel
              className="tw-text-lg tw-font-semibold tw-mb-1"
              orderType={OrderType.LIMIT}
              tradeType={tradeType}
            />
            <div>
              {toNumberFormat(
                bignumber(order.amountOutMin.toString())
                  .div(order.amountIn.toString())
                  .toString(),
                4,
              )}{' '}
              <AssetRenderer asset={toToken.asset} />
            </div>
          </div>
          <div className="tw-py-4 tw-px-1 tw-bg-gray-2 sm:tw--mx-11 tw-mb-16 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.tradingPair)}
              value={
                <>
                  <AssetSymbolRenderer asset={pair[0]?.asset} />
                  /
                  <AssetSymbolRenderer asset={pair[1]?.asset} />
                </>
              }
            />
            <LabelValuePair
              className={classNames({
                'tw-text-trade-short': tradeType === TradingTypes.SELL,
                'tw-text-trade-long': tradeType === TradingTypes.BUY,
              })}
              label={t(translations.spotTradingPage.tradeDialog.orderType)}
              value={
                <>
                  {t(translations.spotTradingPage.tradeForm.limit)}{' '}
                  {tradeType === TradingTypes.BUY
                    ? t(translations.spotTradingPage.tradeForm.buy)
                    : t(translations.spotTradingPage.tradeForm.sell)}
                </>
              }
            />

            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.orderAmount)}
              value={
                <>
                  {weiToNumberFormat(order.amountIn.toString(), 6)}{' '}
                  <AssetRenderer asset={fromToken.asset} />
                </>
              }
            />

            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.receiveAmount)}
              value={
                <>
                  {weiToNumberFormat(order.amountOutMin.toString(), 6)}{' '}
                  <AssetRenderer asset={toToken.asset} />
                </>
              }
            />

            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.limitPrice)}
              value={
                <>
                  {toNumberFormat(
                    bignumber(order.amountOutMin.toString())
                      .div(order.amountIn.toString())
                      .toString(),
                    4,
                  )}{' '}
                  <AssetRenderer asset={toToken.asset} />
                </>
              }
            />
          </div>

          <DialogButton
            confirmLabel={t(translations.spotTradingPage.cancelDialog.cta)}
            onConfirm={cancelOrder}
            cancelLabel={t(translations.common.cancel)}
            onCancel={() => onCloseModal()}
          />
        </div>
      </Dialog>
      <TransactionDialog
        tx={{ ...tx, retry: cancelOrder }}
        onUserConfirmed={onCloseModal}
        action={t(translations.spotTradingPage.cancelDialog.tx.title)}
        onSuccess={() => showToast('success')}
        onError={() => showToast('error')}
        finalMessage={
          <div className="tw-text-center tw-text-lg tw-font-semibold">
            {t(translations.spotTradingPage.cancelDialog.tx.message, {
              tradeType,
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
