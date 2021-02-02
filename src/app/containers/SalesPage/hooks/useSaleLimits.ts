import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { selectSalesPage } from '../selectors';

export function useSaleLimits() {
  const { maxDeposit, minDeposit, totalDeposits } = useSelector(
    selectSalesPage,
  );
  const [max, setMax] = useState(maxDeposit);

  useEffect(() => {
    let _max = bignumber(maxDeposit).sub(totalDeposits);
    if (_max.lessThanOrEqualTo(0)) {
      _max = bignumber(0);
    }
    setMax(Number(_max));
  }, [maxDeposit, totalDeposits]);

  return {
    minDeposit,
    maxDeposit: max,
    totalDeposits,
    tierLimit: maxDeposit,
  };
}
