import { Asset } from 'types/asset';
import {
  getAmmContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useRemoveV1Liquidity(
  pool: Asset,
  amount: string,
  reserveTokens: Asset[],
  reserveMinReturnAmounts: string[],
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getAmmContractName(pool),
    'removeLiquidity',
  );

  return {
    withdraw: (nonce?: number, approveTx?: string | null) =>
      send(
        [
          amount,
          reserveTokens.map(item => getTokenContract(item).address),
          reserveMinReturnAmounts,
        ],
        {
          from: account,
        },
        {
          approveTransactionHash: approveTx,
          type: TxType.REMOVE_LIQUIDITY,
        },
      ),
    ...rest,
  };
}
