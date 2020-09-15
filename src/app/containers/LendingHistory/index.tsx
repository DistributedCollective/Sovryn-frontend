import React, { useEffect, useState } from 'react';
import { EventData } from 'web3-eth-contract';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { Asset } from 'types/asset';
import { useGetPastEvents } from '../../hooks/useGetPastEvents';
import { useAccount } from '../../hooks/useAccount';
import { LendingHistoryItem } from '../../components/LendingHistoryItem';

interface Props {
  asset: Asset;
}

export function LendingHistory(props: Props) {
  const account = useAccount();
  const contract = getLendingContract(props.asset);
  const {
    events: mint,
    fetch: fetchMint,
    loading: loadingMint,
  } = useGetPastEvents(contract, 'Mint');
  const {
    events: burn,
    fetch: fetchBurn,
    loading: loadingBurn,
  } = useGetPastEvents(contract, 'Burn');

  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    if (account) {
      fetchMint({ minter: account });
      fetchBurn({ burner: account });
    }
  }, [account, fetchMint, fetchBurn]);

  useEffect(() => {
    const merged = [...mint, ...burn].sort(
      (a, b) => b.blockNumber - a.blockNumber,
    );
    setEvents(merged);
  }, [mint, burn]);

  return (
    <div
      className={`my-3 ${
        (loadingMint || loadingBurn) && !events.length ? 'bp3-skeleton' : ''
      }`}
    >
      {!events.length && <div>History is empty.</div>}
      {events.map((event, index) => (
        <LendingHistoryItem key={index} item={event} />
      ))}
    </div>
  );
}
