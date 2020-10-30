import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';

export function useCloseWithDeposit(
  asset: Asset,
  loanId,
  receiver,
  withdrawAmount,
) {
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'closeWithDeposit',
  );

  console.log('rest', rest);

  return {
    closeWithDeposit: () => {
      return send(loanId, receiver, withdrawAmount);
    },
    ...rest,
  };
}
