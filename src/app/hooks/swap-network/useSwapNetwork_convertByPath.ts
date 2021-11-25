import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { Asset, AppMode } from '../../../types';
import { TxType } from '../../../store/global/transactions-store/types';
import { gasLimit, currentNetwork } from '../../../utils/classifiers';

export function useSwapNetwork_convertByPath(
  sourceToken: Asset,
  targetToken: Asset,
  path: string[],
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    sourceToken === Asset.RBTC || targetToken === Asset.RBTC
      ? 'BTCWrapperProxy'
      : 'swapNetwork',
    'convertByPath',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) => {
      let args = [path, amount, minReturn];

      let config: any = {
        from: account,
        value: sourceToken === Asset.RBTC ? amount : '0',
        gas: gasLimit[TxType.CONVERT_BY_PATH],
        nonce,
      };

      if (sourceToken !== Asset.RBTC && targetToken !== Asset.RBTC) {
        args = [
          path,
          amount,
          minReturn,
          account,
          '0x0000000000000000000000000000000000000000',
          '0',
        ];

        // add affiliate params on testnet
        // todo make sure to move it to mainnet once contract deployed
        if (currentNetwork === AppMode.TESTNET) {
          args = [...args, ['0x0000000000000000000000000000000000000000', '0']];
        }

        config = {
          from: account,
          gas: gasLimit[TxType.CONVERT_BY_PATH],
          nonce,
        };
      }

      return send(args, config, {
        type: TxType.CONVERT_BY_PATH,
        approveTransactionHash: approveTx,
        customData: {
          sourceToken,
          targetToken,
          amount,
          date: new Date().getTime() / 1000,
          minReturn,
        },
      });
    },
    ...rest,
  };
}
