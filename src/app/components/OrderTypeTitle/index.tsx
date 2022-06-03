import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { OrderType } from './types';
import { WIKI_LIMIT_ORDER_WALLETS_LINK } from 'utils/classifiers';

interface IOrderTypeProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
  dataActionId?: string;
  showLimit?: boolean;
}

export const OrderTypeTitle: React.FC<IOrderTypeProps> = ({
  value,
  onChange,
  dataActionId,
  showLimit = true,
}) => {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-items-center tw-my-3 tw-space-x-2">
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
      {showLimit && (
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
      )}

      {value === OrderType.LIMIT && (
        <div>
          <a
            href={WIKI_LIMIT_ORDER_WALLETS_LINK}
            target="_blank"
            rel="noreferrer noopener"
            className="tw-text-xs tw-text-blue-2"
          >
            {t(translations.common.walletCompatibility)}
          </a>
        </div>
      )}
    </div>
  );
};
