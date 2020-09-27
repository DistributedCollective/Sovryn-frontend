import React, { useEffect, useState } from 'react';
import { EventData } from 'web3-eth-contract';
import { useGetPastEvents } from '../../hooks/useGetPastEvents';
import { useAccount } from '../../hooks/useAccount';
import { appContracts } from '../../../utils/blockchain/app-contracts';
import { HistoryLoanTable } from '../../components/HistoryLoanTable';

export function TradingHistory() {
  const account = useAccount();
  const contract = appContracts.sovrynProtocol;
  const {
    events: swapCloses,
    fetch: fetchSwapClose,
    loading: loadingSwapClose,
  } = useGetPastEvents(contract, 'CloseWithSwap');
  const {
    events: trades,
    fetch: fetchTrades,
    loading: loadingTrades,
  } = useGetPastEvents(contract, 'Trade');

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

  console.log(events);
  // @ts-ignore
  return (
    <div className={loading ? 'bp3-skeleton' : ''}>
      {!events.length && (
        <div style={{ padding: '20px' }}>
          You do not have any closed trades.
        </div>
      )}
      {/*{items.map(([key, data]) => (
        <TradingHistoryListItems key={key} items={data} />
      ))}*/}
      {events.length > 0 && <HistoryLoanTable data={items} />}
    </div>
  );
}
