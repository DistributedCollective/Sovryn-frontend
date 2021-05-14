import { Asset } from 'types/asset';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { getLendingContract } from '../../../utils/blockchain/contract-helpers';

export function useLending_burn(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'removeFromLendingPool',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      send(
        [getLendingContract(asset).address, weiAmount],
        { from: account, nonce },
        { approveTransactionHash: approveTx, type: TxType.UNLEND },
      );
    },
    ...rest,
  };
}
