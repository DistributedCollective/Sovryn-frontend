import { TxType } from 'store/global/transactions-store/types';
import { useAccount } from '../../../hooks/useAccount';
import { useSendContractTx } from '../../../hooks/useSendContractTx';

export function useDepositToken(weiAmount: string = '0') {
  const account = useAccount();
  const { send, ...txState } = useSendContractTx(
    'escrowRewards',
    'depositTokens',
  );

  return {
    deposit: (nonce?: number, approveTx?: string | null) =>
      send(
        [weiAmount],
        {
          from: account,
          nonce,
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.ESCROW_SOV_DEPOSIT,
        },
      ),
    ...txState,
  };
}
