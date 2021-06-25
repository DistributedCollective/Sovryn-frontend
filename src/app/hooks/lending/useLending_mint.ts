import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { TxType } from 'store/global/transactions-store/types';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useLending_mint(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    asset === Asset.RBTC ? 'mintWithBTC' : 'mint',
  );
  return {
    send: (nonce?: number, approveTx?: string | null) =>
      asset === Asset.RBTC
        ? send(
            [account, true],
            { from: account, value: weiAmount, nonce },
            {
              approveTransactionHash: approveTx,
              type: TxType.LEND,
            },
          )
        : send(
            [account, weiAmount, true],
            { from: account, nonce },
            {
              approveTransactionHash: approveTx,
              type: TxType.LEND,
            },
          ),
    ...rest,
  };
}
