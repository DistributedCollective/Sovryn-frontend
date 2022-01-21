import { Order } from 'app/pages/SpotTradingPage/helpers';
import { getContract } from 'utils/blockchain/contract-helpers';
import { walletService } from '@sovryn/react-wallet';
import { BigNumber } from 'ethers';

export const signTypeData = async (order: Order, account: string, chainId) => {
  const messageParameters = JSON.stringify({
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
      amountIn: BigNumber.from(order.amountIn).toString(),
      amountOutMin: BigNumber.from(order.amountOutMin).toString(),
      recipient: order.recipient,
      deadline: BigNumber.from(order.deadline).toString(),
      created: BigNumber.from(order.created).toString(),
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
        params: [account, messageParameters],
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};
