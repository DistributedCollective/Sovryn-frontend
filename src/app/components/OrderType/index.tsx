import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { OrderTypes } from './types';
import cn from 'classnames';

interface IOrderTypeProps {
  value: OrderTypes;
  onChange: (value: OrderTypes) => void;
  dataActionId?: string;
}

export function OrderType({ value, onChange, dataActionId }: IOrderTypeProps) {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-items-center tw-my-3">
      <div
        className={cn(
          'tw-cursor-pointer tw-py-1 tw-px-2 tw-rounded-lg tw-bg-gray-7 hover:tw-opacity-100 tw-transition-opacity tw-duration-300 tw-text-sm',
          {
            'tw-opacity-40': value !== OrderTypes.MARKET,
          },
        )}
        onClick={() => onChange(OrderTypes.MARKET)}
        data-action-id={dataActionId ? `${dataActionId}-button-market` : ''}
      >
        {t(translations.spotTradingPage.tradeForm.market)}
      </div>
      <div
        className={cn(
          'tw-cursor-pointer tw-py-1 tw-px-2 tw-rounded-lg tw-bg-gray-7 hover:tw-opacity-100 tw-transition-opacity tw-duration-300 tw-text-sm',
          {
            'tw-opacity-40': value !== OrderTypes.LIMIT,
          },
        )}
        onClick={() => onChange(OrderTypes.LIMIT)}
        data-action-id={dataActionId ? `${dataActionId}-button-limit` : ''}
      >
        {t(translations.spotTradingPage.tradeForm.limit)}
      </div>
    </div>
  );
}
