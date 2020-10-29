import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types/asset';

export function useRemoveLiquidity(
  asset: Asset,
  poolTokenAddress: string,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    asset === Asset.BTC ? 'liquidityBTCProtocol' : 'liquidityProtocol',
    'removeLiquidity',
  );

  return {
    withdraw: () => {
      const args = [
        poolTokenAddress,
        amount,
        minReturn,
        {
          from: account,
        },
      ];

      if (asset === Asset.BTC) {
        args.shift();
      }
      return send(...args);
    },
    ...rest,
  };
}
