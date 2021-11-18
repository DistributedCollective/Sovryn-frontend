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
import { OrderTypes } from 'app/components/OrderType/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Input } from 'app/components/Form/Input';
import { useWalletContext } from '@sovryn/react-wallet';

interface ITradeDialogProps {
  isOpen: boolean;
  onCloseModal: () => void;
  submit: () => void;
  tradeType: TradingTypes;
  slippage?: number;
  orderType: OrderTypes;
  minReturn?: string;
  amount: string;
  expectedReturn: string;
  targetToken: Asset;
  sourceToken: Asset;
  limitPrice?: string;
  duration?: number;
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
}) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);

  const getOrderTypeLabel = useCallback(() => {
    const orderLabel =
      orderType === OrderTypes.LIMIT
        ? t(translations.spotTradingPage.tradeForm.limit)
        : t(translations.spotTradingPage.tradeForm.market);

    const typeLabel =
      tradeType === TradingTypes.BUY
        ? t(translations.spotTradingPage.tradeForm.buy)
        : t(translations.spotTradingPage.tradeForm.sell);

    return `${orderLabel} ${typeLabel}`;
  }, [orderType, t, tradeType]);

  return (
    <>
      <Dialog isOpen={isOpen} onClose={() => onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {orderType === OrderTypes.LIMIT
              ? t(translations.spotTradingPage.tradeDialog.limitTitle)
              : t(translations.spotTradingPage.tradeDialog.marketTitle)}
          </h1>
          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.tradingPair)}
              value={
                <>
                  <AssetSymbolRenderer
                    asset={
                      tradeType === TradingTypes.SELL
                        ? sourceToken
                        : targetToken
                    }
                  />
                  /
                  <AssetSymbolRenderer
                    asset={
                      tradeType === TradingTypes.BUY ? sourceToken : targetToken
                    }
                  />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.orderType)}
              value={getOrderTypeLabel()}
              className={cn({
                'tw-text-trade-short': tradeType === TradingTypes.SELL,
                'tw-text-trade-long': tradeType === TradingTypes.BUY,
              })}
            />
            <LabelValuePair
              label={t(translations.spotTradingPage.tradeDialog.tradeAmount)}
              value={
                <>
                  {stringToFixedPrecision(amount, 6)}{' '}
                  <AssetRenderer asset={sourceToken} />
                </>
              }
            />

            {orderType === OrderTypes.LIMIT && (
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
                      {!duration
                        ? t(
                            translations.spotTradingPage.limitOrderSetting
                              .untilCancelled,
                          )
                        : duration === 1
                        ? t(
                            translations.spotTradingPage.limitOrderSetting
                              .day_one,
                            { count: duration },
                          )
                        : t(
                            translations.spotTradingPage.limitOrderSetting
                              .day_other,
                            { count: duration },
                          )}
                    </>
                  }
                />
              </>
            )}
          </div>

          <div className="tw-my-8">
            <div className="tw-text-base tw-mb-1">
              {t(translations.spotTradingPage.tradeForm.amountReceived)}:
            </div>
            <Input
              value={expectedReturn}
              onChange={() => {}}
              readOnly={true}
              appendElem={<AssetRenderer asset={targetToken} />}
            />
            {orderType === OrderTypes.MARKET && (
              <div className="swap-btn-helper tw-flex tw-items-center tw-justify-betweenS tw-mt-2">
                <span className="tw-w-full tw-flex tw-items-center tw-justify-between tw-text-xs tw-whitespace-nowrap tw-mr-1">
                  <span>{t(translations.swap.minimumReceived)} </span>
                  <span>
                    {weiToNumberFormat(minReturn, 6)}{' '}
                    <AssetRenderer asset={targetToken} />
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* <TxFeeCalculator
            args={txArgs}
            txConfig={txConf}
            methodName="spot"
            contractName={contractName}
            condition={true}
          /> */}
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
          />
        </div>
      </Dialog>
    </>
  );
};

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export function LabelValuePair(props: LabelValuePairProps) {
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
}

export function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}
