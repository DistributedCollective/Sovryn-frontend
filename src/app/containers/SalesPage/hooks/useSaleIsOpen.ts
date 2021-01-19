import { useEffect, useState } from 'react';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';

interface Response {
  open: boolean;
  ended: boolean;
}

export function useSaleIsOpen(): Response {
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
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const _ended =
      (Number(end) > 0 && Date.now() >= Number(end) * 1e3) ||
      (Number(end) > 0 && Number(availableTokens) <= 0);
    setEnded(_ended);
    setIsSaleOpen(!isStopSale && !_ended && Number(availableTokens) > 0);
  }, [isStopSale, end, availableTokens]);

  return {
    open: isSaleOpen,
    ended,
  };
}
