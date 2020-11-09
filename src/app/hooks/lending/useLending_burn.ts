import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useSendContractTx } from '../useSendContractTx';
import { useAccount } from '../useAccount';

export function useLending_burn(asset: Asset, weiAmount: string) {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    asset === Asset.BTC ? 'burnToBTC' : 'burn',
  );
  return {
    send: () => send(account, weiAmount, { from: account }),
    ...rest,
  };
}
