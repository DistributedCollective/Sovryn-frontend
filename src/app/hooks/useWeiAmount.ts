import { useCallback, useEffect, useState } from 'react';
import { toWei, Unit } from 'web3-utils';

export function useWeiAmount(amount: any, unit: Unit = 'ether') {
  const handleCalculation = useCallback(() => {
    try {
      return toWei(String(amount || '0'), unit).toString();
    } catch (e) {
      return toWei('0').toString();
    }
  }, [amount, unit]);

  const [weiAmount, setWeiAmount] = useState(handleCalculation());

  useEffect(() => {
    setWeiAmount(handleCalculation());
  }, [amount, unit, handleCalculation]);

  return weiAmount;
}
