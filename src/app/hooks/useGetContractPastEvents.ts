import { useSelector } from 'react-redux';
import { selectEventsState } from 'store/global/events-store/selectors';
import { useAccount } from './useAccount';
import { ContractName } from '../../utils/types/contracts';

const _default = {
  loading: true,
  loaded: false,
  events: [],
};

export function useGetContractPastEvents(
  contractName: ContractName,
  event: string = 'allEvents',
) {
  const account = useAccount();
  const eventsState = useSelector(selectEventsState);

  const _state = eventsState?.[account]?.[contractName]?.[event] || _default;

  return {
    events: _state.events || [],
    loading: _state.loading || false,
  };
}
