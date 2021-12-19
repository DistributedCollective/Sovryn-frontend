import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxType } from '../../../../store/global/transactions-store/types';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export function useMining_RemoveLiquidityV2(
  pool: AmmLiquidityPool,
  asset: Asset,
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
        [pool.converter, getTokenContract(asset).address, amount, minReturn],
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
