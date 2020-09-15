import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types/asset';
import { toWei } from 'web3-utils';

export function useDepositCollateral(token: Asset, loanId, depositAmount) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'depositCollateral',
  );

  return {
    send: () =>
      send(loanId, depositAmount, {
        from: account,
        value: token === Asset.BTC ? depositAmount : toWei('0'),
      }),
    ...rest,
  };
}
