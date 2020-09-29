import { useCallback, useEffect, useRef, useState } from 'react';
import { EventData, Contract } from 'web3-eth-contract';
import { getWeb3Contract } from '../../utils/blockchain/contract-helpers';

// todo move to .env and config to make reusable
/**
 * @deprecated
 */
const OLDEST_BLOCK = 1194400;

/**
 * @deprecated use useGetContractPastEvents instead
 * @param contract
 * @param event
 */
export function useGetPastEvents(
  contract: { abi: any; address: string },
  event: string = 'allEvents',
) {
  const web3ContractRef = useRef<Contract>(null as any);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    web3ContractRef.current = getWeb3Contract(contract.address, contract.abi);
  }, [contract]);

  const fetch = useCallback(
    (
      filter = undefined,
      options = { fromBlock: OLDEST_BLOCK, toBlock: 'latest' },
    ) => {
      setLoading(true);
      web3ContractRef.current
        .getPastEvents(event, { ...options, ...{ filter } })
        .then(data => {
          setEvents(data as any);
          setLoading(false);
        })
        .catch(e => {
          setLoading(false);
          setError(e);
        });
    },
    [event],
  );

  return { events, fetch: fetch, loading, error };
}
