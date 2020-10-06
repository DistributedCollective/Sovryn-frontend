import { useCallback, useState } from 'react';
import { EventData } from 'web3-eth-contract';
import { Sovryn } from '../../utils/sovryn';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';
import { appContracts } from '../../utils/blockchain/app-contracts';

export function useGetContractPastEvents(
  contractName: string,
  event: string = 'allEvents',
  blockChunkSize: number = 1000,
) {
  const { blockNumber } = useSelector(selectWalletProvider);

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const firstBlock = appContracts[contractName].blockNumber;

  const loadEvents = useCallback(
    async (
      filter = undefined,
      options = { fromBlock: firstBlock, toBlock: 100 },
    ) => {
      try {
        return await Sovryn.contracts[contractName].getPastEvents(event, {
          ...options,
          ...{ filter },
        });
      } catch (e) {
        return [];
      }
    },
    [contractName, event, firstBlock],
  );

  const fetch = useCallback(
    async (
      filter = undefined,
      options = { fromBlock: firstBlock, toBlock: 'latest' },
    ) => {
      setLoading(true);

      const start = options.fromBlock || 0;
      const end =
        options?.toBlock === 'latest'
          ? blockNumber
          : options.toBlock || blockNumber;

      const chunks = toChunks(start, end, blockChunkSize);

      if (!chunks) {
        setEvents([]);
        setLoading(false);
        setError(null);
        return;
      }

      const _events: EventData[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const [fromBlock, toBlock] = chunks[i];
        const result = await loadEvents(filter, {
          ...options,
          fromBlock,
          toBlock,
        });
        _events.push(...result);
      }
      setEvents(_events);
      setLoading(false);
      setError(null);
    },
    [blockChunkSize, blockNumber, firstBlock, loadEvents],
  );

  return { events, fetch: fetch, loading, error };
}

function toChunks(from: number, to: number, size: number) {
  let end = from;
  let array: Array<number[]> = [];
  const amount = to - from;
  const chunks = Math.floor(amount / size);
  const reminder = amount % size;

  if (chunks) {
    for (let i = 0; i < chunks; i++) {
      const chunkEnd = end + size;
      array.push([end, chunkEnd]);
      end = chunkEnd;
    }
  }
  if (reminder) {
    array.push([end, end + reminder]);
  }
  return array;
}
