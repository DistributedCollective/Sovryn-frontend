import classNames from 'classnames';
import React, { useMemo } from 'react';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { weiToNumberFormat } from 'utils/display-text/format';
import { RecentTradesDataEntry } from 'types/trading-pairs';
import dayjs from 'dayjs';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Tooltip } from '@blueprintjs/core/lib/esm/components';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

type RecentTradeRowProps = {
  row: RecentTradesDataEntry;
  isOddRow: boolean;
  quoteToken: Asset;
};

export const RecentTradeRow: React.FC<RecentTradeRowProps> = ({
  row,
  isOddRow,
  quoteToken,
}) => {
  const { t } = useTranslation();
  const quoteTokenAddress = getTokenContract(quoteToken).address;
  const backgroundClassName = useMemo(
    () => (isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1'),
    [isOddRow],
  );

  const isLong = useMemo(() => row.loanToken === quoteTokenAddress, [
    row.loanToken,
    quoteTokenAddress,
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
        )}
      >
        <Tooltip
          position="top"
          interactionKind="hover"
          content={<>{weiTo18(row.entryPrice)}</>}
        >
          {weiToNumberFormat(row.entryPrice, 3)}
        </Tooltip>
      </td>
      <td
        className={classNames(
          'tw-pl-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        <Tooltip
          position="top"
          interactionKind="hover"
          content={<>{weiTo18(row.positionSize)}</>}
        >
          {weiToNumberFormat(row.positionSize, 3)}
        </Tooltip>
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        {dayjs(Number(row.timestamp) * 1e3).format('L')}
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
