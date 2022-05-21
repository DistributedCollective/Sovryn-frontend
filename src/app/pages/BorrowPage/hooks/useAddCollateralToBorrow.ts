import { toWei } from 'web3-utils';
import { useCallback } from 'react';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { Asset } from 'types';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';

export function useAddCollateralToBorrow() {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'depositCollateral',
  );

  const handleTx = useCallback(
    async (collateralToken: Asset, loanId: string, depositAmount: string) => {
      let tx: CheckAndApproveResult = {};
      if (collateralToken !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          collateralToken,
          getContract('sovrynProtocol').address,
          depositAmount,
        );
        if (tx.rejected) {
          return;
        }
      }

      send(
        [loanId, depositAmount],
        {
          from: account,
          value: collateralToken === Asset.RBTC ? depositAmount : toWei('0'),
          gas: gasLimit[TxType.DEPOSIT_COLLATERAL],
          nonce: tx?.nonce,
        },
        {
          approveTransactionHash: tx?.approveTx,
          type: TxType.DEPOSIT_COLLATERAL,
        },
      );
    },
    [account, send],
  );

  return {
    send: handleTx,
    ...rest,
  };
}
