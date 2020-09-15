import { useCallback, useEffect, useState } from 'react';
import { bignumber } from 'mathjs';

export function useIsAmountWithinLimits(
  amount: string,
  min?: string,
  max?: string,
): boolean {
  const validate = useCallback(() => {
    try {
      const bnAmount = bignumber(amount);
      const validateMin =
        (min !== undefined && bnAmount.greaterThanOrEqualTo(bignumber(min))) ||
        (min === undefined && bnAmount.greaterThan(0));
      const validateMax =
        (max !== undefined && bnAmount.lessThanOrEqualTo(bignumber(max))) ||
        max === undefined;
      return amount !== undefined && validateMin && validateMax;
    } catch (e) {
      return false;
    }
  }, [amount, min, max]);

  const [value, setValue] = useState<boolean>(validate());

  useEffect(() => {
    setValue(validate());
  }, [amount, min, max, validate]);

  return value;
}
