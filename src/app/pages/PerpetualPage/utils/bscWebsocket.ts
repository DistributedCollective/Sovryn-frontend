import Web3 from 'web3';
import { Log } from 'web3-core';
import IPerpetualManager from 'utils/blockchain/abi/PerpetualManager.json';
import { AbiItem, AbiInput } from 'web3-utils';
import { BridgeNetworkDictionary } from '../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { ChainId, Nullable } from '../../../../types';
import { isMainnet, rpcNodes } from '../../../../utils/classifiers';

const chainId = isMainnet ? ChainId.BSC_MAINNET : ChainId.BSC_TESTNET;

let web3Socket: Web3;
export const getWeb3Socket = () => {
  if (!web3Socket) {
    const provider = new Web3.providers.WebsocketProvider(rpcNodes[chainId], {
      timeout: 10000, // 10s
      clientConfig: {
        keepalive: true,
        keepaliveInterval: -1, // indefinite
      },
      reconnect: {
        auto: true,
        delay: 10000, // 10s
        maxAttempts: Number.POSITIVE_INFINITY,
        onTimeout: false,
      },
    });
    web3Socket = new Web3(provider);
  }

  return web3Socket;
};

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
  'Liquidate' = 'Liquidate',
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
  Liquidate: getPerpetualManagerEvent(PerpetualManagerEventKeys.Liquidate),
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
  const web3 = getWeb3Socket();
  let options = {
    address: address,
    topics: [events.map(event => PerpetualManagerEvents[event]?.topic || '')],
    fromBlock,
  };
  if (fromBlock) {
    options.fromBlock = fromBlock;
  }
  return web3.eth.subscribe('logs', options, (err, res) => {
    if (err) {
      console.error(err);
    }
  });
};
