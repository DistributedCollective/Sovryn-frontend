import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';

export function useUnLendTokens(asset: Asset) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'burn',
  );
  return {
    unLend: (weiAmount: string) => send(account, weiAmount, { from: account }),
    ...rest,
  };
}
