import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { translations } from 'locales/i18n';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TradingPosition } from 'types/trading-position';
import { weiToNumberFormat } from 'utils/display-text/format';
import {
  isTrade,
  isDepositMargin,
  isWithdrawMargin,
  PerpetualTx,
} from '../../../TradeDialog/types';
import { PerpetualPairDictionary } from '../../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  Transaction,
  TxType,
  TxStatus,
} from '../../../../../../../store/global/transactions-store/types';

type ToastAdditionalInfoProps = {
  transaction: Transaction;
  perpetualTx: PerpetualTx;
};

export const ToastAdditionalInfo: React.FC<ToastAdditionalInfoProps> = ({
  transaction,
  perpetualTx,
}) => {
  const { t } = useTranslation();
  const { pair: pairType } = perpetualTx;

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const pagination = useMemo(
    () =>
      perpetualTx.index !== undefined &&
      perpetualTx.count !== undefined &&
      perpetualTx.count > 1 ? (
        <div className="tw-text-right">
          {perpetualTx.index + 1}/{perpetualTx.count}
        </div>
      ) : null,
    [perpetualTx],
  );

  if (transaction.type === TxType.APPROVE) {
    return t(
      transaction.status === TxStatus.CONFIRMED
        ? translations.perpetualPage.toasts.approvalComplete
        : translations.perpetualPage.toasts.approvalFailed,
    );
  }

  if (isTrade(perpetualTx)) {
    if (perpetualTx.isClosePosition) {
      return (
        <>
          {t(translations.perpetualPage.toasts.closePosition)}{' '}
          <AssetValue
            value={perpetualTx.amount}
            assetString={pair.baseAsset}
            minDecimals={0}
            maxDecimals={6}
            mode={AssetValueMode.auto}
          />
          {pagination}
        </>
      );
    }

    return (
      <>
        {t(translations.perpetualPage.toasts.market)}{' '}
        {t(
          translations.perpetualPage.toasts[
            perpetualTx.tradingPosition === TradingPosition.LONG
              ? 'buy'
              : 'sell'
          ],
        )}{' '}
        <AssetValue
          value={perpetualTx.amount}
          assetString={pair.baseAsset}
          minDecimals={0}
          maxDecimals={6}
          mode={AssetValueMode.auto}
        />
        {pagination}
      </>
    );
  }

  if (perpetualTx.target?.leverage) {
    return (
      <>
        {t(translations.perpetualPage.toasts.editLeverage, {
          leverage: perpetualTx.target.leverage,
        })}{' '}
        {pagination}
      </>
    );
  }

  if (isDepositMargin(perpetualTx)) {
    return (
      <>
        {t(translations.perpetualPage.toasts.increaseMargin)}{' '}
        <AssetValue
          minDecimals={3}
          maxDecimals={6}
          mode={AssetValueMode.auto}
          value={perpetualTx.amount}
          assetString={pair.baseAsset}
        />
        {pagination}
      </>
    );
  }

  if (isWithdrawMargin(perpetualTx)) {
    return (
      <>
        {t(translations.perpetualPage.toasts.decreaseMargin)}{' '}
        <AssetValue
          minDecimals={3}
          maxDecimals={6}
          mode={AssetValueMode.auto}
          value={perpetualTx.amount}
          assetString={pair.baseAsset}
        />
        {pagination}
      </>
    );
  }

  return null;
};
