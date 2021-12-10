import { Asset } from 'types/asset';
import { appContracts } from '../../../utils/blockchain/app-contracts';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useSwapNetwork_convertByPath } from './useSwapNetwork_convertByPath';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';

function resolveContract(sourceToken: Asset, targetToken: Asset) {
  return sourceToken === Asset.RBTC || targetToken === Asset.RBTC
    ? appContracts.BTCWrapperProxy.address
    : appContracts.swapNetwork.address;
}

const resolveAsset = (address: string, _default: Asset) => {
  try {
    return (
      AssetsDictionary.getByTokenContractAddress(address).asset || _default
    );
  } catch (error) {
    return _default;
  }
};

export function useSwapNetwork_approveAndConvertByPath(
  path: string[],
  amount: string,
  minReturn: string,
) {
  const sourceToken = resolveAsset(path[0], Asset.RBTC);
  const targetToken = resolveAsset(path[path.length - 1], Asset.SOV);

  const { send, ...txState } = useSwapNetwork_convertByPath(
    sourceToken,
    targetToken,
    path,
    amount,
    minReturn,
  );

  return {
    send: async () => {
      let tx: CheckAndApproveResult = {};
      if (sourceToken !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          sourceToken,
          resolveContract(sourceToken, targetToken),
          amount,
        );
        if (tx.rejected) {
          return;
        }
      }
      await send(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}
