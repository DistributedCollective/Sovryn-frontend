import { Asset } from 'types/asset';
import {
  getContract,
  getPoolTokenContractName,
} from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useRemoveLiquidity } from './useRemoveLiquidity';

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
      // if (asset !== Asset.BTC) {
      tx = await contractWriter.checkAndApproveContract(
        getPoolTokenContractName(pool, asset),
        getContract('BTCWrapperProxy').address,
        amount,
        // toWei('1000000', 'ether'),
        asset,
      );
      if (tx.rejected) {
        return;
      }
      // }
      await withdraw(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}
