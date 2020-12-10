import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { useEffect } from 'react';

export function useMarginTrade(
  asset: Asset,
  loanId,
  leverageAmount,
  loanTokenSent,
  collateralTokenSent,
  collateralToken: Asset,
  trader,
  loanDataBytes,
  weiAmount: string = '0',
) {
  const account = useAccount();
  const { send, ...txState } = useSendContractTx(
    getLendingContractName(asset),
    'marginTrade',
  );

  useEffect(() => {
    console.log({
      loanTokenSent,
      collateralTokenSent,
      collateralToken,
    });
  }, [loanTokenSent, collateralTokenSent, collateralToken]);

  return {
    trade: (nonce?: number, approveTx?: string | null) =>
      send(
        [
          loanId,
          leverageAmount,
          loanTokenSent,
          collateralTokenSent,
          getTokenContract(collateralToken).address,
          trader,
          loanDataBytes,
        ],
        {
          from: account,
          value: weiAmount,
          nonce,
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.TRADE,
        },
      ),
    ...txState,
  };
}
