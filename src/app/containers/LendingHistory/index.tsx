import React, { useEffect, useState } from 'react';
import { EventData } from 'web3-eth-contract';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { Asset } from 'types/asset';
import { useAccount } from '../../hooks/useAccount';
import { LendingHistoryItem } from '../../components/LendingHistoryItem';
import { useGetContractPastEvents } from '../../hooks/useGetContractPastEvents';

interface Props {
  asset: Asset;
}

export function LendingHistory(props: Props) {
  const account = useAccount();
  const contract = getLendingContractName(props.asset);
  const {
    events: mint,
    fetch: fetchMint,
    loading: loadingMint,
  } = useGetContractPastEvents(contract, 'Mint');
  const {
    events: burn,
    fetch: fetchBurn,
    loading: loadingBurn,
  } = useGetContractPastEvents(contract, 'Burn');

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
