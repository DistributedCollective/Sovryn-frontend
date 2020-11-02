import { Asset } from 'types/asset';
import {
  getLendingContract,
  getTokenContractName,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from './useSendContractTx';
import { useAccount } from './useAccount';
import { ContractName } from '../../utils/types/contracts';

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

export function useTokenApprove(tokenAsset: Asset, spenderAddress: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getTokenContractName(tokenAsset),
    'approve',
  );
  return {
    approve: (weiAmount: string) =>
      send(spenderAddress, weiAmount, { from: account }),
    ...rest,
  };
}

export function useApprove(contractName: ContractName, spenderAddress: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(contractName, 'approve');
  return {
    approve: (weiAmount: string) =>
      send(spenderAddress, weiAmount, { from: account }),
    ...rest,
  };
}
