import React, { useEffect, useState } from 'react';
import { EventData } from 'web3-eth-contract';
import { useAccount } from '../../hooks/useAccount';
import { TradingHistoryListItems } from '../../components/TradingHistoryListItems';
import { useGetContractPastEvents } from '../../hooks/useGetContractPastEvents';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';

export function TradingHistory() {
  const account = useAccount();
  const {
    events: swapCloses,
    fetch: fetchSwapClose,
    loading: loadingSwapClose,
  } = useGetContractPastEvents('sovrynProtocol', 'CloseWithSwap');
  const {
    events: trades,
    fetch: fetchTrades,
    loading: loadingTrades,
  } = useGetContractPastEvents('sovrynProtocol', 'Trade');

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventData[]>([]);
  const [items, setItems] = useState<Array<[string, EventData[]]>>([]);

  useEffect(() => {
    if (account) {
      fetchTrades({ user: account });
      fetchSwapClose({ user: account });
    }
  }, [account, fetchTrades, fetchSwapClose]);

  useEffect(() => {
    const merged = [...swapCloses, ...trades].sort(
      (a, b) => b.blockNumber - a.blockNumber,
    );
    setEvents(merged);
  }, [swapCloses, trades]);

  useEffect(() => {
    const combined: { [key: string]: EventData[] } = {};
    events.forEach(item => {
      const loanId = item.returnValues.loanId.toLowerCase();
      if (!combined.hasOwnProperty(loanId)) {
        combined[loanId] = [];
      }
      combined[loanId].push(item);
    });

    setItems(Object.entries(combined));
  }, [events]);

  useEffect(() => {
    setLoading(loadingTrades || loadingSwapClose);
  }, [loadingTrades, loadingSwapClose]);

  if (loading && !items.length) {
    return <SkeletonRow />;
  }

  return (
    <>
      {!events.length && !loading && (
        <div style={{ padding: '20px' }}>
          You do not have any closed trades.
        </div>
      )}
      {items.map(([key, data]) => (
        <TradingHistoryListItems key={key} items={data} />
      ))}
    </>
  );
}
