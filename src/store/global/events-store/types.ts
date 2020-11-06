/* --- STATE --- */
import { EventData } from 'web3-eth-contract';
import { ContractName } from 'utils/types/contracts';

export interface EventsStoreState {
  [address: string]: ContractNameToEventName;
}

export type ContainerState = EventsStoreState;

export interface ContractNameToEventName {
  [contractName: string]: ContractToEvent;
}

export interface ContractToEvent {
  [eventName: string]: EventLogData;
}

export interface EventLogData {
  events: EventData[];
  loading: boolean;
  loaded: boolean;
  fromBlock: number;
  toBlock: number;
}

export interface LoadEventsParams {
  contractName: ContractName;
  address: string;
  eventName: string;
  filters?: { [key: string]: any };
}
