import { Asset } from 'types/asset';
import {
  getAmmContractName,
  getAmmContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';

export function useRemoveLiquidity(
  pool: Asset,
  asset: Asset,
  poolTokenAddress: string,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    asset === Asset.RBTC ? 'BTCWrapperProxy' : getAmmContractName(pool),
    'removeLiquidity',
  );

  return {
    withdraw: (nonce?: number, approveTx?: string | null) =>
      send(
        [
          asset === Asset.RBTC
            ? getAmmContract(pool).address
            : poolTokenAddress,
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
      ),
    ...rest,
  };
}
