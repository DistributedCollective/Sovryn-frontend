import { Asset } from 'types/asset';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useCloseWithDeposit(
  asset: Asset,
  loanId,
  receiver,
  withdrawAmount,
) {
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'closeWithDeposit',
  );
  const account = useAccount();

  return {
    closeWithDeposit: () => {
      return send(loanId, receiver, withdrawAmount, { from: account });
    },
    ...rest,
  };
}
