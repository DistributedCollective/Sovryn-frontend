import { useEffect, useState } from 'react';
import { toWei } from 'web3-utils';
import { Nullable, Asset } from '../../../../types';
import { useBlockSync } from '../../../hooks/useAccount';

export enum FundingHistoryAction {
  deposit = 'deposit',
  withdraw = 'withdraw',
  transfer = 'transfer',
}

export enum FundingHistoryStatus {
  pending = 'pending',
  complete = 'complete',
  confirmed = 'confirmed',
  failed = 'failed',
}

export type FundingHistoryEntry = {
  id: string;
  action: FundingHistoryAction;
  /** Date string */
  time: string;
  /** wei string */
  amount: string;
  asset: Asset;
  transactionHash: string;
  status: FundingHistoryStatus;
};

const placeholderFetch = async (
  blockId: number,
): Promise<FundingHistoryEntry[]> => {
  console.warn(
    'PlaceholderFetch used by usePerpetual_FundingHistory! NOT IMPLEMENTED YET!',
  );

  const entries: FundingHistoryEntry[] = [];

  const actions = [
    FundingHistoryAction.deposit,
    FundingHistoryAction.withdraw,
    FundingHistoryAction.transfer,
  ];
  const statuses = [
    FundingHistoryStatus.pending,
    FundingHistoryStatus.complete,
    FundingHistoryStatus.confirmed,
    FundingHistoryStatus.failed,
  ];

  for (let i = 1; i <= 14; i++) {
    const amount = toWei((Math.PI * i).toFixed(8));
    entries.push({
      id: i.toString(16),
      amount,
      asset: Asset.PERPETUALS,
      time: new Date().toISOString(),
      action: actions[i % actions.length],
      status: statuses[i % statuses.length],
      transactionHash: 'NOT IMPLEMENTED',
    });
  }

  return new Promise(resolve => resolve(entries));
};

export const usePerpetual_FundingHistory = () => {
  const blockId = useBlockSync();
  const [data, setData] = useState<Nullable<FundingHistoryEntry[]>>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: implement FundingHistory data fetching
    setLoading(true);
    placeholderFetch(blockId).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [blockId]);

  return { data, loading };
};
