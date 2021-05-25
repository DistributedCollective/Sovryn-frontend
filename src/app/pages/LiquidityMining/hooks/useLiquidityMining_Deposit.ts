import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';

export function useLiquidityMining_Deposit(poolToken: string, amount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'liquidityMiningProxy',
    'deposit',
  );
  return {
    deposit: (nonce?: number, approveTx?: string | null) => {
      return send(
        [poolToken, amount, account],
        {
          from: account,
          nonce,
          gas: gasLimit[TxType.LM_DEPOSIT],
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.LM_DEPOSIT,
        },
      );
    },
    ...rest,
  };
}
