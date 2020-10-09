import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types/asset';
import { toWei } from 'web3-utils';

export function useDepositCollateral(
  collateralToken: Asset,
  loanId,
  depositAmount,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'sovrynProtocol',
    'depositCollateral',
  );

  return {
    send: () =>
      send(loanId, depositAmount, {
        from: account,
        value: collateralToken === Asset.BTC ? depositAmount : toWei('0'),
      }),
    ...rest,
  };
}
