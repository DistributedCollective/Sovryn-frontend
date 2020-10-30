import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { bignumber } from 'mathjs';
import { Asset } from '../../../types/asset';

export function useSwapNetwork_convertByPath(
  sourceToken: Asset,
  targetToken: Asset,
  path: string[],
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    sourceToken === Asset.BTC || targetToken === Asset.BTC
      ? 'liquidityBTCProtocol'
      : 'swapNetwork',
    'convertByPath',
  );
  return {
    send: () => {
      let args = [
        path,
        amount,
        bignumber(minReturn).minus(bignumber(minReturn).mul(0.005)).toFixed(0), // removes 0.5%
        {
          from: account,
          value: sourceToken === Asset.BTC ? amount : '0',
        },
      ];

      if (sourceToken === Asset.BTC || targetToken === Asset.DOC) {
        args = [
          path,
          amount,
          bignumber(minReturn)
            .minus(bignumber(minReturn).mul(0.005))
            .toFixed(0), // removes 0.5%
          account,
          '0x0000000000000000000000000000000000000000',
          '0',
          {
            from: account,
            value: sourceToken === Asset.BTC ? amount : '0',
          },
        ];
      }

      return send(...args);
    },
    ...rest,
  };
}
