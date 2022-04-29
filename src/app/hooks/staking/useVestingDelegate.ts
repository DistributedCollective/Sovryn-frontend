import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { useSendToContractAddressTx } from '../useSendToContractAddressTx';
import VestingABI from 'utils/blockchain/abi/Vesting.json';
import FourYearVestingABI from 'utils/blockchain/abi/FourYearVesting.json';
import { AbiItem } from 'web3-utils';

export function useVestingDelegate(
  contractAddress: string,
  vestingType: string,
) {
  const account = useAccount();

  const { send, ...rest } = useSendToContractAddressTx(
    contractAddress,
    (vestingType === 'fouryear' ? FourYearVestingABI : VestingABI) as AbiItem[],
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
