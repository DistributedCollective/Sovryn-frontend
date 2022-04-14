import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EventData } from 'web3-eth-contract';

import { getContract } from '../../utils/blockchain/contract-helpers';
import { eventReader } from '../../utils/sovryn/event-reader';
import { ContractName } from '../../utils/types/contracts';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';

const filtersEventKeyMap = {
  Mint: 'minter',
  Burn: 'burner',
  Trade: 'user',
  Borrow: 'user',
  CloseWithSwap: 'user',
  CloseWithDeposit: 'user',
  RewardClaimed: 'user',
  EarnReward: 'receiver',
  Deposited: '_userAddress',
  RewardWithdrawn: 'receiver',
  UserFeeWithdrawn: 'sender',
  MarginOrderFilled: 'trader',
  OrderFilled: 'maker',
};

export function useGetContractPastEvents(
  contractName: ContractName,
  event: string = 'allEvents',
  filters: any = {},
) {
  const { syncBlockNumber, address } = useSelector(selectWalletProvider);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventData[]>([]);

  const getEvents = useCallback(async () => {
    const fromBlock = getContract(contractName).blockNumber;
    const toBlock = 'latest';

    if (filtersEventKeyMap.hasOwnProperty(event)) {
      filters[filtersEventKeyMap[event]] = String(address).toLowerCase();
    }

    return eventReader.getPastEvents(contractName, event, filters, {
      fromBlock,
      toBlock,
    });
  }, [address, contractName, event, filters]);

  useEffect(() => {
    let cancel = false;
    if (!address) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getEvents()
      .then(result => {
        if (cancel) return;
        setEvents(result);
        setLoading(false);
      })
      .catch(_ => {
        setEvents([]);
        setLoading(false);
      });
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, syncBlockNumber]);

  return { events, loading };
}
