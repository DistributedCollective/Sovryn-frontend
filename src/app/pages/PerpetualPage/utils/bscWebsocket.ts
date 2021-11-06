import Web3 from 'web3';
import PerpetualManager from '../components/TradingChart/IPerpetualManager.json';

// TODO: Change subscription ID to perpID + candleDuration

const web3Socket = new Web3(
  new Web3.providers.WebsocketProvider(
    'wss://ws-nd-233-405-699.p2pify.com/' +
      process.env.REACT_APP_BSC_WS_TESTNET,
  ),
);

const web3Http = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');

const jsonInput = PerpetualManager.find(item => item.name === 'Trade')?.inputs;

export function decodeLogs(
  logs: string,
  topics: string[],
): { [key: string]: string } {
  const decoded = web3Http.eth.abi.decodeLog(
    jsonInput != null ? jsonInput : [],
    logs,
    topics,
  );
  return decoded;
}

export const subscription = (
  address: string,
  topics: string[],
  fromBlock?: number,
) => {
  const options = {
    address: address,
    topics: topics,
    fromBlock: fromBlock,
  };
  return web3Socket.eth.subscribe('logs', options, (err, res) => {
    if (!err) console.error(err);
    console.log(res);
  });
};
