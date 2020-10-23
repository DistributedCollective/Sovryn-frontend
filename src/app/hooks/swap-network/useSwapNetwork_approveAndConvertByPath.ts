import { bignumber } from 'mathjs';
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { TransactionStatus } from 'types/transaction-status';
import { useTokenAllowance } from '../useTokenAllowanceForLending';
import { useTokenApprove } from '../useTokenApproveForLending';
import { useCallback, useEffect, useState } from 'react';
import { appContracts } from '../../../utils/blockchain/app-contracts';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { useSwapNetwork_convertByPath } from './useSwapNetwork_convertByPath';

enum TxType {
  NONE = 'none',
  APPROVE = 'approve',
  SWAP = 'swap',
}

export function useSwapNetwork_approveAndConvertByPath(
  path: string[],
  amount: string,
  minReturn: string,
) {
  let token = Asset.DOC;
  try {
    token = AssetsDictionary.getByTokenContractAddress(path[0]).asset;
  } catch (e) {
    //
  }

  const allowance = useTokenAllowance(token, appContracts.swapNetwork.address);

  const {
    approve,
    txHash: approveTx,
    status: approveStatus,
    loading: approveLoading,
  } = useTokenApprove(token, appContracts.swapNetwork.address);

  const {
    send,
    txHash: tradeTx,
    status: tradeStatus,
    loading: tradeLoading,
  } = useSwapNetwork_convertByPath(path, amount, minReturn);

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
    if (bignumber(amount).greaterThan(allowance.value)) {
      handleApprove(toWei('1000000', 'ether'));
    } else {
      handleTrade();
    }
  }, [amount, allowance.value, handleApprove, handleTrade]);

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
