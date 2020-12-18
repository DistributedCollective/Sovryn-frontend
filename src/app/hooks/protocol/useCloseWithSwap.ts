import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useCloseWithSwap(
  loanId,
  receiver,
  swapAmount,
  returnTokenIsCollateral,
  loanDataBytes,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'closeWithSwap',
  );

  return {
    send: () =>
      send(
        [loanId, receiver, swapAmount, returnTokenIsCollateral, loanDataBytes],
        { from: account },
        { type: TxType.CLOSE_WITH_SWAP },
      ),
    ...rest,
  };
}
