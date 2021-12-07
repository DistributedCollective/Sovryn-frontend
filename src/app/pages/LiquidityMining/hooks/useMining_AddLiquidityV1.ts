import { Asset } from 'types/asset';
import {
  getAmmContract,
  getAmmContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { TxType } from '../../../../store/global/transactions-store/types';
import { useMemo } from 'react';

export function useMining_AddLiquidityV1(
  pool: Asset,
  reserveTokens: Asset[],
  reserveAmounts: string[],
  minReturn: string,
) {
  const account = useAccount();

  const btcTokenIndex = useMemo(() => reserveTokens.indexOf(Asset.RBTC), [
    reserveTokens,
  ]);

  const { send, ...rest } = useSendContractTx(
    btcTokenIndex !== -1 ? 'BTCWrapperProxy' : getAmmContractName(pool),
    btcTokenIndex !== -1 ? 'addLiquidityToV1' : 'addLiquidity',
  );
  return {
    deposit: (nonce?: number, approveTx?: string | null) => {
      const params = [
        reserveTokens
          .filter(item => !!item)
          .map(item => getTokenContract(item).address),
        reserveAmounts.filter(item => !!item),
        minReturn,
      ];

      if (btcTokenIndex !== -1) {
        // making btc as first element
        const btcToken = reserveTokens[btcTokenIndex];
        const btcAmount = reserveAmounts[btcTokenIndex];
        delete reserveTokens[btcTokenIndex];
        delete reserveAmounts[btcTokenIndex];
        reserveTokens.unshift(btcToken);
        reserveAmounts.unshift(btcAmount);
        // add converter contract at the beginning of array
        params.unshift(getAmmContract(pool).address);
      }

      return send(
        params,
        {
          from: account,
          value: btcTokenIndex === -1 ? '0' : reserveAmounts[0],
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
