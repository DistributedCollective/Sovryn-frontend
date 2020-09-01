import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useDepositCollateral(loanId, depositAmount) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'bzxContract',
    'depositCollateral',
  );

  return {
    send: () => send(loanId, depositAmount, { from: account }),
    ...rest,
  };
}
