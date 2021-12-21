import Web3 from 'web3';
import { Log } from 'web3-core';
import IPerpetualManager from 'utils/blockchain/abi/PerpetualManager.json';
import { AbiItem, AbiInput } from 'web3-utils';
import { BridgeNetworkDictionary } from '../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { ChainId, Nullable } from '../../../../types';
import { isMainnet, readNodes } from '../../../../utils/classifiers';

const chainId = isMainnet ? ChainId.BSC_MAINNET : ChainId.BSC_TESTNET;

const web3Socket = new Web3(readNodes[chainId]);

const rpcAddress = BridgeNetworkDictionary.getByChainId(chainId)?.rpc;
const web3Http = new Web3(rpcAddress || null);

const PerpetualManager = IPerpetualManager as AbiItem[];

type ContractEvent = {
  event: AbiItem;
  topic: string;
};

export enum PerpetualManagerEventKeys {
  'Trade' = 'Trade',
  'UpdatePrice' = 'UpdatePrice',
}

export const getPerpetualManagerEvent = (
  eventName: PerpetualManagerEventKeys,
): Nullable<ContractEvent> => {
  const event = PerpetualManager.find(item => item.name === eventName);
  if (!event) {
    return null;
  }
  const topic = web3Http.eth.abi.encodeEventSignature(event);
  return {
    event,
    topic,
  };
};

const PerpetualManagerEvents: {
  [key in PerpetualManagerEventKeys]: Nullable<ContractEvent>;
} = {
  Trade: getPerpetualManagerEvent(PerpetualManagerEventKeys.Trade),
  UpdatePrice: getPerpetualManagerEvent(PerpetualManagerEventKeys.UpdatePrice),
};

const PerpetualManagerEventsByTopic: {
  [key: string]: ContractEvent;
} = Object.values(PerpetualManagerEvents).reduce((acc, entry) => {
  if (entry) {
    acc[entry.topic] = entry;
  }
  return acc;
}, {});

export const decodePerpetualManagerLog = (
  data: Log,
): { [key: string]: string } | undefined => {
  const abi = PerpetualManagerEventsByTopic[data.topics[0]];
  return abi?.event.inputs
    ? decodeLog(abi.event.inputs, data.data, data.topics.slice(1))
    : undefined;
};

export const decodeLog = (
  params: AbiInput[],
  logs: string,
  topics: string[],
): { [key: string]: string } | undefined => {
  try {
    return web3Http.eth.abi.decodeLog(params, logs, topics);
  } catch (error) {
    console.error(error);
  }
};

export const subscription = (
  address: string,
  events: PerpetualManagerEventKeys[],
  fromBlock?: number,
) => {
  let options = {
    address: address,
    topics: [events.map(event => PerpetualManagerEvents[event]?.topic || '')],
    fromBlock,
  };
  if (fromBlock) {
    options.fromBlock = fromBlock;
  }
  return web3Socket.eth.subscribe('logs', options, (err, res) => {
    if (err) {
      console.error(err);
    }
  });
};
