import classNames from 'classnames';
import React, { useMemo } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { RecentTradesDataEntry } from 'types/trading-pairs';
import dayjs from 'dayjs';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { bignumber } from 'mathjs';
import { areAddressesEqual } from 'utils/helpers';
import { AssetValue } from '../AssetValue';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetValueMode } from '../AssetValue/types';

type RecentTradeRowProps = {
  row: RecentTradesDataEntry;
  isOddRow: boolean;
  baseToken: Asset;
  quoteToken: Asset;
};

export const RecentTradeRow: React.FC<RecentTradeRowProps> = ({
  row,
  isOddRow,
  baseToken,
  quoteToken,
}) => {
  const { t } = useTranslation();
  const quoteTokenAddress = getTokenContract(quoteToken).address;
  const backgroundClassName = useMemo(
    () => (isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1'),
    [isOddRow],
  );

  const isLong = useMemo(
    () => areAddressesEqual(row.loanToken.id, quoteTokenAddress),
    [row.loanToken, quoteTokenAddress],
  );

  const entryPrice = useMemo(() => {
    return isLong
      ? bignumber(1).div(row.entryPrice).toString()
      : row.entryPrice;
  }, [isLong, row.entryPrice]);

  const positionSize = useMemo(() => {
    return isLong
      ? row.positionSize
      : bignumber(1).div(row.positionSize).toString();
  }, [isLong, row.positionSize]);

  const [quoteTokenDetails, baseTokenDetails] = useMemo(
    () => [quoteToken, baseToken].map(item => AssetsDictionary.get(item)),
    [quoteToken, baseToken],
  );

  return (
    <tr
      key={row.id}
      className={classNames(
        'tw-h-6',
        isLong ? 'tw-text-trade-long' : 'tw-text-trade-short',
      )}
    >
      <td
        className={classNames(
          'tw-pl-4 tw-py-1 tw-text-left tw-font-semibold tw-rounded-l tw-whitespace-nowrap',
          backgroundClassName,
        )}
      >
        <AssetValue
          value={Number(entryPrice)}
          mode={AssetValueMode.auto}
          minDecimals={quoteTokenDetails.displayDecimals}
          maxDecimals={quoteTokenDetails.displayDecimals}
          useTooltip
        />
      </td>
      <td
        className={classNames(
          'tw-pl-2 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        <AssetValue
          value={Number(positionSize)}
          mode={AssetValueMode.auto}
          minDecimals={baseTokenDetails.displayDecimals}
          maxDecimals={baseTokenDetails.displayDecimals}
          useTooltip
        />
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-pt-1 tw-text-right tw-text-tiny',
          backgroundClassName,
        )}
      >
        {dayjs(Number(row.timestamp) * 1e3)
          .utc()
          .format('YY/MM/DD HH:mm')}
      </td>
      <td
        className={classNames(
          'tw-relative tw-pr-4 tw-pl-0 tw-py-1 tw-text-right tw-rounded-r',
          backgroundClassName,
        )}
      >
        {isLong
          ? t(translations.marginTradePage.recentTrades.long)
          : t(translations.marginTradePage.recentTrades.short)}
      </td>
    </tr>
  );
};
