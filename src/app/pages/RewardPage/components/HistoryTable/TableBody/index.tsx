import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';

import { translations } from '../../../../../../locales/i18n';
import { TableRow } from '../TableRow/index';
import { Asset } from 'types';
import { lendingPools } from 'app/pages/RewardPage/helpers';
import { getFeesEarnedAsset } from 'app/pages/RewardPage/hooks/useGetFeesEarnedEvents';

export interface RewardEvent {
  amount: string;
  event: RewardEventType;
  poolToken: string;
  timestamp: number;
  txHash: string;
  token?: string;
}

export enum RewardEventType {
  DEPOSITED = 'Deposited',
  REWARD_CLAIMED = 'RewardClaimed',
  EARN_REWARD = 'EarnReward',
  REWARD_WITHDRAWN = 'RewardWithdrawn',
  PAY_TRADING_FEE_TO_AFFILIATE = 'PayTradingFeeToAffiliate',
  USER_FEE_WITHDRAWN = 'UserFeeWithdrawn',
  WITHDRAW_AFFILIATES_REFERRER_TOKEN_FEES = 'WithdrawAffiliatesReferrerTokenFees',
}

interface ITableBodyProps {
  items: RewardEvent[];
  loading: boolean;
}

export const TableBody: React.FC<ITableBodyProps> = ({ items, loading }) => {
  const { t } = useTranslation();

  const getEventType = useCallback(
    item => {
      switch (item.event) {
        case RewardEventType.REWARD_CLAIMED:
          return lendingPools.includes(item.poolToken?.toLowerCase())
            ? t(translations.rewardPage.historyTable.event.lendingReward)
            : t(translations.rewardPage.historyTable.event.liquidityReward);
        case RewardEventType.EARN_REWARD:
          return t(translations.rewardPage.historyTable.event.tradingReward);
        case RewardEventType.REWARD_WITHDRAWN:
          return t(translations.rewardPage.historyTable.event.stakingReward);
        case RewardEventType.PAY_TRADING_FEE_TO_AFFILIATE:
        case RewardEventType.WITHDRAW_AFFILIATES_REFERRER_TOKEN_FEES:
          return t(translations.rewardPage.historyTable.event.referralReward);
        case RewardEventType.USER_FEE_WITHDRAWN:
          return t(translations.rewardPage.historyTable.event.feesReward);
        default:
          return item.event;
      }
    },
    [t],
  );

  const getEventAsset = useCallback((type, token) => {
    if (type !== RewardEventType.USER_FEE_WITHDRAWN) {
      return Asset.SOV;
    }
    return getFeesEarnedAsset(token);
  }, []);

  return (
    <tbody className="tw-mt-12">
      {items.map((item, index) => (
        <TableRow
          key={index}
          time={item.timestamp}
          txHash={item.txHash}
          amount={item.amount}
          type={getEventType(item)}
          asset={getEventAsset(item.event, item.token)}
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
