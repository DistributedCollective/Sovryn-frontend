import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';

export function useLendTokensRBTC(asset: Asset) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'mintWithBTC',
  );
  return {
    lend: (weiAmount: string) => send(account, { from: account, value: weiAmount }),
    ...rest,
  };
}
