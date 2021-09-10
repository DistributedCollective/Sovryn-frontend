import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { useSendToContractAddressTx } from '../useSendToContractAddressTx';
import VestingABI from 'utils/blockchain/abi/Vesting.json';
import { AbiItem } from 'web3-utils';

export function useVestingDelegate(contractAddress: string) {
  const account = useAccount();

  const { send, ...rest } = useSendToContractAddressTx(
    contractAddress,
    VestingABI as AbiItem[],
    'delegate',
  );
  return {
    delegate: (address: string) => {
      send(
        [address],
        { from: account },
        {
          type: TxType.VESTING_DELEGATE,
        },
      );
    },
    ...rest,
  };
}
