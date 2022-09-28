import classNames from 'classnames';
import React, { useMemo } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { toAssetNumberFormat, toNumberFormat } from 'utils/display-text/format';
import { RecentTradesDataEntry } from 'types/trading-pairs';
import dayjs from 'dayjs';
import { Tooltip } from '@blueprintjs/core/lib/esm/components';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { bignumber } from 'mathjs';

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
    () => row.loanToken.id.toLowerCase() === quoteTokenAddress.toLowerCase(),
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
        <Tooltip
          position="top"
          interactionKind="hover"
          content={<>{toNumberFormat(entryPrice, 18)}</>}
        >
          {toAssetNumberFormat(entryPrice, quoteToken)}
        </Tooltip>
      </td>
      <td
        className={classNames(
          'tw-pl-2 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        <Tooltip
          position="top"
          interactionKind="hover"
          content={<>{toNumberFormat(positionSize, 18)}</>}
        >
          {toAssetNumberFormat(positionSize, baseToken)}
        </Tooltip>
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
