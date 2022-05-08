import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';
import { useSendToContractAddressTx } from '../useSendToContractAddressTx';
import { getVestingAbi } from 'utils/blockchain/requests/vesting';
import { AbiItem } from 'web3-utils';
import { VestGroup } from 'app/components/UserAssets/Vesting/types';

export function useVestingDelegate(
  contractAddress: string,
  vestingType: VestGroup,
) {
  const account = useAccount();

  const { send, ...rest } = useSendToContractAddressTx(
    contractAddress,
    getVestingAbi(vestingType) as AbiItem[],
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
