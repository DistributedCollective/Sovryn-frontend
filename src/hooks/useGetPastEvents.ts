import { useEffect, useState } from 'react';
import { useDrizzle } from './useDrizzle';

/**
 * public rsk nodes does not allow us to get events, try to use it in different way.
 * @param contractName
 * @param event
 * @param options
 */
export function useGetPastEvents(
  contractName: string,
  event: string = 'allEvents',
  options: any,
) {
  const { contracts, web3 } = useDrizzle();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (web3?.eth?.Contract) {
      console.log('has contract', contractName, event, options);
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
  }, [event, contractName, options, web3]);

  return events;
}
