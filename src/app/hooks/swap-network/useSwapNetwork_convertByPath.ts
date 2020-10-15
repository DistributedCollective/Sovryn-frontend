import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { bignumber } from 'mathjs';

export function useSwapNetwork_convertByPath(
  path: string[],
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx('swapNetwork', 'convertByPath');
  return {
    send: () =>
      send(
        path,
        amount,
        bignumber(minReturn).minus(bignumber(minReturn).mul(0.005)).toFixed(0), // removes 0.5%
        account,
        '0x0000000000000000000000000000000000000000',
        '0',
        {
          from: account,
        },
      ),
    ...rest,
  };
}
