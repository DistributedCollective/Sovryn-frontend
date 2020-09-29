import { useAccount } from './useAccount';
import { useSendContractTx } from './useSendContractTx';
import { getTokenContractName } from '../../utils/blockchain/contract-helpers';
import { Asset } from '../../types/asset';

export function useUnwrapBitcoin(weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getTokenContractName(Asset.BTC),
    'withdraw',
  );

  return {
    unwrap: () => {
      return send(weiAmount, {
        from: account,
        value: weiAmount,
      });
    },
    ...rest,
  };
}
