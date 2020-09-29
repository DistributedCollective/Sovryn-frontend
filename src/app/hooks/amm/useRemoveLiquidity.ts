import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useRemoveLiquidity(
  poolTokenAddress: string,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'liquidityProtocol',
    'removeLiquidity',
  );

  return {
    withdraw: () => {
      return send(poolTokenAddress, amount, minReturn, {
        from: account,
      });
    },
    ...rest,
  };
}
