import { toWei } from 'web3-utils';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from '../../../utils/classifiers';

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
          gas: gasLimit[TxType.DEPOSIT_COLLATERAL],
          nonce,
        },
        { approveTransactionHash: approveTx, type: TxType.DEPOSIT_COLLATERAL },
      ),
    ...rest,
  };
}
