import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TradingTypes } from '../../types';
import { OrderType } from 'app/components/OrderTypeTitle/types';

interface IOrderLabelProps {
  orderType: React.ReactNode;
  tradeType: React.ReactNode;
  className?: string;
}

export const OrderLabel: React.FC<IOrderLabelProps> = ({
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
      className={classNames(className, {
        'tw-text-trade-short': tradeType === TradingTypes.SELL,
        'tw-text-trade-long': tradeType === TradingTypes.BUY,
      })}
    >
      {getOrderTypeLabel()}
    </div>
  );
};
