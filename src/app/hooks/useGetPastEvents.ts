import { useEffect, useState } from 'react';
import { useDrizzle } from './useDrizzle';
import { useDrizzleState } from './useDrizzleState';

// todo move to .env and config to make reusable
const OLDEST_BLOCK = 1125558;

/**
 * public rsk nodes does not allow us to get events, try to use it in different way.
 * @param contractName
 * @param event
 * @param options
 */
export function useGetPastEvents(
  contractName: string,
  event: string = 'allEvents',
  options: any = { fromBlock: OLDEST_BLOCK, toBlock: 'latest' },
) {
  const initialized = useDrizzleState(state => state.drizzleStatus.initialized);
  const { contracts, web3 } = useDrizzle();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (initialized) {
      const contract = contracts[contractName];
      const yourContractWeb3 = new web3.eth.Contract(
        contract.abi,
        contract.address,
      );

      yourContractWeb3
        .getPastEvents(event, options)
        .then(data => {
          console.log('events:', data);
          setEvents(data);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized /*, event, contractName, options*/]);

  return events;
}
