import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { TxType } from 'store/global/transactions-store/types';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useLending_mint(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'addToLendingPool',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) =>
      send(
        [getLendingContract(asset).address, weiAmount],
        { from: account, nonce, value: asset === Asset.RBTC ? weiAmount : '0' },
        {
          approveTransactionHash: approveTx,
          type: TxType.LEND,
        },
      ),
    ...rest,
  };
}
