import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import {
  stringToFixedPrecision,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { PairLabel } from '../PairLabel';
import { Dialog } from 'app/containers/Dialog';
import { OrderLabel } from '../OrderLabel';
import { TradingTypes } from '../../types';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useWalletContext } from '@sovryn/react-wallet';
import { LabelValuePair } from 'app/components/LabelValuePair';

interface ITradeDialogProps {
  isOpen: boolean;
  onCloseModal: () => void;
  submit: () => void;
  tradeType: TradingTypes;
  slippage?: number;
  orderType: OrderType;
  minReturn?: string;
  amount: string;
  expectedReturn: string;
  targetToken: Asset;
  sourceToken: Asset;
  limitPrice?: string;
  duration?: number;
  fee?: React.ReactNode;
  buttonLoading?: boolean;
}

export const TradeDialog: React.FC<ITradeDialogProps> = ({
  limitPrice,
  isOpen,
  onCloseModal,
  submit,
  tradeType,
  orderType,
  amount,
  expectedReturn,
  minReturn,
  targetToken,
  sourceToken,
  duration,
  fee,
  buttonLoading,
}) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);

  const pair = useMemo(
    () =>
      tradeType === TradingTypes.BUY
        ? [targetToken, sourceToken]
        : [sourceToken, targetToken],
    [sourceToken, targetToken, tradeType],
  );

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onCloseModal}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {orderType === OrderType.LIMIT
              ? t(translations.spotTradingPage.tradeDialog.limitTitle)
              : t(translations.spotTradingPage.tradeDialog.marketTitle)}
          </h1>
          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-center">
            <OrderLabel
              className="tw-text-lg tw-font-semibold tw-mb-1"
              orderType={orderType}
              tradeType={tradeType}
            />
            <PairLabel
              sourceToken={sourceToken}
              targetToken={targetToken}
              tradeType={tradeType}
            />
          </div>
          {fee && (
            <div className="tw-py-3 tw-px-4 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
              {fee}
            </div>
          )}
          <div className="tw-text-center tw-mt-1 tw-mb-2">
            {t(translations.spotTradingPage.tradeDialog.newOrderDetails)}
          </div>
          <div className="tw-py-2 tw-px-4 tw-bg-gray-5 tw-mb-16 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.orderAmount)}
              value={
                <>
                  {stringToFixedPrecision(amount, 6)}{' '}
                  <AssetRenderer asset={sourceToken} />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.receiveAmount)}
              value={
                <>
                  {expectedReturn} <AssetRenderer asset={targetToken} />
                </>
              }
            />
            {orderType === OrderType.MARKET && (
              <LabelValuePair
                label={t(translations.swap.minimumReceived)}
                value={
                  <>
                    {weiToNumberFormat(minReturn, 6)}{' '}
                    <AssetRenderer asset={targetToken} />
                  </>
                }
              />
            )}

            {orderType === OrderType.LIMIT && (
              <>
                {limitPrice && (
                  <LabelValuePair
                    label={t(
                      translations.spotTradingPage.tradeDialog.limitPrice,
                    )}
                    value={
                      <>
                        {stringToFixedPrecision(limitPrice, 8)}{' '}
                        <AssetRenderer asset={pair[1]} />
                      </>
                    }
                  />
                )}
                <LabelValuePair
                  label={t(translations.spotTradingPage.tradeDialog.duration)}
                  value={
                    <>
                      {!duration ? (
                        <span>∞</span>
                      ) : duration === 1 ? (
                        t(
                          translations.spotTradingPage.limitOrderSetting
                            .day_one,
                          { count: duration },
                        )
                      ) : (
                        t(
                          translations.spotTradingPage.limitOrderSetting
                            .day_other,
                          { count: duration },
                        )
                      )}
                    </>
                  }
                />
              </>
            )}
          </div>

          <div className="tw-mt-4">
            {spotLocked && (
              <ErrorBadge
                content={
                  <Trans
                    i18nKey={translations.maintenance.spotTrades}
                    components={[
                      <a
                        href={discordInvite}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                      >
                        x
                      </a>,
                    ]}
                  />
                }
              />
            )}
          </div>
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={submit}
            disabled={spotLocked || !connected || buttonLoading}
            data-action-id="spot-reviewDialog-submit"
          />
        </div>
      </Dialog>
    </>
  );
};
