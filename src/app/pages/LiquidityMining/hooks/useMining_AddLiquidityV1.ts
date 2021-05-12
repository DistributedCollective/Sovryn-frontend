import { Asset } from 'types/asset';
import {
  getAmmContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxType } from '../../../../store/global/transactions-store/types';

export function useMining_AddLiquidityV1(
  pool: Asset,
  reserveTokens: Asset[],
  reserveAmounts: string[],
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'addLiquidityToV1',
  );
  return {
    deposit: (nonce?: number, approveTx?: string | null) => {
      const btcIndex = reserveTokens.indexOf(Asset.RBTC);

      if (btcIndex !== -1) {
        // making btc as first element
        const btcToken = reserveTokens[btcIndex];
        const btcAmount = reserveAmounts[btcIndex];
        delete reserveTokens[btcIndex];
        delete reserveAmounts[btcIndex];
        reserveTokens.unshift(btcToken);
        reserveAmounts.unshift(btcAmount);
      }

      console.log({
        params: [
          getAmmContract(pool).address,
          reserveTokens
            .filter(item => !!item)
            .map(item => getTokenContract(item).address),
          reserveAmounts.filter(item => !!item),
          minReturn,
        ],
      });

      return send(
        [
          getAmmContract(pool).address,
          reserveTokens
            .filter(item => !!item)
            .map(item => getTokenContract(item).address),
          reserveAmounts.filter(item => !!item),
          minReturn,
        ],
        {
          from: account,
          value: btcIndex === -1 ? '0' : reserveAmounts[0],
          nonce,
          gas: gasLimit[TxType.ADD_LIQUIDITY],
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.ADD_LIQUIDITY,
        },
      );
    },
    ...rest,
  };
}
