import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { OrderType } from './types';
import classNames from 'classnames';

interface IOrderTypeProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
  dataActionId?: string;
}

export const OrderTypeTitle: React.FC<IOrderTypeProps> = ({
  value,
  onChange,
  dataActionId,
}) => {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-items-center tw-my-3">
      <div
        className={classNames(
          'tw-cursor-pointer tw-py-1 tw-px-2 tw-rounded-lg tw-bg-gray-7 hover:tw-opacity-100 tw-transition-opacity tw-duration-300 tw-text-sm',
          {
            'tw-opacity-40': value !== OrderType.MARKET,
          },
        )}
        onClick={() => onChange(OrderType.MARKET)}
        data-action-id={dataActionId ? `${dataActionId}-button-market` : ''}
      >
        {t(translations.spotTradingPage.tradeForm.market)}
      </div>
      <div
        className={classNames(
          'tw-cursor-pointer tw-py-1 tw-px-2 tw-rounded-lg tw-bg-gray-7 hover:tw-opacity-100 tw-transition-opacity tw-duration-300 tw-text-sm',
          {
            'tw-opacity-40': value !== OrderType.LIMIT,
          },
        )}
        onClick={() => onChange(OrderType.LIMIT)}
        data-action-id={dataActionId ? `${dataActionId}-button-limit` : ''}
      >
        {t(translations.spotTradingPage.tradeForm.limit)}
      </div>
    </div>
  );
};
