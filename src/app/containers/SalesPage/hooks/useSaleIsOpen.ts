import { useEffect, useState } from 'react';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';

export function useSaleIsOpen() {
  const { value: isStopSale } = useCacheCallWithValue(
    'CrowdSale',
    'isStopSale',
    false,
  );

  const { value: end } = useCacheCallWithValue('CrowdSale', 'end', '0');

  const { value: availableTokens } = useCacheCallWithValue(
    'CrowdSale',
    'availableTokens',
    '0',
  );

  const [isSaleOpen, setIsSaleOpen] = useState(false);

  useEffect(() => {
    setIsSaleOpen(
      !isStopSale &&
        Number(end) > 0 &&
        Date.now() < Number(end) * 10e3 &&
        Number(availableTokens) > 0,
    );
  }, [isStopSale, end, availableTokens]);

  return isSaleOpen;
}
