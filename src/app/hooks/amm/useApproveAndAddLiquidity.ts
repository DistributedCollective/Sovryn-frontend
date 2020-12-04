import { Asset } from 'types/asset';
import { appContracts } from 'utils/blockchain/app-contracts';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useAddLiquidity } from './useAddLiquidity';

export function useApproveAndAddLiquidity(
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const { deposit, ...txState } = useAddLiquidity(asset, amount, minReturn);
  return {
    deposit: async () => {
      let tx: CheckAndApproveResult = {};
      if (asset !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          asset,
          appContracts.liquidityProtocol.address,
          amount,
          // toWei('1000000', 'ether'),
        );
        if (tx.rejected) {
          return;
        }
      }
      await deposit(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}
