import classNames from 'classnames';
import React, { useMemo } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { weiToNumberFormat } from 'utils/display-text/format';
import { RecentTradesDataEntry, TradePriceChange } from '../../types';
import { getPriceChangeImage, getPriceColor } from '../../utils/marginUtils';
import dayjs from 'dayjs';

type RecentTradeRowProps = {
  row: RecentTradesDataEntry;
  isOddRow: boolean;
  quoteToken: string;
  currentPrice: TradePriceChange;
};

export const RecentTradeRow: React.FC<RecentTradeRowProps> = ({
  row,
  isOddRow,
  quoteToken,
  currentPrice,
}) => {
  const { t } = useTranslation();
  const priceChangeIcon = useMemo(() => getPriceChangeImage(currentPrice), [
    currentPrice,
  ]);
  const priceColor = useMemo(() => getPriceColor(currentPrice), [currentPrice]);

  const backgroundClassName = useMemo(
    () => (isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1'),
    [isOddRow],
  );

  const isLong = useMemo(() => row.loanToken === quoteToken, [
    row.loanToken,
    quoteToken,
  ]);

  return (
    <tr
      key={row.entryPrice}
      className={classNames(
        'tw-h-6',
        isLong ? 'tw-text-trade-long' : 'tw-text-trade-short',
      )}
    >
      <td
        className={classNames(
          'tw-pl-4 tw-py-1 tw-text-left tw-font-semibold tw-rounded-l tw-whitespace-nowrap',
          backgroundClassName,
          priceColor,
        )}
      >
        {priceChangeIcon ? (
          <img
            className="tw-inline-block tw-w-2.5 tw-mr-1"
            src={priceChangeIcon}
            alt="price change arrow"
          />
        ) : (
          <span className="tw-mr-3.5" />
        )}
        {weiToNumberFormat(row.entryPrice, 1)}
      </td>
      <td
        className={classNames(
          'tw-pl-4 tw-py-1 tw-text-right',
          backgroundClassName,
          priceColor,
        )}
      >
        {weiToNumberFormat(row.positionSize, 3)}
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
          priceColor,
        )}
      >
        {dayjs(Number(row.timestamp) * 1e3).format('L')}
      </td>
      <td
        className={classNames(
          'tw-relative tw-pr-4 tw-pl-0 tw-py-1 tw-text-right tw-rounded-r',
          backgroundClassName,
          priceColor,
        )}
      >
        {isLong
          ? t(translations.marginTradePage.recentTrades.long)
          : t(translations.marginTradePage.recentTrades.short)}
      </td>
    </tr>
  );
};
