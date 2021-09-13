import { Asset } from 'types/asset';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { toWei } from 'web3-utils';

export function useLoanMaintenance_depositCollateral() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'loanMaintenance',
    'depositCollateral',
  );

  return {
    send: (
      loanId: string,
      depositAmount: string,
      collateralToken: Asset,
      nonce?: number,
      approveTx?: string | null,
    ) => {
      return send(
        [loanId, depositAmount],
        {
          from: account,
          value: collateralToken === Asset.RBTC ? depositAmount : toWei('0'),
          nonce,
        },
        {
          type: TxType.LOAN_MAINTENANCE_DEPOSIT_COLLATERAL,
          approveTransactionHash: approveTx,
        },
      );
    },
    ...rest,
  };
}
