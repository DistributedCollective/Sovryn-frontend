import { getContract } from '../../utils/blockchain/contract-helpers';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { walletService } from '@sovryn/react-wallet';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from '../../types';

import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { Order } from '../pages/SpotTradingPage/helpers';
import { gas } from '../../utils/blockchain/gas-price';
import { contractReader } from '../../utils/sovryn/contract-reader';
import axios from 'axios';

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

    const order = new Order(
      account,
      sourceToken,
      targetToken,
      amount,
      amount,
      account,
      getDeadline(24).toString(),
    );

    console.log({ order });

    // todo: signing inside of order.toArgs works only for browser wallets :(
    const args = await order.toArgs(chainId!);

    console.log({ args });

    const { address, abi } = getContract('orderBook');
    const contract = new ethers.Contract(address, abi);

    const populated = await contract.populateTransaction.createOrder(args);

    console.log({ populated });

    const nonce = await contractReader.nonce(account);

    // todo: this would work only on hardware wallets
    const signedTx = await walletService.signRawTransaction({
      ...populated,
      gasLimit: '600000',
      gasPrice: gas.get(),
      nonce,
    } as any);

    console.log({ signedTx });

    try {
      const { status, data } = await axios.post(apiUrl, {
        data: signedTx,
      });
      console.log(data, status);
    } catch (e) {
      console.log(e);
    }
  };

  return { createOrder };
}
