import { Asset } from 'types/asset';
import {
  getLendingContract,
  getTokenContractName,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';

export function useTokenApproveForLending(asset: Asset) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getTokenContractName(asset),
    'approve',
  );
  return {
    approve: (weiAmount: string) =>
      send(getLendingContract(asset).address, weiAmount, { from: account }),
    ...rest,
  };
}
