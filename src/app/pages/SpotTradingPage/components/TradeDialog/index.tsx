import cn from 'classnames';
import React, { useCallback } from 'react';
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
import { Dialog } from 'app/containers/Dialog';
import { TradingTypes } from '../../types';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useWalletContext } from '@sovryn/react-wallet';

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
}) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);

  return (
    <>
      <Dialog isOpen={isOpen} onClose={() => onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {orderType === OrderType.LIMIT
              ? t(translations.spotTradingPage.tradeDialog.limitTitle)
              : t(translations.spotTradingPage.tradeDialog.marketTitle)}
          </h1>
          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-center">
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
            <div className="tw-py-3 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
              {fee}
            </div>
          )}
          <div className="tw-text-center tw-mt-1 tw-mb-2">
            {t(translations.spotTradingPage.tradeDialog.newOrderDetails)}
          </div>
          <div className="tw-py-2 tw-px-4 tw-bg-gray-5 sm:tw--mx-11 tw-mb-16 tw-rounded-lg tw-text-sm tw-font-light">
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
                        {stringToFixedPrecision(limitPrice, 6)}{' '}
                        <AssetRenderer asset={targetToken} />
                      </>
                    }
                  />
                )}
                <LabelValuePair
                  label={t(translations.spotTradingPage.tradeDialog.duration)}
                  value={
                    <>
                      {!duration ? (
                        <span>&#8734;</span>
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
            onConfirm={() => submit()}
            disabled={spotLocked || !connected}
            cancelLabel={t(translations.common.cancel)}
            onCancel={() => onCloseModal()}
            data-action-id="spot-reviewDialog-submit"
          />
        </div>
      </Dialog>
    </>
  );
};

interface OrderLabelProps {
  orderType: React.ReactNode;
  tradeType: React.ReactNode;
  className?: string;
}

export const OrderLabel: React.FC<OrderLabelProps> = ({
  orderType,
  tradeType,
  className,
}) => {
  const { t } = useTranslation();

  const getOrderTypeLabel = useCallback(() => {
    const orderLabel =
      orderType === OrderType.LIMIT
        ? t(translations.spotTradingPage.tradeForm.limit)
        : t(translations.spotTradingPage.tradeForm.market);

    const typeLabel =
      tradeType === TradingTypes.BUY
        ? t(translations.spotTradingPage.tradeForm.buy)
        : t(translations.spotTradingPage.tradeForm.sell);

    return `${orderLabel} ${typeLabel}`;
  }, [orderType, t, tradeType]);

  return (
    <div
      className={cn(className, {
        'tw-text-trade-short': tradeType === TradingTypes.SELL,
        'tw-text-trade-long': tradeType === TradingTypes.BUY,
      })}
    >
      {getOrderTypeLabel()}
    </div>
  );
};

interface PairLabelProps {
  targetToken: Asset;
  sourceToken: Asset;
  tradeType: TradingTypes;
  className?: string;
}

export const PairLabel: React.FC<PairLabelProps> = ({
  sourceToken,
  targetToken,
  tradeType,
  className,
}) => {
  return (
    <>
      <AssetSymbolRenderer
        asset={tradeType === TradingTypes.SELL ? sourceToken : targetToken}
        assetClassName={className}
      />
      /
      <AssetSymbolRenderer
        asset={tradeType === TradingTypes.BUY ? sourceToken : targetToken}
        assetClassName={className}
      />
    </>
  );
};

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export const LabelValuePair: React.FC<LabelValuePairProps> = props => {
  return (
    <div
      className={cn(
        'tw-flex tw-flex-row tw-mb-1 tw-justify-start tw-text-sov-white',
        props.className,
      )}
    >
      <div className="tw-w-1/2 tw-text-gray-10 sm:tw-ml-8 sm:tw-pl-2 ">
        {props.label}
      </div>
      <div className="tw-w-1/2 tw-font-medium">{props.value}</div>
    </div>
  );
};

export function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}
