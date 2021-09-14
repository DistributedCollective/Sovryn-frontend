import { Asset } from 'types/asset';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';
import { useSwapsExternal_swapExternal } from './useSwapsExternal_swapExternal';
import { getContract } from '../../../utils/blockchain/contract-helpers';

export function useSwapsExternal_approveAndSwapExternal(
  sourceToken: Asset,
  destToken: Asset,
  receiver: string,
  returnToSender: string,
  sourceTokenAmount: string,
  requiredDestTokenAmount: string,
  minReturn: string,
  swapData: string,
) {
  const { send, ...txState } = useSwapsExternal_swapExternal(
    sourceToken,
    destToken,
    receiver,
    returnToSender,
    sourceTokenAmount,
    requiredDestTokenAmount,
    minReturn,
    swapData,
  );

  return {
    send: async () => {
      let tx: CheckAndApproveResult = {};
      if (sourceToken !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          sourceToken,
          getContract('sovrynProtocol').address,
          sourceTokenAmount,
        );
        if (tx.rejected) {
          return;
        }
      }
      await send(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}
