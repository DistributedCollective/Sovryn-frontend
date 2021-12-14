import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { TxType } from 'store/global/transactions-store/types';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { gasLimit } from 'utils/classifiers';
import { LendingPoolDictionary } from '../../../utils/dictionaries/lending-pool-dictionary';

export function useLending_mint(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    asset === Asset.RBTC ? 'mintWithBTC' : 'mint',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      const { useLM } = LendingPoolDictionary.get(asset);

      asset === Asset.RBTC
        ? send(
            [account, useLM],
            {
              from: account,
              value: weiAmount,
              nonce,
              gas: gasLimit[TxType.LEND],
            },
            {
              approveTransactionHash: approveTx,
              type: TxType.LEND,
            },
          )
        : send(
            [account, weiAmount, useLM],
            { from: account, nonce, gas: gasLimit[TxType.LEND] },
            {
              approveTransactionHash: approveTx,
              type: TxType.LEND,
            },
          );
    },
    ...rest,
  };
}
