import { Asset } from 'types/asset';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import {
  SendTxResponseInterface,
  useSendContractTx,
} from './useSendContractTx';
import { useAccount } from './useAccount';

/**
 * @deprecated
 * @param asset
 */
export function useUnLendTokensRBTC(
  asset: Asset,
): Partial<SendTxResponseInterface> & { unLend: (weiAmount: string) => void } {
  const account = useAccount();
  const { send, ...rest } = useSendContractTx(
    getLendingContractName(asset),
    'burnToBTC',
  );
  return {
    unLend: (weiAmount: string) => send(account, weiAmount, { from: account }),
    ...rest,
  };
}
