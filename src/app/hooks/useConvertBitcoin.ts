import { TransactionStatus } from 'types/transaction-status';
import { useCallback, useEffect, useState } from 'react';
import { useWrapBitcoin } from './useWrapBitcoin';
import { useUnwrapBitcoin } from './useUnwrapBitcoin';

export enum ConvertionType {
  NONE = 'none',
  WRAP = 'wrap',
  UNWRAP = 'unwrap',
}

export function useConvertBitcoin(type: ConvertionType, weiAmount: string) {
  const { wrap, ...wrapRest } = useWrapBitcoin(weiAmount);

  const { unwrap, ...unwrapRest } = useUnwrapBitcoin(weiAmount);

  const handleWrap = useCallback(() => {
    if (!wrapRest.loading) {
      wrap();
    }
  }, [wrap, wrapRest]);

  const handleUnwrap = useCallback(() => {
    if (!unwrapRest.loading) {
      unwrap();
    }
  }, [unwrap, unwrapRest]);

  const handleTx = useCallback(() => {
    if (type === ConvertionType.WRAP) {
      handleWrap();
    }
    if (type === ConvertionType.UNWRAP) {
      handleUnwrap();
    }
  }, [type, handleWrap, handleUnwrap]);

  const [txState, setTxState] = useState<{
    type: ConvertionType;
    txHash: string;
    status: TransactionStatus;
    loading: boolean;
  }>({
    type: ConvertionType.NONE,
    txHash: null as any,
    status: TransactionStatus.NONE,
    loading: false,
  });

  useEffect(() => {
    if (!unwrapRest.loading && wrapRest.status !== TransactionStatus.NONE) {
      setTxState({
        type: ConvertionType.WRAP,
        ...wrapRest,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(wrapRest)]);

  useEffect(() => {
    if (!wrapRest.loading && unwrapRest.status !== TransactionStatus.NONE) {
      setTxState({
        type: ConvertionType.UNWRAP,
        ...unwrapRest,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(unwrapRest)]);

  return {
    convert: () => handleTx(),
    ...txState,
  };
}
