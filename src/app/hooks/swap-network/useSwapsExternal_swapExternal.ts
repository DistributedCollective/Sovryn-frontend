import { useSendContractTx } from '../useSendContractTx';
import { Asset } from '../../../types';
import { TxType } from '../../../store/global/transactions-store/types';
import { getTokenContract } from '../../../utils/blockchain/contract-helpers';
import { gasLimit } from '../../../utils/classifiers';

export function useSwapsExternal_swapExternal(
  sourceToken: Asset,
  destToken: Asset,
  receiver: string,
  returnToSender: string,
  sourceTokenAmount: string,
  requiredDestTokenAmount: string,
  minReturn: string,
  swapData: string,
) {
  const { send, ...rest } = useSendContractTx('sovrynProtocol', 'swapExternal');
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      return send(
        [
          getTokenContract(sourceToken).address,
          getTokenContract(destToken).address,
          receiver,
          returnToSender,
          sourceTokenAmount,
          requiredDestTokenAmount,
          minReturn,
          swapData,
        ],
        {
          value: sourceToken === Asset.RBTC ? sourceTokenAmount : '0',
          gas: gasLimit[TxType.SWAP_EXTERNAL],
        },
        {
          type: TxType.SWAP_EXTERNAL,
          approveTransactionHash: approveTx,
          customData: {
            sourceToken,
            targetToken: destToken,
            amount: sourceTokenAmount,
            date: new Date().getTime() / 1000,
            minReturn: requiredDestTokenAmount,
          },
        },
      );
    },
    ...rest,
  };
}
