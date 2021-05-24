import { Asset } from 'types/asset';
import {
  getAmmContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';

export function useMining_AddLiquidityV2(
  pool: Asset,
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'addLiquidityToV2',
  );
  return {
    deposit: (nonce?: number, approveTx?: string | null) => {
      return send(
        [
          getAmmContract(pool).address,
          getTokenContract(asset).address,
          amount,
          minReturn,
        ],
        {
          from: account,
          value: asset === Asset.RBTC ? amount : '0',
          nonce,
          gas: gasLimit[TxType.ADD_LIQUIDITY],
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.ADD_LIQUIDITY,
        },
      );
    },
    ...rest,
  };
}
