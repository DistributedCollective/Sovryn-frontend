import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { useLending_totalAssetSupply } from './useLending_totalAssetSupply';
import { useLending_totalAssetBorrow } from './useLending_totalAssetBorrow';

interface Response {
  isSufficient: boolean;
  availableAmount: string;
  loading: boolean;
}

/**
 * Test if lending pool balance is sufficient for redeeming or borrowing.
 * @param asset
 * @param weiAmount
 */
export function useLending_testAvailableSupply(
  asset: Asset,
  weiAmount: string,
): Response {
  const [isSufficient, setIsSufficient] = useState(false);
  const [availableAmount, setAvailableAmount] = useState('0');

  const { value: supply, loading: loadingSupply } = useLending_totalAssetSupply(
    asset,
  );
  const {
    value: borrowed,
    loading: loadingBorrowed,
  } = useLending_totalAssetBorrow(asset);

  useEffect(() => {
    let max = bignumber(supply).sub(borrowed);

    if (max.lessThan(0)) {
      max = bignumber(0);
    }
    setAvailableAmount(max.toFixed());
    setIsSufficient(max.greaterThanOrEqualTo(weiAmount || '0'));
  }, [supply, borrowed, weiAmount]);

  return {
    isSufficient,
    availableAmount,
    loading: loadingSupply || loadingBorrowed,
  };
}
