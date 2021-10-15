import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderTypes } from '../../types';
import { translations } from 'locales/i18n';
import cn from 'classnames';

interface Props {
  value: OrderTypes;
  onChange: (value: OrderTypes) => void;
}

export function OrderType({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-items-center tw-my-4">
      <div
        className={cn('tw-cursor-pointer tw-p-2.5 tw-rounded-lg tw-mr-1', {
          'tw-bg-gray-7': value === OrderTypes.MARKET,
        })}
        onClick={() => onChange(OrderTypes.MARKET)}
      >
        {t(translations.spotTradingPage.tradeForm.market)}
      </div>
      <div
        className={cn('tw-cursor-pointer tw-p-2.5 tw-rounded-lg tw-ml-1', {
          'tw-bg-gray-7': value === OrderTypes.LIMIT,
        })}
        onClick={() => onChange(OrderTypes.LIMIT)}
      >
        {t(translations.spotTradingPage.tradeForm.limit)}
      </div>
    </div>
  );
}
