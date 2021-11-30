import Web3 from 'web3';
import IPerpetualManager from 'utils/blockchain/abi/PerpetualManager.json';
import { AbiItem } from 'web3-utils';
import { BridgeNetworkDictionary } from '../../BridgeDepositPage/dictionaries/bridge-network-dictionary';
import { ChainId } from '../../../../types';

const wssUrl =
  process.env.REACT_APP_BSC_WS_URL +
  (process.env.REACT_APP_BSC_WS_API_KEY || '');

const web3Socket = new Web3(new Web3.providers.WebsocketProvider(wssUrl));

const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet';
const rpcAddress = BridgeNetworkDictionary.getByChainId(
  isMainnet ? ChainId.BSC_MAINNET : ChainId.BSC_TESTNET,
)?.rpc;
const web3Http = new Web3(rpcAddress || null);

const PerpetualManager = IPerpetualManager as AbiItem[];

export function decodeTradeLogs(
  logs: string,
  topics: string[],
): { [key: string]: string } {
  const jsonInput = PerpetualManager.find(item => item.name === 'Trade')
    ?.inputs;

  const decoded = web3Http.eth.abi.decodeLog(
    jsonInput !== undefined ? jsonInput : [],
    logs,
    topics,
  );
  return decoded;
}

export const subscription = (
  address: string,
  events: string[],
  fromBlock?: number,
) => {
  const topics = events.map(event =>
    web3Http.eth.abi.encodeEventSignature(
      PerpetualManager.find(item => item.name === event) || '',
    ),
  );
  let options = {
    address: address,
    topics: topics,
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
