import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { weiToFixed } from 'utils/blockchain/math-helpers';

import { translations } from '../../../../../../locales/i18n';
import { TableRow } from '../TableRow/index';

export interface RewardEvent {
  amount: string;
  event: RewardEventType;
  timestamp: number;
  txHash: string;
}

export enum RewardEventType {
  DEPOSITED = 'Deposited',
  REWARD_CLAIMED = 'RewardClaimed',
  EARN_REWARD = 'EarnReward',
}

interface ITableBodyProps {
  items: RewardEvent[];
  loading: boolean;
}

export const TableBody: React.FC<ITableBodyProps> = ({ items, loading }) => {
  const { t } = useTranslation();

  const getEventType = useCallback(
    type => {
      switch (type) {
        case RewardEventType.DEPOSITED:
          return t(translations.rewardPage.historyTable.event.lendingReward);
        case RewardEventType.REWARD_CLAIMED:
          return t(translations.rewardPage.historyTable.event.liquidityReward);
        case RewardEventType.EARN_REWARD:
          return t(translations.rewardPage.historyTable.event.tradingReward);
        default:
          return type;
      }
    },
    [t],
  );
  return (
    <tbody className="tw-mt-12">
      {items.map((item, index) => (
        <TableRow
          key={index}
          time={item.timestamp}
          txHash={item.txHash}
          amount={weiToFixed(item.amount, 8)}
          type={getEventType(item.event)}
        />
      ))}

      {loading && (
        <tr key={'loading'}>
          <td colSpan={99}>
            <SkeletonRow loadingText={t(translations.topUpHistory.loading)} />
          </td>
        </tr>
      )}
      {items.length === 0 && !loading && (
        <tr key={'empty'}>
          <td className="tw-text-center" colSpan={99}>
            {t(translations.liquidityMining.historyTable.emptyState)}
          </td>
        </tr>
      )}
    </tbody>
  );
};
