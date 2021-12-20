import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';
import { LendingPoolDictionary } from '../../../utils/dictionaries/lending-pool-dictionary';

export function useLending_burn(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    asset === Asset.RBTC ? 'burnToBTC' : 'burn',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      send(
        [account, weiAmount, LendingPoolDictionary.get(asset).useLM],
        { from: account, nonce, gas: gasLimit[TxType.UNLEND] },
        { approveTransactionHash: approveTx, type: TxType.UNLEND },
      );
    },
    ...rest,
  };
}
