import { Asset } from 'types/asset';
import {
  getContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';
import { TxType } from '../../../store/global/transactions-store/types';

export function useAddLiquidity(
  asset: Asset,
  amount: string,
  minReturn: string,
) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    asset === Asset.BTC ? 'liquidityBTCProtocol' : 'liquidityProtocol',
    'addLiquidity',
  );

  return {
    deposit: (nonce?: number, approveTx?: string | null) => {
      return send(
        [
          asset === Asset.BTC
            ? getContract('liquidityProtocol').address
            : getTokenContract(asset).address,
          amount,
          minReturn,
        ],
        {
          from: account,
          value: asset === Asset.BTC ? amount : '0',
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
