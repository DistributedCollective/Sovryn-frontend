import { getContract } from './../../utils/blockchain/contract-helpers';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { walletService } from '@sovryn/react-wallet';
import { getTokenContract } from '../../utils/blockchain/contract-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from '../../types/asset';

import { ethers } from 'ethers';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { _TypedDataEncoder } from 'ethers/lib/utils';

const apiUrl = 'http://18.217.222.156:3000/api/createOrder';

const getDeadline = hoursFromNow =>
  ethers.BigNumber.from(Math.floor(Date.now() / 1000 + hoursFromNow * 3600));

export function useLimitOrder(
  sourceToken: Asset,
  targetToken: Asset,
  amount: string,
) {
  const account = useAccount();
  const { chainId } = useSelector(selectWalletProvider);

  const createOrder = async () => {
    let tx: CheckAndApproveResult = {};
    if (sourceToken !== Asset.RBTC) {
      tx = await contractWriter.checkAndApprove(
        sourceToken,
        getContract('settlement').address,
        amount,
      );
      if (tx.rejected) {
        return;
      }
    }

    const types = {
      Order: [
        { name: 'maker', type: 'address' },
        { name: 'fromToken', type: 'address' },
        { name: 'toToken', type: 'address' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOutMin', type: 'uint256' },
        { name: 'recipient', type: 'address' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const domain = {
      name: 'OrderBook',
      version: '1',
      chainId,
      verifyingContract: getContract('orderBook').address,
    };

    const value = {
      maker: account,
      fromToken: getTokenContract(sourceToken).address,
      toToken: getTokenContract(targetToken).address,
      amountIn: amount,
      amountOutMin: ethers.utils.parseEther('0.003'),
      recipient: account,
      deadline: getDeadline(24),
    };

    const digest = _TypedDataEncoder.hash(domain, types, value);
    const signedTx = await walletService.signMessage(digest);
    console.log('signedTx:', signedTx);

    // let { v, r, s } = ethers.utils.splitSignature(flatSig);

    // const args = [
    //   account,
    //   getTokenContract(sourceToken).address,
    //   getTokenContract(targetToken).address,
    //   amountIn,
    //   ethers.utils.parseEther('0.003'),
    //   account,
    //   getDeadline(24),
    //   v,
    //   r,
    //   s,
    // ];

    // const nonce = await contractReader.nonce(
    //   walletService.address.toLowerCase(),
    // );

    // const signedTx = await walletService.signTransaction({
    //   to: tx.to?.toLowerCase(),
    //   value: String(tx?.value || '0'),
    //   nonce,
    //   gasPrice: gas.get(),
    //   gasLimit: '600000',
    //   chainId,
    // });

    try {
      const { status, data } = await axios.post(apiUrl, {
        data: signedTx,
      });

      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return { createOrder };
}
