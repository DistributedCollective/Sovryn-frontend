import { useCacheCallWithValue } from '../useCacheCallWithValue';
import {
  getLendingContractName,
  getTokenContractName,
} from '../../../utils/blockchain/contract-helpers';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { Asset } from 'types/asset';
import { useEffect, useState } from 'react';

export function useCheckLiquidity(
  amount: string,
  leverage: number,
  position: string,
  collateralAsset: Asset,
) {
  const [borrowedAmount, setBorrowedAmount] = useState(0);
  useEffect(() => {
    setBorrowedAmount((leverage - 1) * parseFloat(amount));
  }, [amount, leverage]);

  //Get liquidity amount from contract
  const contract =
    position === 'LONG'
      ? getLendingContractName(collateralAsset)
      : getTokenContractName(collateralAsset);

  const totalSupplied: number = parseFloat(
    weiTo18(useCacheCallWithValue(contract, 'marketLiquidity', '0').value),
  );
  const totalBorrowed: number = parseFloat(
    weiTo18(useCacheCallWithValue(contract, 'totalAssetBorrow', '0').value),
  );
  const liquidity: number = totalSupplied - totalBorrowed;

  return { liquidity: liquidity, sufficient: borrowedAmount < liquidity };
}
