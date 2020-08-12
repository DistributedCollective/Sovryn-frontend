import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/assetMapper';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';

export function useLendTokens(asset: Asset) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContract(asset).contractName,
    'mint',
  );
  return {
    lend: (weiAmount: string) => send(account, weiAmount, { from: account }),
    ...rest,
  };
}
