import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
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
  console.log('rest', rest);

  return {
    closeWithDeposit: () => {
      return send(loanId, receiver, withdrawAmount, { from: account });
    },
    ...rest,
  };
}
