import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { getLendingContractName } from '../../../utils/blockchain/contract-helpers';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { Asset } from 'types/asset';
import { useEffect, useState } from 'react';

export function useCheckLiquidity(
  amount: string,
  leverage: number,
  position: string,
) {
  const [borrowedAmount, setBorrowedAmount] = useState(0);
  const [contract, setContract] = useState(getLendingContractName(Asset.BTC));

  useEffect(() => {
    setBorrowedAmount((leverage - 1) * parseFloat(amount));
  }, [amount, leverage]);

  useEffect(() => {
    setContract(
      position === 'LONG'
        ? getLendingContractName(Asset.BTC)
        : getLendingContractName(Asset.DOC),
    );
  }, [position]);

  const liquidity: number = parseFloat(
    weiTo18(useCacheCallWithValue(contract, 'marketLiquidity', '0').value),
  );

  return { liquidity: liquidity, sufficient: borrowedAmount < liquidity };
}
