import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { TxType } from '../../../../store/global/transactions-store/types';
import { useAccount } from '../../../hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export function useMining_RemoveLiquidityV1(
  pool: AmmLiquidityPool,
  amount: string,
  reserveMinReturnAmounts: string[],
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'removeLiquidityFromV1',
  );

  return {
    withdraw: (nonce?: number, approveTx?: string | null) => {
      const reserveTokens = [pool.assetA, pool.assetB];
      const btcIndex = reserveTokens.indexOf(Asset.RBTC);
      if (btcIndex !== -1) {
        // making btc as first element
        const btcToken = reserveTokens[btcIndex];
        const btcAmount = reserveMinReturnAmounts[btcIndex];
        delete reserveTokens[btcIndex];
        delete reserveMinReturnAmounts[btcIndex];
        reserveTokens.unshift(btcToken);
        reserveMinReturnAmounts.unshift(btcAmount);
      }
      return send(
        [
          pool.converter,
          amount,
          reserveTokens
            .filter(item => !!item)
            .map(item => getTokenContract(item).address),
          reserveMinReturnAmounts.filter(item => !!item),
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
