import { Order } from 'app/pages/SpotTradingPage/helpers';
import { getContract } from 'utils/blockchain/contract-helpers';
import { walletService } from '@sovryn/react-wallet';
import { BigNumber } from 'ethers';
import { MarginOrder } from 'app/pages/MarginTradePage/helpers';
import { bignumber, max } from 'mathjs';
import { Asset } from 'types/asset';
import { contractReader } from 'utils/sovryn/contract-reader';
import { getPriceAmm } from 'utils/blockchain/requests/amm';

enum CacheKey {
  SPOT_TRADE_FEE,
  MARGIN_TRADE_FEE,
}

const cache: Partial<Record<CacheKey, string>> = {};

export const signTypeData = async (order: Order, account: string, chainId) => {
  const messageParameters = JSON.stringify({
    domain: {
      chainId,
      name: 'OrderBook',
      verifyingContract: getContract('orderBook').address,
      version: '1',
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

export async function signTypeMarginOrderData(
  order: MarginOrder,
  account: string,
  chainId,
) {
  const orderData = JSON.stringify({
    domain: {
      name: 'OrderBookMargin',
      version: '1',
      chainId,
      verifyingContract: getContract('orderBookMargin').address,
    },

    message: {
      loanId: order.loanId,
      leverageAmount: BigNumber.from(order.leverageAmount).toString(),
      loanTokenAddress: order.loanTokenAddress,
      loanTokenSent: BigNumber.from(order.loanTokenSent).toString(),
      collateralTokenSent: BigNumber.from(order.collateralTokenSent).toString(),
      collateralTokenAddress: order.collateralTokenAddress,
      trader: order.trader,
      minEntryPrice: BigNumber.from(order.minEntryPrice).toString(),
      loanDataBytes: order.loanDataBytes,
      deadline: BigNumber.from(order.deadline).toString(),
      createdTimestamp: BigNumber.from(order.createdTimestamp).toString(),
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
        { name: 'minEntryPrice', type: 'uint256' },
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
        params: [account, orderData],
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
}

// max(minSwapOrderTxFee, 0.2% of amountIn)
export const getRelayerFee = (minSwapOrderTxFee: string, amountIn: string) =>
  max(bignumber(minSwapOrderTxFee), bignumber(0.002).mul(amountIn)).toString();

export const getMinSwapOrderTxFee = async () => {
  if (cache.hasOwnProperty(CacheKey.SPOT_TRADE_FEE)) {
    return cache[CacheKey.SPOT_TRADE_FEE];
  }
  return contractReader
    .call<string>('settlement', 'minSwapOrderTxFee', [])
    .then(result => {
      cache[CacheKey.SPOT_TRADE_FEE] = result;
      return result;
    });
};

export const getMinMarginOrderFee = async () => {
  if (cache.hasOwnProperty(CacheKey.MARGIN_TRADE_FEE)) {
    return cache[CacheKey.MARGIN_TRADE_FEE];
  }
  return contractReader
    .call<string>('settlement', 'minMarginOrderTxFee', [])
    .then(result => {
      cache[CacheKey.MARGIN_TRADE_FEE] = result;
      return result;
    });
};

export const getSwapOrderFeeOut = async (
  sourceAsset: Asset,
  weiAmountIn: string,
) => {
  const orderSize = bignumber(weiAmountIn);
  let orderFee = orderSize.mul(2).div(1000); //-0.2% relayer fee

  let minFeeAmount = await getMinSwapOrderTxFee().then(bignumber);

  let minFeeInToken = minFeeAmount;
  if (sourceAsset !== Asset.RBTC) {
    minFeeInToken = await getPriceAmm(
      Asset.RBTC,
      sourceAsset,
      minFeeAmount.toString(),
    ).then(bignumber);
  }

  if (orderFee.lt(minFeeInToken)) orderFee = minFeeInToken;

  return minFeeInToken.toFixed(0);
};

export const getMarginOrderFeeOut = async (
  sourceAsset: Asset,
  targetAsset: Asset,
  weiAmountIn: string,
) => {
  const orderSize = bignumber(weiAmountIn);
  let orderFee = orderSize.mul(2).div(1000); //-0.2% relayer fee

  let minFeeAmount = await getMinMarginOrderFee().then(bignumber);

  let minFeeInToken = minFeeAmount;
  if (sourceAsset !== Asset.RBTC) {
    minFeeInToken = await getPriceAmm(
      Asset.RBTC,
      sourceAsset,
      minFeeAmount.toString(),
    ).then(bignumber);
  }

  if (orderFee.lt(minFeeInToken)) orderFee = minFeeInToken;

  return getPriceAmm(sourceAsset, targetAsset, orderFee.toString());
};
