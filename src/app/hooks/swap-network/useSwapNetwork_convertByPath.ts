import { bignumber } from 'mathjs';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset } from '../../../types/asset';
import { TxType } from '../../../store/global/transactions-store/types';

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
      ? 'BTCWrapperProxy'
      : 'swapNetwork',
    'convertByPath',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      let args = [
        path,
        amount,
        bignumber(minReturn).minus(bignumber(minReturn).mul(0.005)).toFixed(0), // removes 0.5%
      ];

      let config: any = {
        from: account,
        value: sourceToken === Asset.BTC ? amount : '0',
        nonce,
      };

      if (sourceToken !== Asset.BTC && targetToken !== Asset.BTC) {
        args = [
          path,
          amount,
          bignumber(minReturn)
            .minus(bignumber(minReturn).mul(0.005))
            .toFixed(0), // removes 0.5%
          account,
          '0x0000000000000000000000000000000000000000',
          '0',
        ];

        config = {
          from: account,
          nonce,
        };
      }

      return send(args, config, {
        type: TxType.CONVERT_BY_PATH,
        approveTransactionHash: approveTx,
      });
    },
    ...rest,
  };
}
