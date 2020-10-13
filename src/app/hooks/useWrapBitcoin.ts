import { useAccount } from './useAccount';
import { useSendContractTx } from './useSendContractTx';
import { getTokenContractName } from '../../utils/blockchain/contract-helpers';
import { Asset } from '../../types/asset';

export function useWrapBitcoin(weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getTokenContractName(Asset.BTC),
    'deposit',
  );

  return {
    wrap: () => {
      return send({
        from: account,
        value: weiAmount,
      });
    },
    ...rest,
  };
}
