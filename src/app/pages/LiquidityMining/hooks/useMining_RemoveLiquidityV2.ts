import { Asset } from 'types/asset';
import {
  getAmmContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxType } from '../../../../store/global/transactions-store/types';

export function useMining_RemoveLiquidityV2(
  pool: Asset,
  asset: Asset,
  poolTokenAddress: string,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'removeLiquidityFromV2',
  );

  return {
    withdraw: (nonce?: number, approveTx?: string | null) => {
      return send(
        [
          getAmmContract(pool).address,
          getTokenContract(asset).address,
          amount,
          minReturn,
        ],
        {
          from: account,
          gas: gasLimit[TxType.REMOVE_LIQUIDITY],
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.REMOVE_LIQUIDITY,
        },
      );
    },
    ...rest,
  };
}
