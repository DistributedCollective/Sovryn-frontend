import { Asset } from 'types/asset';
import { appContracts } from '../../../utils/blockchain/app-contracts';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useSwapNetwork_convertByPath } from './useSwapNetwork_convertByPath';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';

function resolveContract(sourceToken: Asset, targetToken: Asset) {
  return sourceToken === Asset.BTC || targetToken === Asset.BTC
    ? appContracts.liquidityBTCProtocol.address
    : appContracts.swapNetwork.address;
}

export function useSwapNetwork_approveAndConvertByPath(
  path: string[],
  amount: string,
  minReturn: string,
) {
  let sourceToken = Asset.DOC;
  let targetToken = Asset.BTC;
  try {
    sourceToken = AssetsDictionary.getByTokenContractAddress(path[0]).asset;
    targetToken = AssetsDictionary.getByTokenContractAddress(
      path[path.length - 1],
    ).asset;
  } catch (e) {
    //
  }

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
      if (sourceToken !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          sourceToken,
          resolveContract(sourceToken, targetToken),
          amount,
          // toWei('1000000', 'ether'),
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
