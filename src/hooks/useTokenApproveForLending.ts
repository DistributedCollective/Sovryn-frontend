import { Asset } from 'types/asset';
import {
  getLendingContract,
  getTokenContract,
} from 'utils/blockchain/assetMapper';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';

export function useTokenApproveForLending(asset: Asset) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getTokenContract(asset).contractName,
    'approve',
  );
  return {
    approve: (weiAmount: string) =>
      send(getLendingContract(asset).address, weiAmount, { from: account }),
    ...rest,
  };
}
