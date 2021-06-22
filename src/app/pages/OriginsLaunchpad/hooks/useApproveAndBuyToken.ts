import { getContract } from 'utils/blockchain/contract-helpers';
import { TxType } from 'store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { Asset } from 'types';
import { useAccount } from 'app/hooks/useAccount';

export const useApproveAndBuyToken = () => {
  const account = useAccount();

  const { send, ...rest } = useSendContractTx('originsBase', 'buy');

  return {
    buy: async (
      tierId: number,
      destinationWeiAmount: string,
      destinationToken: Asset | string,
      sourceWeiAmount: string,
      sourceToken: Asset,
    ) => {
      const isTokenSale = sourceToken !== Asset.RBTC;

      let tx: CheckAndApproveResult = {};

      if (isTokenSale) {
        tx = await contractWriter.checkAndApprove(
          sourceToken,
          getContract('originsBase').address,
          sourceWeiAmount,
        );

        if (tx.rejected) {
          return;
        }
      }

      send(
        [tierId, sourceWeiAmount],
        {
          from: account,
          gas: gasLimit[TxType.ORIGINS_SALE_BUY],
          ...(isTokenSale && { nonce: tx?.nonce }),
          ...(!isTokenSale && { value: sourceWeiAmount }),
        },
        {
          type: TxType.ORIGINS_SALE_BUY,
          customData: {
            date: new Date().getTime() / 1000,
            sourceAmount: sourceWeiAmount,
            destinationAmount: destinationWeiAmount,
            sourceToken: sourceToken,
            destinationToken: destinationToken,
          },
        },
      );
    },
    ...rest,
  };
};
