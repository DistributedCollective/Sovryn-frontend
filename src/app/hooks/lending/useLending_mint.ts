import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useLending_mint(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    asset === Asset.BTC ? 'mintWithBTC' : 'mint',
  );
  return {
    send: () =>
      asset === Asset.BTC
        ? send(account, { from: account, value: weiAmount })
        : send(account, weiAmount, { from: account }),
    ...rest,
  };
}
