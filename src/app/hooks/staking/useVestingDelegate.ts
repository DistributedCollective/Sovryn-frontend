import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { useSendToContractAddressTx } from '../useSendToContractAddressTx';
import VestingABI from 'utils/blockchain/abi/Vesting.json';

export function useVestingDelegate(contractAddress: string) {
  const account = useAccount();

  const { send, ...rest } = useSendToContractAddressTx(
    contractAddress,
    VestingABI as any,
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
