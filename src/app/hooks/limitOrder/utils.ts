import { MarginOrder } from './../../pages/MarginTradePage/helpers';
import { Order } from 'app/pages/SpotTradingPage/helpers';
import { getContract } from 'utils/blockchain/contract-helpers';
import { walletService } from '@sovryn/react-wallet';
import Web3 from 'web3';

export async function signTypeData(order: Order, account: string, chainId) {
  const msgParams = JSON.stringify({
    domain: {
      name: 'OrderBook',
      version: '1',
      chainId,
      verifyingContract: getContract('orderBook').address,
    },

    message: {
      maker: order.maker,
      fromToken: order.fromToken,
      toToken: order.toToken,
      amountIn: Web3.utils.toBN(order.amountIn).toString(),
      amountOutMin: Web3.utils.toBN(order.amountOutMin).toString(),
      recipient: order.recipient,
      deadline: Web3.utils.toBN(order.deadline).toString(),
      created: Web3.utils.toBN(order.created).toString(),
    },
    primaryType: 'Order',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Order: [
        { name: 'maker', type: 'address' },
        { name: 'fromToken', type: 'address' },
        { name: 'toToken', type: 'address' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOutMin', type: 'uint256' },
        { name: 'recipient', type: 'address' },
        { name: 'deadline', type: 'uint256' },
        { name: 'created', type: 'uint256' },
      ],
    },
  });

  return new Promise((resolve, reject) => {
    walletService
      .request({
        method: 'eth_signTypedData_v4',
        params: [account, msgParams],
      })
      .then(res => {
        console.log('res: ', res);
        resolve(res);
      })
      .catch(err => reject(err));
  });
}

export async function signTypeMarginOrderData(
  order: MarginOrder,
  account: string,
  chainId,
) {
  const msgParams = JSON.stringify({
    domain: {
      name: 'OrderBookMargin',
      version: '1',
      chainId,
      verifyingContract: getContract('orderBookMargin').address,
    },

    message: {
      loanId: order.loanId,
      leverageAmount: Web3.utils.toBN(order.leverageAmount).toString(),
      loanTokenAddress: order.loanTokenAddress,
      loanTokenSent: Web3.utils.toBN(order.loanTokenSent).toString(),
      collateralTokenSent: Web3.utils
        .toBN(order.collateralTokenSent)
        .toString(),
      collateralTokenAddress: order.collateralTokenAddress,
      trader: order.trader,
      minReturn: Web3.utils.toBN(order.minReturn).toString(),
      loanDataBytes: order.loanDataBytes,
      deadline: Web3.utils.toBN(order.deadline).toString(),
      createdTimestamp: Web3.utils.toBN(order.createdTimestamp).toString(),
    },
    primaryType: 'Order',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Order: [
        { name: 'loanId', type: 'bytes32' },
        { name: 'leverageAmount', type: 'uint256' },
        { name: 'loanTokenAddress', type: 'address' },
        { name: 'loanTokenSent', type: 'uint256' },
        { name: 'collateralTokenSent', type: 'uint256' },
        { name: 'collateralTokenAddress', type: 'address' },
        { name: 'trader', type: 'address' },
        { name: 'minReturn', type: 'uint256' },
        { name: 'loanDataBytes', type: 'bytes32' },
        { name: 'deadline', type: 'uint256' },
        { name: 'createdTimestamp', type: 'uint256' },
      ],
    },
  });

  return new Promise((resolve, reject) => {
    walletService
      .request({
        method: 'eth_signTypedData_v4',
        params: [account, msgParams],
      })
      .then(res => {
        console.log('res: ', res);
        resolve(res);
      })
      .catch(err => reject(err));
  });
}
