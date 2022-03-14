import { useAccount } from '../useAccount';
import { useSendContractTx } from '../useSendContractTx';
import {
  getContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { Asset } from 'types/asset';

export const useConvertToXUSD = (asset: Asset) => {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('babelfishAggregator', 'mintTo');

  return {
    convert: async (weiAmount: string) => {
      let tx: CheckAndApproveResult;

      tx = await contractWriter.checkAndApprove(
        asset,
        getContract('babelfishAggregator').address,
        weiAmount,
      );

      if (tx.rejected) {
        return;
      }

      send(
        [getTokenContract(asset).address, weiAmount, account],
        {
          from: account,
          gas: gasLimit[TxType.CONVERT_RUSDT_TO_XUSD],
          nonce: tx?.nonce,
        },
        {
          type: TxType.CONVERT_RUSDT_TO_XUSD,
          assetAmount: weiAmount,
          asset,
          customData: { date: new Date().getTime() / 1000 },
        },
      );
    },
    ...rest,
  };
};
