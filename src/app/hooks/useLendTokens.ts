import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';

export function useLendTokens(asset: Asset) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'mint',
  );
  return {
    lend: (weiAmount: string) => send(account, weiAmount, { from: account }),
    ...rest,
  };
}
