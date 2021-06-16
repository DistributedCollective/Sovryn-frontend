import { useAccount } from '../useAccount';
import { useSendContractTx } from '../useSendContractTx';
import { getContract } from 'utils/blockchain/contract-helpers';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { Asset } from 'types/asset';

export const useConvertToXUSD = () => {
  const account = useAccount();
  const rusdtAddress = getContract('USDT_token').address;
  const { send, ...rest } = useSendContractTx('babelfishAggregator', 'mintTo');

  return {
    convert: async (weiAmount: string) => {
      let tx: CheckAndApproveResult = {};

      tx = await contractWriter.checkAndApprove(
        Asset.USDT,
        getContract('babelfishAggregator').address,
        weiAmount,
      );

      if (tx.rejected) {
        return;
      }

      send(
        [rusdtAddress, weiAmount, account],
        {
          from: account,
          gas: gasLimit[TxType.CONVERT_RUSDT_TO_XUSD],
          nonce: tx?.nonce,
        },
        { type: TxType.CONVERT_RUSDT_TO_XUSD },
      );
    },
    ...rest,
  };
};
