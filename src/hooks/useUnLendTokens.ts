import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/assetMapper';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';

export function useUnLendTokens(asset: Asset) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContract(asset).contractName,
    'burn',
  );
  return {
    unLend: (weiAmount: string) => send(account, weiAmount, { from: account }),
    ...rest,
  };
}
