import { Asset } from 'types/asset';
import {
  getAmmContractName,
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
    getAmmContractName(pool),
    'addLiquidity',
  );
  return {
    deposit: (nonce?: number, approveTx?: string | null) => {
      // const btcIndex = reserveTokens.indexOf(Asset.BTC);

      return send(
        [
          reserveTokens.map(item => getTokenContract(item).address),
          reserveAmounts,
          totalSupply,
        ],
        {
          from: account,
          // value: btcIndex === -1 ? '0' : reserveAmounts[btcIndex],
          value: '0',
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
