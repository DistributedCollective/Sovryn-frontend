import { Asset } from 'types/asset';
import {
  getAmmContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { TxType } from '../../../../store/global/transactions-store/types';
import { useAccount } from '../../../hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';

export function useMining_RemoveLiquidityV1(
  pool: Asset,
  amount: string,
  reserveTokens: Asset[],
  reserveMinReturnAmounts: string[],
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'removeLiquidityFromV1',
  );

  return {
    withdraw: (nonce?: number, approveTx?: string | null) => {
      const btcIndex = reserveTokens.indexOf(Asset.RBTC);
      if (btcIndex !== -1) {
        // making btc as first element
        const btcToken = reserveTokens[btcIndex];
        const btcAmount = reserveMinReturnAmounts[btcIndex];
        delete reserveTokens[btcIndex];
        delete reserveMinReturnAmounts[btcIndex];
        reserveTokens.unshift(btcToken);
        reserveMinReturnAmounts.unshift(btcAmount);
      }

      console.log({
        props: [
          getAmmContract(pool).address,
          amount,
          reserveTokens
            .filter(item => !!item)
            .map(item => getTokenContract(item).address),
          reserveMinReturnAmounts.filter(item => !!item),
        ],
      });

      return send(
        [
          getAmmContract(pool).address,
          amount,
          reserveTokens
            .filter(item => !!item)
            .map(item => getTokenContract(item).address),
          reserveMinReturnAmounts.filter(item => !!item),
        ],
        {
          from: account,
          gas: gasLimit[TxType.REMOVE_LIQUIDITY],
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.REMOVE_LIQUIDITY,
        },
      );
    },
    ...rest,
  };
}
