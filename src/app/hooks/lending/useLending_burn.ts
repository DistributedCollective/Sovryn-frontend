import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useLending_burn(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    asset === Asset.RBTC ? 'burnToBTC' : 'burn',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      send(
        [account, weiAmount, true],
        { from: account, nonce },
        { approveTransactionHash: approveTx, type: TxType.UNLEND },
      );
    },
    ...rest,
  };
}
