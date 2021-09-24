import React from 'react';
import { translations } from 'locales/i18n';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { LimitOrder } from 'app/pages/SpotTradingPage/types';
import { useTranslation } from 'react-i18next';
import { useCancelLimitOrder } from 'app/hooks/useLimitOrder';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { DialogButton } from 'app/components/Form/DialogButton';
import { LabelValuePair } from '../TradeDialog';
import { AssetDetails } from 'utils/models/asset-details';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';

interface IClosePositionDialogProps {
  item: LimitOrder;
  showModal: boolean;
  onCloseModal: () => void;
  fromToken: AssetDetails;
  toToken: AssetDetails;
}

export function ClosePositionDialog({
  item,
  onCloseModal,
  showModal,
  fromToken,
  toToken,
}: IClosePositionDialogProps) {
  const { t } = useTranslation();
  const { cancelOrder, ...tx } = useCancelLimitOrder();

  const submit = () => {
    if (item.hash) {
      cancelOrder(item.hash);
    }
  };

  return (
    <>
      <Dialog isOpen={showModal} onClose={() => onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.closeTradingPositionHandler.title)}
          </h1>
          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.tradingPair)}
              value={
                <>
                  <AssetSymbolRenderer asset={fromToken.asset} />
                  /
                  <AssetSymbolRenderer asset={toToken.asset} />
                </>
              }
            />
          </div>

          <DialogButton
            confirmLabel={t(translations.common.confirm)}
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
