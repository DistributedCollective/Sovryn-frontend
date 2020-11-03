import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types/asset';

export function useCloseWithDeposit(
  asset: Asset,
  loanId,
  receiver,
  repayAmount,
) {
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'closeWithDeposit',
  );
  const account = useAccount();

  return {
    send: () =>
      send(loanId, receiver, repayAmount, {
        from: account,
        value: asset === Asset.BTC ? repayAmount : '0',
      }),
    ...rest,
  };
}
