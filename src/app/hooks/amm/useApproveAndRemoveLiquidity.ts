import { Asset } from 'types/asset';
import {
  getAmmContract,
  getContract,
  getPoolTokenContractName,
} from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useRemoveLiquidity } from './useRemoveLiquidity';
import { toWei } from '../../../utils/blockchain/math-helpers';

export function useApproveAndRemoveLiquidity(
  pool: Asset,
  asset: Asset,
  poolAddress: string,
  amount: string,
  minReturn: string,
) {
  const { withdraw, ...txState } = useRemoveLiquidity(
    pool,
    asset,
    poolAddress,
    amount,
    minReturn,
  );

  return {
    withdraw: async () => {
      let tx: CheckAndApproveResult = {};
      tx = await contractWriter.checkAndApproveContract(
        getPoolTokenContractName(pool, asset),
        asset === Asset.RBTC
          ? getContract('BTCWrapperProxy').address
          : getAmmContract(pool).address,
        [amount, toWei('100000')],
        asset,
      );
      if (tx.rejected) {
        return;
      }
      await withdraw(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}
