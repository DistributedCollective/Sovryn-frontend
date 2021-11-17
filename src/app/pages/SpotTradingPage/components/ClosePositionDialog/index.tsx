import React, { useMemo } from 'react';
import { translations } from 'locales/i18n';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { LimitOrder, TradingTypes } from 'app/pages/SpotTradingPage/types';
import { useTranslation } from 'react-i18next';
import { useCancelLimitOrder } from 'app/hooks/limitOrder/useLimitOrder';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { DialogButton } from 'app/components/Form/DialogButton';
import { LabelValuePair } from '../TradeDialog';
import { AssetDetails } from 'utils/models/asset-details';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Input } from 'app/components/Form/Input';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import cn from 'classnames';
import { bignumber } from 'mathjs';
interface IClosePositionDialogProps {
  item: LimitOrder;
  showModal: boolean;
  onCloseModal: () => void;
  fromToken: AssetDetails;
  toToken: AssetDetails;
  tradeType: TradingTypes;
}

export function ClosePositionDialog({
  item,
  onCloseModal,
  showModal,
  fromToken,
  toToken,
  tradeType,
}: IClosePositionDialogProps) {
  const { t } = useTranslation();
  const { cancelOrder, ...tx } = useCancelLimitOrder(
    fromToken.asset,
    item.amountIn.toString(),
  );

  const submit = () => {
    if (item.hash) {
      cancelOrder(item.hash);
    }
  };

  const pair = useMemo(() => {
    return tradeType === TradingTypes.BUY
      ? [toToken, fromToken]
      : [fromToken, toToken];
  }, [fromToken, toToken, tradeType]);

  return (
    <>
      <Dialog isOpen={showModal} onClose={() => onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.spotTradingPage.cancelDialog.title)}
          </h1>
          <div className="tw-py-4 tw-px-1 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
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
              className={cn({
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
              label={t(translations.spotTradingPage.tradeDialog.limitPrice)}
              value={
                <>
                  {toNumberFormat(
                    bignumber(item.amountOutMin.toString())
                      .div(item.amountIn.toString())
                      .toString(),
                    4,
                  )}{' '}
                  <AssetRenderer asset={toToken.asset} />
                </>
              }
            />

            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.tradeAmount)}
              value={
                <>
                  {weiToNumberFormat(item.amountIn.toString(), 6)}{' '}
                  <AssetRenderer asset={fromToken.asset} />
                </>
              }
            />
          </div>

          <div className="tw-my-8">
            <div className="tw-text-base tw-mb-1">
              {t(translations.spotTradingPage.tradeForm.amountReceived)}:
            </div>
            <Input
              value={weiToNumberFormat(item.amountOutMin.toString(), 6)}
              onChange={() => {}}
              readOnly={true}
              appendElem={<AssetRenderer asset={toToken.asset} />}
            />
          </div>

          <DialogButton
            confirmLabel={t(translations.spotTradingPage.cancelDialog.cta)}
            onConfirm={() => submit()}
            cancelLabel={t(translations.common.cancel)}
            onCancel={() => onCloseModal()}
          />
        </div>
      </Dialog>
      <TxDialog tx={tx} />
    </>
  );
}
