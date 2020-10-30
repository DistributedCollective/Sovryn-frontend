import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { appContracts } from '../../../utils/blockchain/app-contracts';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useSwapNetwork_convertByPath } from './useSwapNetwork_convertByPath';
import { bignumber } from 'mathjs';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  SWAP = 'swap',
}

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

  const allowance = useTokenAllowance(
    sourceToken,
    resolveContract(sourceToken, targetToken),
  );

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(sourceToken, resolveContract(sourceToken, targetToken));

  const {
    send,
    txHash: tradeTx,
    status: tradeStatus,
    loading: tradeLoading,
  } = useSwapNetwork_convertByPath(
    sourceToken,
    targetToken,
    path,
    amount,
    minReturn,
  );

  const handleApprove = useCallback(
    (weiAmount: string) => {
      approve(weiAmount);
    },
    [approve],
  );

  const handleTrade = useCallback(() => {
    if (!tradeLoading) {
      send();
    }
  }, [send, tradeLoading]);

  const handleTx = useCallback(() => {
    if (
      sourceToken !== Asset.BTC &&
      bignumber(amount).greaterThan(allowance.value)
    ) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleTrade();
    }
  }, [amount, allowance.value, handleApprove, handleTrade, sourceToken]);

  const [txState, setTxState] = useState<{
    type: TxType;
    txHash: string;
    status: TransactionStatus;
    loading: boolean;
  }>({
    type: TxType.NONE,
    txHash: null as any,
    status: TransactionStatus.NONE,
    loading: false,
  });

  useEffect(() => {
    if (approveStatus === TransactionStatus.SUCCESS) {
      handleTrade();
    }
    // eslint-disable-next-line
  }, [approveStatus]);

  useEffect(() => {
    if (!tradeLoading && approveStatus !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.APPROVE,
        txHash: approveTx,
        status: approveStatus,
        loading: approveLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveLoading, approveTx, approveStatus]);

  useEffect(() => {
    if (!approveLoading && tradeStatus !== TransactionStatus.NONE) {
      setTxState({
        type: TxType.SWAP,
        txHash: tradeTx,
        status: tradeStatus,
        loading: tradeLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeLoading, tradeTx, tradeStatus]);

  return {
    send: () => handleTx(),
    ...txState,
  };
}
