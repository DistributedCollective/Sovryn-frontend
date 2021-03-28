import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types/asset';
import { toWei } from 'web3-utils';
import { TxType } from '../../../store/global/transactions-store/types';

export function useDepositCollateral(
  collateralToken: Asset,
  loanId,
  depositAmount,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'depositCollateral',
  );

  return {
    send: (nonce?: number, approveTx?: string | null) =>
      send(
        [loanId, depositAmount],
        {
          from: account,
          value: collateralToken === Asset.RBTC ? depositAmount : toWei('0'),
          nonce,
        },
        { approveTransactionHash: approveTx, type: TxType.DEPOSIT_COLLATERAL },
      ),
    ...rest,
  };
}
