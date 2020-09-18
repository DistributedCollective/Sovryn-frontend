import { Asset } from '../../../types/asset';
import { useGetMaxEscrowAmount } from './useGetMaxEscrowAmount';
import { useMaxSwapSize } from '../protocol/useMaxSwapSize';
import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';

export function useMaxDepositAmount(asset: Asset, leverageWeiAmount: string) {
  const {
    value: escrowAmount,
    loading: escrowLoading,
    error: escrowError,
  } = useGetMaxEscrowAmount(asset, leverageWeiAmount);
  const {
    value: maxSwapSize,
    loading: swapLoading,
    error: swapError,
  } = useMaxSwapSize();

  const [value, setValue] = useState('0');

  useEffect(() => {
    // math's min function breaks bignumber, so using if/else condition instead.
    if (bignumber(escrowAmount).lessThan(maxSwapSize)) {
      setValue(escrowAmount);
    } else {
      setValue(maxSwapSize);
    }
  }, [escrowAmount, maxSwapSize]);

  return {
    value,
    loading: escrowLoading || swapLoading,
    error: escrowError || swapError || null,
  };
}
