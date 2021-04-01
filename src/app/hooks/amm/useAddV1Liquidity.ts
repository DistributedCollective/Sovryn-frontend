import { Asset } from 'types/asset';
import {
  getAmmContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useAddV1Liquidity(
  pool: Asset,
  reserveTokens: Asset[],
  reserveAmounts: string[],
  totalSupply: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    'BTCWrapperProxy',
    'addLiquidityToV1',
  );
  return {
    deposit: (nonce?: number, approveTx?: string | null) => {
      const btcIndex = reserveTokens.indexOf(Asset.BTC);

      if (btcIndex !== -1) {
        // making btc as first element
        const btcToken = reserveTokens[btcIndex];
        const btcAmount = reserveAmounts[btcIndex];
        delete reserveTokens[btcIndex];
        delete reserveAmounts[btcIndex];
        reserveTokens.unshift(btcToken);
        reserveAmounts.unshift(btcAmount);
      }

      return send(
        [
          getAmmContract(pool).address,
          reserveTokens
            .filter(item => !!item)
            .map(item => getTokenContract(item).address),
          reserveAmounts.filter(item => !!item),
          totalSupply,
        ],
        {
          from: account,
          value: btcIndex === -1 ? '0' : reserveAmounts[0],
          nonce,
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
